import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
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
    animations.bot,
    animations.top,
    animations.top2,
    animations.top3,
    animations.top4,
  ],
})

export class InfoComponent implements OnInit, OnDestroy {

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
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;

  user = {
    inf: {
      lastName: '',
      firstName: '',
      surName: '',
    }
  };

  subscriptions: any[] = [];
  card_info: number = 0;

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    const currentLocation = this.location.path();
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    if (currentLocation === '/user/info') {
      this.getInfoUser();
    } else {
      // Підписка на отримання даних обраної оселі
      this.subscriptions.push(
        this.cardsDataService.cardData$.subscribe(async (data: any) => {
          // console.log(data)
          this.user.inf = data.owner;
        })
      );
    }
  }

  getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject)
      this.user.inf = userObject.inf;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

}



