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
import { Subject, Subscription } from 'rxjs';
import { CounterService } from 'src/app/services/counter.service';
import { PageEvent } from '@angular/material/paginator';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';

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
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'], providers: [
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
    animations.right1,
  ],
})

export class CardsListComponent implements OnInit, OnDestroy {

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
  linkPath: string = '';

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
  private subscription: Subscription | null = null;


  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private router: Router,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private location: Location,
    private statusDataService: StatusDataService,
    private cardsDataService: CardsDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    //Підписка на шлях до серверу
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })

    //Підписка на отримання айді обраної оселі
    this.choseSubscribeService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.choseFlatId = selectedFlatId;
      // console.log(this.choseFlatId)
    });
    await this.getSubInfoFromService(this.offs);
  }

  async getSubInfoFromService(offs: number): Promise<void> {
    // console.log('getSubInfoFromService')
    this.cardsDataService.getSubInfo(offs);
    await this.getCardsData();
    await this.getCounterCards();
  }

  async getCardsData() {
    this.subscription = this.cardsDataService.cardsData$.subscribe(async (data: any) => {
      this.subscriptions = data;
      // console.log(this.subscriptions);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // отримання, кількіст дискусій та запит на якій я сторінці
  async getCounterCards() {
    const currentLocation = this.location.path();
    if (currentLocation === '/subscribers-discuss') {
      await this.counterService.getUserDiscussioCount();
      this.counterService.counterUserDiscussio$.subscribe(async data => {
        this.counterFound = Number(data);
      })
    }
    if (currentLocation === '/subscribers-user') {
      await this.counterService.getUserSubscribersCount();
      this.counterService.counterUserSubscribers$.subscribe(async data => {
        this.counterFound = Number(data);
      })
    }
    if (currentLocation === '/subscriptions-user') {
      await this.counterService.getUserSubscriptionsCount();
      this.counterService.counterUserSubscriptions$.subscribe(async data => {
        this.counterFound = Number(data);
      })
    }
    if (this.counterFound) {
      await this.getCurrentPageInfo();
    }
  }

  // Перемикання оселі
  async onFlatSelect(choseFlatId: any) {
    this.choseFlatId = choseFlatId; // обираємо айді оселі
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId); // передаємо всім компонентам айді оселі яке ми обрали
    this.cardsDataService.selectCard(); // Виводимо інформацію про обрану оселю
  }

  // пагінатор наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.cardsDataService.getSubInfo(offs);
    }
    this.getCurrentPageInfo()
  }

  // пагінатор попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.cardsDataService.getSubInfo(offs);
    }
    this.getCurrentPageInfo()
  }

  // пагінатор перевіряю кількість сторінок
  async getCurrentPageInfo(): Promise<string> {
    const itemsPerPage = this.pageEvent.pageSize;
    const currentPage = this.pageEvent.pageIndex + 1;
    const totalPages = Math.ceil(this.counterFound / itemsPerPage);
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    return `Сторінка ${currentPage} із ${totalPages}. Загальна кількість карток: ${this.counterFound}`;
  }
}

