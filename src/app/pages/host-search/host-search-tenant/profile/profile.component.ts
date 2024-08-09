import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FilterUserService } from '../../../../services/search/filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { GestureService } from 'src/app/services/gesture.service';
import { CounterService } from 'src/app/services/counter.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { animations } from '../../../../interface/animation';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA' },],
  animations: [
    trigger('cardSwipe', [
      transition('void => *', [
        style({ transform: 'scale(0.6)', opacity: 0 }),
        animate('600ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('left => *', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
      transition('right => *', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
    animations.appearance,
  ]
})

export class ProfileComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  isSubscribed: boolean = false;
  userInfo: UserInfo[] = [];
  allCards: UserInfo[] | undefined;
  selectedUser: UserInfo | any;
  // параметри оселі
  selectedFlatId!: number | null;
  // статуси
  currentCardIndex: number = 0;
  subscriptionStatus: number = 0;
  statusMessage: any;
  optionsFound: number = 0;
  indexPage: number = 0;
  cardSwipeState: string = '';
  cardDirection: string = 'Discussio';
  startX = 0;
  isLoadingImg: boolean = false;
  authorizationHouse: boolean = false;
  selectedUserId: number | undefined;

  switchCard: number = 1;
  isSelectedUserId: boolean = false;

  seeReviews() {
    if (this.authorizationHouse) {
      this.indexPage = 2
    } else {
      this.sharedService.setStatusMessage('Для перегляду відгуків треба мати оселю');
      setTimeout(() => {
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }
  subscriptions: any[] = [];
  isMobile = false;
  btnDisabled: boolean = false;

  constructor(
    private filterService: FilterUserService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private statusDataService: StatusDataService,
    private choseSubscribersService: ChoseSubscribersService,
    private cardsDataHouseService: CardsDataHouseService,
    private cardsDataService: CardsDataService,
    private statusMessageService: StatusMessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCheckDevice();
    this.getServerPath();
    this.getSelectedFlat();
    this.getAllCardsData();
  }

  // підписка на шлях до серверу
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

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (!this.selectedFlatId) {
          this.authorizationHouse = false;
        } else {
          this.authorizationHouse = true;
        }
      })
    )
  }

  // підписка на отримання даних по всім знайденим карткам
  async getAllCardsData() {
    this.subscriptions.push(
      this.cardsDataHouseService.cardsData$.subscribe(async (data: any) => {
        this.allCards = data;
        if (this.allCards) {
          this.getСhoseUserID();
        }
      })
    );
  }

  // Підписка на отримання айді обраного юзера
  async getСhoseUserID() {
    this.subscriptions.push(
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.selectedUserId = Number(selectedSubscriber);
        // console.log(this.selectedUserId)
        if (this.selectedUserId) {
          this.isSelectedUserId = false;
          this.findUserCardIndex(this.selectedUserId);
        } else {
          this.isSelectedUserId = true;
        }
      })
    )
  }

  // Шукаю номер юзера в масиві за його айді
  findUserCardIndex(cardId: number) {
    const index = this.allCards?.findIndex(card => Number(card.user_id) === cardId);
    if (index !== undefined && index !== -1) {
      this.currentCardIndex = index;
      // console.log(this.currentCardIndex)
      this.autoSelectUser();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        this.onPrevCard();
        this.cardSwipeState = 'endRight';
        setTimeout(() => {
          this.cardDirection = '';
        }, 590);
      }, 10);
    }
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
      // console.log(this.currentCardIndex)
      setTimeout(() => {
        this.selectedCard();
      }, 500);
    }
  }

  autoSelectUser() {
    this.selectedUser = undefined;
    this.subscriptionStatus = 0;
    setTimeout(() => {
      this.selectedUser = this.allCards![this.currentCardIndex];
      if (this.selectedUser.user_id !== this.selectedUserId) {
        this.choseSubscribersService.setSelectedSubscriber(this.selectedUser.user_id);
      }
      if (this.selectedUser) {
        this.checkSubscribe(this.selectedUser.user_id);
        this.cardsDataHouseService.selectCard();
      }
    }, 50);
  }

  // Очищую selectedUser потім встановлюю обраного користувача по його номеру в масиві та запускаю тригер
  // в сервісі для того щоб він передав у всі інші компоненти дані обраного користувача
  selectedCard() {
    this.selectedUser = undefined;
    this.subscriptionStatus = 0;
    setTimeout(() => {
      this.selectedUser = this.allCards![this.currentCardIndex];
      this.choseSubscribersService.setSelectedSubscriber(this.selectedUser.user_id);
      if (this.selectedUser) {
        this.checkSubscribe(this.selectedUser.user_id);
        this.cardsDataHouseService.selectCard();
      }
    }, 50);
  }

  // Підписуюсь
  async getSubscribe(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedUser.user_id && this.selectedFlatId) {
      const data = { auth: JSON.parse(userJson), user_id: this.selectedUser.user_id, flat_id: this.selectedFlatId };
      try {
        const response: any = await this.http.post(this.serverPath + '/usersubs/subscribe', data).toPromise();
        // console.log(response)
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 0;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 1;
        }
        this.checkSubscribe(this.selectedUser.user_id);
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      }
    } else {
      this.btnDisabled = true;
      this.statusMessageService.setStatusMessage('Для підписки треба мати оселю');
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
        this.btnDisabled = false;
        this.router.navigate(['/house/house-control/selection-house']);
      }, 2000);
    }
  }

  // Перевіряю підписку
  async checkSubscribe(user_id: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && user_id && this.selectedFlatId) {
      const data = { auth: JSON.parse(userJson), user_id: user_id, flat_id: this.selectedFlatId };
      try {
        const response: any = await this.http.post(this.serverPath + '/usersubs/checkSubscribe', data).toPromise();
        // console.log(response.status)
        // перевірка підписок оселі
        await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 0;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 1;
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      }
    } else {
      // console.log('Авторизуйтесь');
    }
  }

  closeUser() {
    this.selectedUser = undefined;
    this.choseSubscribersService.removeChosenUserId();
    this.choseSubscribersService.setIndexPage(2);
  }

}

