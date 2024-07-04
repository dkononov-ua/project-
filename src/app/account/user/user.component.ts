import { Component, OnDestroy, OnInit } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';
import { IsAccountOpenService } from 'src/app/services/is-account-open.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { DataService } from 'src/app/services/data.service';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.top1,
    animations.right2,
    animations.swichCard,
  ],
})

export class UserComponent implements OnInit, OnDestroy {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  // ***

  statusMessage: any;
  loginCheck: boolean = false;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  counterUserSubs: any;
  counterUserDiscuss: any;
  userInf: any;
  agreeNum: number = 0;
  loading: boolean = false;

  unreadUserMessage: any;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  iReadUserMessage: boolean = false;
  counterUserNewAgree: any;
  authorization: boolean = false;

  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
  houseData: any;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  serverPath: string = ''
  subscriptions: any[] = [];

  constructor(
    private isAccountOpenService: IsAccountOpenService,
    private counterService: CounterService,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private dataService: DataService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );

    this.sendAccountIsOpen();
    this.dataService.getInfoUser();
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.loginCheck = true;
      this.authorization = true;
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserDiscussioCount();
      await this.getUserNewMessage();
      await this.getUpdateUserMessage();
      this.getCounterAgree();
      this.getHouseData();
    } else {
      this.authorization = false;
    }
  }

  getCounterAgree() {
    const userJson = localStorage.getItem('user');
    // console.log(localStorage.getItem('user'))
    if (userJson) {
      const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
      if (counterUserNewAgree) {
        this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
        // console.log(counterUserNewAgree)
      } else {
        this.counterUserNewAgree = 0;
      }
    } else {
      this.counterUserNewAgree = 0;
    }
  }

  // перевірка підписників користувача
  async getUserSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    await this.counterService.getUserSubscribersCount();
    this.counterService.counterUserSubscribers$.subscribe(data => {
      const counterUserSubscribers: any = data;
      if (counterUserSubscribers.status === 'Немає доступу') {
        this.counterUserSubscribers = null;
      } else {
        this.counterUserSubscribers = counterUserSubscribers;
      }
      // console.log('кількість підписників', this.counterUserSubscribers)
    });
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    await this.counterService.getUserSubscriptionsCount();
    this.counterService.counterUserSubscriptions$.subscribe(data => {
      const counterUserSubscriptions: any = data;
      if (counterUserSubscriptions.status === 'Немає доступу') {
        this.counterUserSubscriptions = null;
      } else {
        this.counterUserSubscriptions = counterUserSubscriptions;
      }
      // console.log('кількість підписників', this.counterUserSubscriptions)
    });
  }

  // перевірка дискусій користувача
  async getUserDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserDiscussio$.subscribe(data => {
      const counterUserDiscussio: any = data;
      this.counterUserDiscussio = counterUserDiscussio;
      // console.log('кількість дискусій', this.counterUserDiscussio)
    });
  }

  // перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getUserNewMessage();
    this.counterService.counterUserNewMessage$.subscribe(data => {
      const counterUserNewMessage: any = data;
      this.counterUserNewMessage = counterUserNewMessage.status;
      // console.log('кількість повідомлень користувача', this.counterUserNewMessage)
    });
  }

  // повідомлення користувача було прочитано
  async getUpdateUserMessage() {
    this.updateComponent.iReadUserMessage$.subscribe(async () => {
      this.iReadUserMessage = true;
      if (this.iReadUserMessage === true) {
        this.counterUserNewMessage = 0;
      }
    });
  }

  sendAccountIsOpen() {
    this.isAccountOpenStatus = true;
    this.isAccountOpenService.setIsAccountOpen(this.isAccountOpenStatus);
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseData(): Promise<void> {
    this.houseData = localStorage.getItem('houseData');
    if (this.houseData) {
      const parsedHouseData = JSON.parse(this.houseData);
      this.houseData = parsedHouseData;
      // console.log(this.houseData)
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }
}
