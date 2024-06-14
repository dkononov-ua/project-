import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { Subject } from 'rxjs';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { ViewComunService } from '../../../discussi/discussio-user/discus/view-comun.service';
import { DeleteSubsComponent } from '../../../discussi/discussio-user/delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { LocationHouseService } from 'src/app/services/location-house.service';

@Component({
  selector: 'app-functions-house',
  templateUrl: './functions-house.component.html',
  styleUrls: ['./functions-house.component.scss'],
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
    animations.top,
    animations.top2,
    animations.top3,
    animations.top4,
  ],
})

export class FunctionsHouseComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  private chatsUpdatesSubject = new Subject<number>();
  chatsUpdates$ = this.chatsUpdatesSubject.asObservable();

  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;

  // параметри оселі
  chosenFlat: any;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  selectedView!: any;
  selectedViewName!: string;
  chatExists = false;
  // показ карток
  page: number = 0;

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
  startY = 0;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  panelHeight: string = '0px'; // Початкова висота панелі
  panelWidth: string = '0px'; // Початкова висота панелі
  iconRotation: number = 0;
  currentLocation: string = '';

  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private selectedViewComun: ViewComunService,
    private router: Router,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private location: Location,
    private statusDataService: StatusDataService,
    private cardsDataService: CardsDataService,
    private sendMessageService: SendMessageService,
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
          // Перевіряю чи створений чат
          await this.checkChatExistence(this.chosenFlat?.flat.flat_id);
          // Формую локацію на мапі
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.chosenFlat);
        }
      })
    );

    this.currentLocation = this.location.path();
  }

  ngOnDestroy() {
    // this.choseSubscribeService.removeChosenFlatId(); // очищуємо вибрану оселю
    // this.cardsDataService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  // Перевірка на існування чату
  async checkChatExistence(choseFlatId: any): Promise<any> {
    this.chatExists = await this.sendMessageService.checkChatExistence(choseFlatId);
    // console.log(this.chatExists)
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    this.sharedService.copyToClipboard(textToCopy, message);
  }

  // Видалення карток
  async deleteSubscriber(flat: any): Promise<void> {
    if (this.currentLocation === '/subscribers-discuss') {
      this.cardsDataService.deleteFlatSub(flat, 'discussio');
    } else if (this.currentLocation === '/subscribers-user') {
      this.cardsDataService.deleteFlatSub(flat, 'subscribers');
    } else if (this.currentLocation === '/subscriptions-user') {
      this.cardsDataService.deleteFlatSub(flat, 'subscriptions');
    }
    this.cardsDataService.getResultDeleteFlatSubject().subscribe(result => {
      if (result.status === true) {
        if (this.currentLocation === '/subscribers-discuss') {
          this.sharedService.setStatusMessage('Дискусію видалено');
        } else if (this.currentLocation === '/subscribers-user') {
          this.sharedService.setStatusMessage('Підписника видалено');
        } else if (this.currentLocation === '/subscriptions-user') {
          this.sharedService.setStatusMessage('Підписку видалено');
        }
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }

  // Створюю чат з оселею
  async createChat(): Promise<void> {
    this.sendMessageService.createUserChat(this.chosenFlat?.flat.flat_id)
  }

  // openOwner(index: number) {
  //   if (index === 0) {
  //     this.sharedService.setStatusMessage('Оселя');
  //     setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(2) }, 1000);
  //   } else {
  //     this.sharedService.setStatusMessage('Представник оселі');
  //     setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(3) }, 1000);
  //   }
  // }

  async openChat() {
    try {
      this.sharedService.setStatusMessage('Завантажуємо чат...');
      const result = await this.sendMessageService.getFlatChats();
      if (result === 1) {
        this.sharedService.setStatusMessage('Відкриваємо чат');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 1000);
      } else if (result === 0) {
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 1000);
      }
    } catch (error) {
      console.error('Помилка при завантаженні чату:', error);
      this.sharedService.setStatusMessage('Помилка на сервері, спробуйте пізніше');
      setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
    }
  }

  // Відкриваю локацію на мапі
  openMap() {
    this.sharedService.openMap(this.locationLink)
  }

  // Перегляд статистики комунальних
  goToComun() {
    this.selectedView = this.chosenFlat?.flat.flat_id;
    this.selectedViewName = this.chosenFlat?.flat.flat_name;
    this.selectedViewComun.setSelectedView(this.selectedView);
    this.selectedViewComun.setSelectedName(this.selectedViewName);
    if (this.selectedView) {
      this.sharedService.setStatusMessage('Переходимо до статистики оселі');
      setTimeout(() => {
        this.router.navigate(['/communal'], { queryParams: { indexPage: 0 } });
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
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

  openFullScreenImage(photos: string): void {
    this.sharedService.openFullScreenImage(photos);
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



}


