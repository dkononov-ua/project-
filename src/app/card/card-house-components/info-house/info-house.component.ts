import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { Purpose, Distance, OptionPay, Animals } from '../../../interface/name';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';

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
  ],
})

export class InfoHouseComponent implements OnInit, OnDestroy {

  detail: boolean = false;
  moreDetail() {
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

  subscriptions: any[] = [];
  house: any | {};

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
  ) {  }

  async ngOnInit(): Promise<void> {
    const currentLocation = this.location.path();
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    if (currentLocation === '/house/house-info') {
      this.loadDataFlat();
    } else {
      // Підписка на отримання даних обраної оселі
      this.subscriptions.push(
        this.cardsDataService.cardData$.subscribe(async (data: any) => {
          // console.log(data)
          this.house = data.flat
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
    } else {
      console.log('Авторизуйтесь');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

}


