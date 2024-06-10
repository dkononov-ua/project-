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
import { UserInfo } from 'src/app/interface/info';
import { PaginationConfig } from 'src/app/config/paginator';
import { Subject } from 'rxjs';
import { CounterService } from 'src/app/services/counter.service';
import { PageEvent } from '@angular/material/paginator';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { ViewComunService } from './view-comun.service';
import { DeleteSubsComponent } from '../delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { LocationHouseService } from 'src/app/services/location-house.service';


interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}

interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  flat_name: string;
  lastMessage: string;
  isSelected?: boolean;
  unread: number;

  infFlat: {
    imgs: any;
    flat: string;
  }

  infUser: {
    img: any;
    inf: {
      firstName: string;
      lastName: string;
      surName: string;
    }
  }

  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}
@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
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

export class SubscribersDiscusComponent implements OnInit, OnDestroy {

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
  chosenFlat: chosenFlat | null = null;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  selectedView!: any;
  selectedViewName!: string;
  chatExists = false;
  currentPhotoIndex: number = 0;
  // статуси
  loading: boolean | undefined;
  isLoadingImg: boolean = false;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  page: number = 0;
  indexPage: number = 1;
  ratingOwner: number = 0;
  chats: Chat[] = [];
  chatsUpdates: number | undefined;
  counterUserDiscussio: any;

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
  startY = 0;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  photoViewing: boolean = false;
  panelHeight: string = '0px'; // Початкова висота панелі
  panelWidth: string = '0px'; // Початкова висота панелі
  iconRotation: number = 0;

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
          this.indexPage = 2;
          // Запитую рейтинг власника
          await this.getRating(this.chosenFlat?.owner.user_id);
          // Перевіряю чи створений чат
          await this.checkChatExistence(this.chosenFlat?.flat.flat_id);
          // Формую локацію на мапі
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.chosenFlat);
        }
      })
    );

    // Підписка на отримання кількості карток
    this.subscriptions.push(
      this.counterService.counterUserDiscussio$.subscribe(async data => {
        this.counterUserDiscussio = data;
        this.counterFound = this.counterUserDiscussio;
      })
    );

    // Підписка на зміну параметрів маршруту
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.page = params['indexPage'] || 1;
        this.indexPage = Number(this.page);
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

  // Перевірка на існування чату
  async checkChatExistence(choseFlatId: any): Promise<any> {
    this.chatExists = await this.sendMessageService.checkChatExistence(choseFlatId);
    // console.log(this.chatExists)
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
    this.startY = 0;
  }

  onPanMove(event: any): void {
    const maxDeltaY = 100;
    const minDeltaY = 30;
    const maxDeltaX = 100;
    const minDeltaX = 30;

    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);

    if (absDeltaY > absDeltaX) {
      if (absDeltaY > minDeltaY) {
        this.panelHeight = Math.min(event.deltaY, maxDeltaY) + 'px';
        this.iconRotation = event.deltaY;
      } else {
        this.panelHeight = '0px';
      }
    }

    if (absDeltaX > absDeltaY) {
      if (absDeltaX > minDeltaX) {
        this.panelWidth = Math.min(event.deltaX / 3, maxDeltaX) + 'px';
      } else {
        this.panelWidth = '0px';
      }
    }
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    const minDeltaY = 100;
    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);
    if (absDeltaX > minDeltaX && absDeltaX > absDeltaY) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
        this.panelHeight = '0px';
        this.panelWidth = '0px';
      } else {
        this.onSwiped('left');
        this.panelHeight = '0px';
        this.panelWidth = '0px';
      }
    } else if (absDeltaY > minDeltaY && absDeltaY > absDeltaX) {
      if (event.deltaY > 0) {
        this.onSwiped('down');
        this.panelWidth = '0px';

      } else {
        this.onSwiped('up');
        this.panelHeight = '0px';
        this.panelWidth = '0px';

      }
    } else {
      this.panelHeight = '0px';
    }
  }

  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    // console.log(direction)
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.goBack();
      }
    } else if (direction === 'left') {
      if (this.indexPage !== 1 && !this.chosenFlat) {
        this.indexPage++;
      } else if (this.chosenFlat && this.indexPage <= 3) {
        this.indexPage++;
      } else {
        this.goBack();
      }
    } else if (direction === 'down') {
      setTimeout(() => {
        location.reload();
      }, 200);
    } else if (direction === 'up') {

    }
  }

  // відправляю event початок свайпу
  onPanStartImg(event: any): void {
    this.startX = 0;
  }

  onPanEndImg(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwipedImg('right');
      } else {
        this.onSwipedImg('left');
      }
    }
  }

  // оброблюю свайп фото
  onSwipedImg(direction: string | undefined): void {
    if (direction === 'right') {
      this.prevPhoto();
    } else {
      this.nextPhoto();
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

  // Видалення дискусії
  async deleteSubscriber(flat: any): Promise<void> {
    this.cardsDataService.deleteFlatSub(flat, 'discussio');
    this.cardsDataService.getResultDeleteFlatSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Дискусію видалено');
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

  openOwner(index: number) {
    if (index === 0) {
      this.sharedService.setStatusMessage('Оселя');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(2) }, 1000);
    } else {
      this.sharedService.setStatusMessage('Представник оселі');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(3) }, 1000);
    }
  }

  async openChat() {
    try {
      this.sharedService.setStatusMessage('Завантажуємо чат...');
      const result = await this.sendMessageService.getFlatChats();
      if (result === 1) {
        this.sharedService.setStatusMessage('Відкриваємо чат');
        setTimeout(() => { this.sharedService.setStatusMessage(''); this.indexPage = 4; }, 1000);
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
    // localStorage.removeItem('selectedName');
    // localStorage.removeItem('house');
    // localStorage.removeItem('selectedComun');
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

}

