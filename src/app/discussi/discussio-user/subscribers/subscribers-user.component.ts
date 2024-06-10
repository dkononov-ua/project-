import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { DeleteSubsComponent } from '../delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { LocationHouseService } from 'src/app/services/location-house.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { Location } from '@angular/common';

interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}

@Component({
  selector: 'app-subscribers-user',
  templateUrl: './subscribers-user.component.html',
  styleUrls: ['./subscribers-user.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class SubscribersUserComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;
  // шляхи до серверу
  isLoadingImg: boolean = false;

  // параметри оселі
  chosenFlat: chosenFlat | null = null;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  chatExists = false;
  currentPhotoIndex: number = 0;
  // статуси
  loading: boolean | undefined;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  indexPage: number = 1;
  ratingOwner: number = 0;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  // пагінатор
  offs = PaginationConfig.offs;
  counterFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;

  card_info: number = 0;
  reviews: any;
  numberOfReviews: any;
  startX = 0;
  photoViewing: boolean = false;
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private router: Router,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private location: Location,
    private statusDataService: StatusDataService,
    private cardsDataService: CardsDataService,
    private locationHouseService: LocationHouseService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
    });
  }

  async ngOnInit(): Promise<void> {
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );

    // Підписка на отримання айді обраної оселі
    this.subscriptions.push(
      this.choseSubscribeService.selectedFlatId$.subscribe(async selectedFlatId => {
        this.choseFlatId = selectedFlatId;
        // console.log(this.choseFlatId)
      })
    );

    // Підписка на отримання даних обраної оселі
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        this.chosenFlat = data;
        // Якщо є обрана оселя
        if (this.chosenFlat) {
          this.indexPage = 2;
          // Запитую рейтинг власника
          await this.getRating(this.chosenFlat?.owner.user_id);
          // Формую локацію на мапі
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.chosenFlat);
        }
      })
    );

    // Підписка на отримання кількості карток
    this.subscriptions.push(
      this.counterService.counterUserSubscribers$.subscribe(async data => {
        this.counterFound = Number(data);
      })
    );

    // console.log(this.subscriptions)
  }

  ngOnDestroy() {
    this.choseSubscribeService.removeChosenFlatId(); // очищуємо вибрану оселю
    this.cardsDataService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  // Отримую рейтинг користувача
  async getRating(user_id: any): Promise<any> {
    const response: any = await this.sharedService.getRatingOwner(user_id);
    // console.log(response);
    this.reviews = response.reviews;
    this.ratingOwner = response.ratingOwner;
    this.numberOfReviews = response.numberOfReviewsOwner;
  }

  onPanStart(event: any): void {
    this.startX = 0;
  }

  onPanEnd(event: any): void {
    const minDeltaX = 50;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        if (this.indexPage !== 0) {
          this.indexPage--;
        } else {
          this.router.navigate(['/user/info']);
        }
      } else {
        if (this.indexPage !== 1 && !this.chosenFlat) {
          this.indexPage++;
        } else if (this.chosenFlat && this.indexPage <= 3) {
          this.indexPage++;
        }
      }
    }
  }

  // Перемикання Фото в каруселі
  prevPhoto() {
    const length = this.chosenFlat?.img.length || 0;
    if (this.currentPhotoIndex !== 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    const length = this.chosenFlat?.img.length || 0;
    if (this.currentPhotoIndex < length) {
      this.currentPhotoIndex++;
    }
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    this.sharedService.copyToClipboard(textToCopy, message);
  }

  // Ухвалення до дискусії
  async approveSubscriber(choseFlatId: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson!), flat_id: choseFlatId, };
      const response: any = await this.http.post(this.serverPath + '/usersubs/accept', data).toPromise();
      if (response.status == true) {
        this.sharedService.setStatusMessage('Ухвалено');
        this.chosenFlat = null;
        this.counterService.getUserDiscussioCount();
        this.counterService.getUserSubscribersCount();
        this.cardsDataService.getSubInfo(this.offs)
        setTimeout(() => {
          this.sharedService.setStatusMessage('Переходимо до Дискусії');
          setTimeout(() => {
            this.router.navigate(['/subscribers-discuss']);
            this.sharedService.setStatusMessage('');
          }, 1000);
        }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'), location.reload(); }
      (error: any) => { this.sharedService.setStatusMessage('Помилка'), setTimeout(() => { location.reload(); }, 2000); console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

  // Видалення підписника
  async deleteSubscriber(flat: any): Promise<void> {
    this.cardsDataService.deleteFlatSub(flat, 'subscribers');
    this.cardsDataService.getResultDeleteFlatSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Підписника видалено');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }

  openOwner(index: number) {
    if (index === 0) {
      this.sharedService.setStatusMessage('Оселя');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(2) }, 1000);
    } else {
      this.sharedService.setStatusMessage('Представник оселі');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(3) }, 1000);
    }
  }

  // Відкриваю локацію на мапі
  openMap() {
    this.sharedService.openMap(this.locationLink)
  }

  async reportHouse(flat: any): Promise<void> {
    this.sharedService.reportHouse(flat);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }
}

