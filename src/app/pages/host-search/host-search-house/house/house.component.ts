import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HouseInfo } from 'src/app/interface/info';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals, options, checkBox } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { GestureService } from 'src/app/services/gesture.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { CounterService } from 'src/app/services/counter.service';
import { ChoseSubscribeService } from 'src/app/services/chose-subscribe.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { animations } from '../../../../interface/animation';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { FilterService } from 'src/app/services/search/filter.service';
@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./../../../../style/search/search.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardSwipe', [
      transition('void => *', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('left => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
      transition('right => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
    animations.appearance,
  ]
})

export class HouseComponent implements OnInit, OnDestroy {

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
  options = options;
  checkBox = checkBox;
  // пагінатор
  offs = PaginationConfig.offs;
  optionsFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;
  // параметри оселі
  filteredFlats: HouseInfo[] | undefined;
  selectedFlat: HouseInfo | any;
  locationLink: any = '';
  currentCardIndex: number = 0;
  currentPhotoIndex: number = 0;
  // статуси
  loading = true;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  statusSubscriptionMessage: boolean | undefined;
  subscriptionStatus: any;
  statusMessage: any;
  indexPage: number = 1;
  reviews: any;
  numberOfReviews: any;
  ratingOwner: number | undefined;
  isCopiedMessage!: string;
  cardSwipeState: string = '';
  cardDirection: string = 'Discussio';
  card1: boolean = true;
  card2: boolean = false;
  startX = 0;
  photoViewing: boolean = false;
  isLoadingImg: boolean = false;
  authorization: boolean = true;
  subscriptions: any[] = [];
  isMobile = false;
  chosenFlatId: number | undefined;
  isSelectedFlatId: boolean = false;
  btnDisabled: boolean = false;
  allCards: any;

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private sharedService: SharedService,
    private counterService: CounterService,
    private choseSubscribeService: ChoseSubscribeService,
    private cardsDataService: CardsDataService,
    private statusMessageService: StatusMessageService,
  ) { }

  ngOnInit(): void {
    this.getCheckDevice();
    this.getServerPath();
    this.getAllCardsData();
    this.getСhoseFlatID();
  }

  // перевірка девайсу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // підписка на отримання даних по всім знайденим карткам
  async getAllCardsData() {
    this.subscriptions.push(
      this.cardsDataService.cardsData$.subscribe(async (data: any) => {
        this.allCards = data;
      })
    );
  }

  // Підписка на отримання айді обраної оселі
  async getСhoseFlatID() {
    this.subscriptions.push(
      this.choseSubscribeService.selectedFlatId$.subscribe(flatId => {
        this.chosenFlatId = Number(flatId);
        // console.log(this.chosenFlatId)
        if (this.chosenFlatId) {
          this.isSelectedFlatId = false;
          this.findUserCardIndex(this.chosenFlatId);
        } else {
          this.isSelectedFlatId = true;
        }
      })
    )
  }

  // Шукаю номер картки в масиві за його айді
  findUserCardIndex(cardId: number) {
    // console.log('findUserCardIndex', cardId);
    // console.log(this.allCards);
    const index = this.allCards?.findIndex((card: { flat: any; }) => Number(card.flat.flat_id) === cardId);
    if (index !== undefined && index !== -1) {
      this.currentCardIndex = index;
      // console.log(this.currentCardIndex)
      this.autoSelect();
    }
  }

  autoSelect() {
    this.selectedFlat = undefined;
    this.subscriptionStatus = 0;
    setTimeout(() => {
      this.selectedFlat = this.allCards![this.currentCardIndex];
      // console.log(this.selectedFlat)
      // console.log(this.selectedFlat.flat.flat_id)
      // console.log(this.chosenFlatId)
      if (this.selectedFlat.flat.flat_id !== this.chosenFlatId) {
        this.choseSubscribeService.setChosenFlatId(this.selectedFlat.flat.flat_id);
      }
      if (this.selectedFlat.flat.flat_id === this.chosenFlatId) {
        this.checkSubscribe(this.selectedFlat.flat.flat_id);
        // this.cardsDataService.selectCard();
      }
    }, 50);
  }

  toggleIndexPage() {
    if (this.indexPage === 1) {
      this.indexPage = 2;
    } else {
      this.indexPage = 1;
    }
  }

  async getSearchInfo() {
    this.filterService.filterChange$.subscribe(async () => {
      const filterValue = this.filterService.getFilterValue();
      const optionsFound = this.filterService.getOptionsFound();
      if (filterValue && optionsFound && optionsFound !== 0) {
        this.filteredFlats = filterValue;
        this.optionsFound = optionsFound;
      } else {
        this.optionsFound = 0;
        this.filteredFlats = undefined;
        this.selectedFlat = undefined;
      }
    })
  }

  onPrevCard() {
    if (this.currentCardIndex !== 0) {
      this.currentCardIndex--;
      setTimeout(() => {
        this.selectedCard();
      }, 500);
    }
  }

  onNextCard() {
    if (this.currentCardIndex < this.allCards!.length - 1) {
      this.currentCardIndex++;
      setTimeout(() => {
        this.selectedCard();
      }, 500);
    }
  }

  // Очищую selectedFlat потім встановлюю обраного користувача по його номеру в масиві та запускаю тригер
  // в сервісі для того щоб він передав у всі інші компоненти дані обраного користувача
  selectedCard() {
    this.selectedFlat = undefined;
    this.subscriptionStatus = 0;
    // console.log(this.currentCardIndex)
    setTimeout(() => {
      this.selectedFlat = this.allCards![this.currentCardIndex];
      // console.log(this.selectedFlat.flat.flat_id)
      this.choseSubscribeService.setChosenFlatId(this.selectedFlat.flat.flat_id);
      if (this.selectedFlat) {
        this.checkSubscribe(this.selectedFlat.flat.flat_id);
        // this.cardsDataService.selectCard();
      }
    }, 50);
  }

  calculateCardIndex(index: number): number {
    const length = this.filteredFlats?.length || 0;
    return (index + length) % length;
  }

  closeCard() {
    this.selectedFlat = undefined;
    this.choseSubscribeService.removeChosenFlatId();
    this.choseSubscribeService.setIndexPage(2);
  }

  // Підписуюсь
  async getSubscribe(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlat.flat.flat_id) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlat.flat.flat_id };
      try {
        const response: any = await this.http.post(this.serverPath + '/subs/subscribe', data).toPromise();
        // console.log(response)
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 0;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 1;
        }
        await this.checkSubscribe(this.selectedFlat.flat.flat_id);
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      this.btnDisabled = true;
      this.statusMessageService.setStatusMessage('Треба авторизуватись');
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
        setTimeout(() => {
          this.btnDisabled = false;
        }, 500);
      }, 2000);
    }
  }

  // Перевіряю підписку
  async checkSubscribe(flat_id: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && flat_id) {
      this.authorization = true;
      const data = { auth: JSON.parse(userJson), flat_id: flat_id };
      try {
        const response: any = await this.http.post(this.serverPath + '/subs/checkSubscribe', data).toPromise();
        // console.log(response.status)
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 1;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 0;
        }
        await this.counterService.getUserSubscriptionsCount();
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      this.authorization = false;
      // console.log('Авторизуйтесь');
    }
  }

  getLogin() {
    this.sharedService.getAuthorization();
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }

  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'left') {
      this.cardDirection = 'Наступна';
      this.cardSwipeState = 'left';
      setTimeout(() => {
        this.card1 = !this.card1;
        this.card2 = !this.card2;
        this.onNextCard();
        this.cardSwipeState = 'endLeft';
        setTimeout(() => {
          this.cardDirection = '';
        }, 590);
      }, 10);
    } else {
      this.cardDirection = 'Попередня';
      this.cardSwipeState = 'right';
      setTimeout(() => {
        this.card1 = !this.card1;
        this.card2 = !this.card2;
        this.onPrevCard();
        this.cardSwipeState = 'endRight';
        setTimeout(() => {
          this.cardDirection = '';
        }, 590);
      }, 10);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

