import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { Purpose, Distance, OptionPay, Animals } from '../../../interface/name';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { LocationHouseService } from 'src/app/services/location-house.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

@Component({
  selector: 'app-info-house',
  templateUrl: './info-house.component.html',
  styleUrls: ['./info-house.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.bot,
    animations.top,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.fadeIn,
  ],
})

export class InfoHouseComponent implements OnInit, OnDestroy {

  detail: boolean = false;
  additional: boolean = false;
  currentLocation: string = '';
  toogleOpen() {
    if (this.authorization) {
      this.detail = !this.detail;
    } else {
      this.sharedService.getAuthorization();
    }
  }
  toogleAdditional() {
    this.additional = !this.additional;
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

  subscriptions: any[] = [];
  house: any | {};
  public locationLink: string = '';
  additionalHouseInfo: any;
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
    private locationHouseService: LocationHouseService,
    private cardsDataHouseService: CardsDataHouseService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    this.checkUserAuthorization();
    this.checkLocation();
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
    } else {
      this.authorization = false;
    }
  }

  // перевірка де я знаходжусь
  async checkLocation() {
    if (this.currentLocation === '/house') {
      this.getMyFlatData();
    } else {
      await this.getCardsData();
    }
  }

  // Я на сторінці свого профілю запитую інформацію по своїй оселі
  async getMyFlatData() {
    this.loadDataFlat();
    this.getAdditionalHouseInfo();
  }

  // Підписка на отримання даних обраної оселі
  async getCardsData() {
    // console.log('getCardsData')
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        // console.log(data)
        if (data) {
          this.house = data.flat;
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.house);
          if (this.house) {
            // Формую локацію на мапі
            this.locationLink = await this.locationHouseService.generateLocationUrl(this.house);
          }
        }
      })
    );
  }

  async loadDataFlat(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      const parsedHouseData = JSON.parse(houseData);
      // console.log(parsedHouseData);
      this.house = this.house || {};
      Object.assign(this.house, parsedHouseData.flat, parsedHouseData.about, parsedHouseData.param);
      // console.log(this.house);
      this.locationLink = await this.locationHouseService.generateLocationUrl(this.house);
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (this.authorization) {
      this.sharedService.copyToClipboard(textToCopy, message);
    } else {
      this.sharedService.getAuthorization();
    }
  }

  // Відкриваю локацію на мапі
  openMap() {
    if (this.authorization) {
      this.sharedService.openMap(this.locationLink)
    } else {
      this.sharedService.getAuthorization();
    }
  }

  async getAdditionalHouseInfo(): Promise<any> {
    this.additionalHouseInfo = await this.cardsDataHouseService.getAdditionalHouseInfo();
    // console.log(this.additionalHouseInfo)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

}


