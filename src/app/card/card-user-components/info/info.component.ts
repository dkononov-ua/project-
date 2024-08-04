import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { Purpose, Distance, OptionPay, Animals } from '../../../interface/name';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { HttpClient } from '@angular/common/http';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.bot,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.fadeIn,
    animations.appearance,
  ],
})

export class InfoComponent implements OnInit, OnDestroy {

  detail: boolean = false;
  totalDays: number = 0;

  toogleOpen() {
    this.detail = !this.detail;
  }

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // розшифровка пошукових параметрів
  purpose = Purpose;
  aboutDistance = Distance;
  option_pay = OptionPay;
  animals = Animals;
  user: any;
  subscriptions: any[] = [];
  card_info: number = 0;
  currentLocation: string = '';
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
    private cardsDataHouseService: CardsDataHouseService,
    private http: HttpClient,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    this.checkUserAuthorization();
  }

  // перевірка на девайс
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
      this.checkLocation();
    } else {
      this.authorization = false;
    }
  }

  checkLocation() {
    // Якщо я в меню користувача
    if (
      this.currentLocation === '/user/discus/discussion' ||
      this.currentLocation === '/user/discus/subscribers-user' ||
      this.currentLocation === '/user/discus/subscriptions-user'
    ) {
      this.subscriptions.push(
        this.cardsDataService.cardData$.subscribe(async (data: any) => {
          this.user = data.owner;
        })
      );
      // Якщо я в меню оселі
    } else if (
      this.currentLocation === '/subscribers-discus' ||
      this.currentLocation === '/subscribers-house' ||
      this.currentLocation === '/subscriptions-house'
    ) {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
        })
      );
    } else if (this.currentLocation === '/user/info') {
      this.getFeaturesInfo();
    } else if (this.currentLocation === '/search-tenants') {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
        })
      );
    }
    this.calculateTotalDays();
  }

  // Пошукові параметри користувача
  async getFeaturesInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    if (userJson && userData) {
      const userObject = JSON.parse(userData);
      this.user = userObject.inf;
      try {
        const response: any = await this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) }).toPromise();
        // console.log(response)
        if (response.status === true) {
          const newData = response.inf;
          let existingData = JSON.parse(localStorage.getItem('userData') || '{}');
          // Перевіряємо, чи існуючі дані є об'єктом
          if (typeof existingData === 'object' && existingData !== null) {
            // Додаємо лише відсутні параметри з newData до existingData
            for (const key in newData) {
              if (newData.hasOwnProperty(key) && !existingData.hasOwnProperty(key)) {
                existingData[key] = newData[key];
              }
            }
          } else {
            // Якщо існуючі дані не є об'єктом, замінюємо їх новими даними
            existingData = newData;
          }
          // Зберігаємо оновлений об'єкт назад в localStorage
          localStorage.setItem('userData', JSON.stringify(existingData));
          // Оновлюємо локальний this.user
          this.user = { ...this.user, ...newData };
          this.calculateTotalDays();
          this.statusDataService.setStatusData(this.user);
          // console.log(this.user);
        } else {
          console.error("Response status is not true");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (!userData) {
      setTimeout(() => {
        this.getFeaturesInfo();
      }, 100);
    }
  }

  async calculateTotalDays(): Promise<number> {
    if (this.user) {
      const days = this.user.days || 0;
      const weeks = this.user.weeks || 0;
      const months = this.user.months || 0;
      const years = this.user.years || 0;
      const totalDays = days + weeks * 7 + months * 30 + years * 365;
      this.totalDays = totalDays / 29;
      return this.totalDays;
    } else {
      return 0;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}



