import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { DeleteSubsComponent } from '../delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { LocationHouseService } from 'src/app/services/location-house.service';

interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}

@Component({
  selector: 'app-subscriptions-user',
  templateUrl: './subscriptions-user.component.html',
  styleUrls: ['./subscriptions-user.component.scss'],
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

export class SubscriptionsUserComponent implements OnInit, OnDestroy {

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
  isLoadingImg: boolean = false;

  // параметри оселі
  chosenFlat: chosenFlat | null = null;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  currentPhotoIndex: number = 0;
  // статуси
  loading: boolean | undefined;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  page: number = 0;
  indexPage: number = 1;

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
  startX = 0;
  photoViewing: boolean = false;
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private router: Router,
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
      })
    );

    // Підписка на отримання даних обраної оселі
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        this.chosenFlat = data;
        // Якщо є обрана оселя
        if (this.chosenFlat) {
          this.indexPage = 2;
          // Формую локацію на мапі
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.chosenFlat);
        }
      })
    );
    // Підписка на отримання кількості карток
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(async data => {
        this.counterFound = Number(data);
      })
    );
  }

  ngOnDestroy() {
    this.choseSubscribeService.removeChosenFlatId(); // очищуємо вибрану оселю
    this.cardsDataService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onPanStart(event: any): void {
    this.startX = 0;
  }

  onPanMove(event: any): void {
    this.startX = event.deltaX;
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
        } else if (this.chosenFlat && this.indexPage <= 1) {
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

  // Видалення підписника
  async deleteSubscriber(flat: any): Promise<void> {
    this.cardsDataService.deleteFlatSub(flat, 'subscriptions');
    this.cardsDataService.getResultDeleteFlatSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Підписка видалена');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
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

  // Відкриваю локацію на мапі
  openMap() {
    this.sharedService.openMap(this.locationLink)
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    this.sharedService.copyToClipboard(textToCopy, message);
  }

}

