import { Component, OnDestroy, OnInit } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { DataService } from 'src/app/services/data.service';
import * as ServerConfig from 'src/app/config/path-config';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    animations.left1,
    animations.right1,
    animations.right2,
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
  userInf: any;
  agreeNum: number = 0;
  loading: boolean = false;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  counterUserNewAgree: any;
  authorization: boolean = false;
  houseData: any;
  serverPath: string = ''
  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private counterService: CounterService,
    private sharedService: SharedService,
    private dataService: DataService,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
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

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getAndSetUserData();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserDiscussioCount();
      await this.getUserNewMessage();
      this.getCounterAgree();
      this.getHouseData();
    } else {
      this.authorization = false;
    }
  }

  // перевірка підписників користувача
  async getUserSubscribersCount() {
    await this.counterService.getUserSubscribersCount();
    this.subscriptions.push(
      this.counterService.counterUserSubscribers$.subscribe(data => {
        this.counterUserSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    await this.counterService.getUserSubscriptionsCount();
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        this.counterUserSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій користувача
  async getUserDiscussioCount() {
    await this.counterService.getUserDiscussioCount();
    this.subscriptions.push(
      this.counterService.counterUserDiscussio$.subscribe(data => {
        this.counterUserDiscussio = Number(data);
      })
    );
  }

  // перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    await this.counterService.getUserNewMessage();
    this.subscriptions.push(
      this.counterService.counterUserNewMessage$.subscribe(data => {
        this.counterUserNewMessage = Number(data)
      })
    );
  }

  // запитую всю інформацію про користувача
  async getAndSetUserData() {
    this.dataService.getInfoUser().subscribe(
      (response) => {
        // console.log(response)
        if (response.status === true) {
          // та частину з неї передаю в setUserData для того щоб оновити рейтинг
          this.statusDataService.setUserData(response.cont, 0);
        }
      },
      (error) => {
        console.error(error);
      }
    );
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

  // отримую кількість запропонованих угод
  getCounterAgree() {
    const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
    if (counterUserNewAgree) {
      this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
    } else {
      this.counterUserNewAgree = 0;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }
}
