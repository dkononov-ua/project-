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
    this.detail = !this.detail;
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

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
    private locationHouseService: LocationHouseService,
    private cardsDataHouseService: CardsDataHouseService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    if (this.currentLocation === '/house/house-info') {
      this.loadDataFlat();
      this.getAdditionalHouseInfo();
    } else {
      // Підписка на отримання даних обраної оселі
      this.subscriptions.push(
        this.cardsDataService.cardData$.subscribe(async (data: any) => {
          // console.log(data)
          this.house = data.flat
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.house);

        })
      );
    }
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
  copyLocation() {
    this.sharedService.copyToClipboard(this.locationLink, 'Локацію');
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    this.sharedService.copyToClipboard(textToCopy, message);
  }

  // Відкриваю локацію на мапі
  openMap() {
    this.sharedService.openMap(this.locationLink)
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


