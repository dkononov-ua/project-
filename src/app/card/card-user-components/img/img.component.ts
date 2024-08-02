import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left2,
  ],
})

export class ImgComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  isLoadingImg: boolean = false;
  // параметри оселі
  user = {
    img: ''
  };

  subscriptions: any[] = [];
  currentPhotoIndex: number = 0;
  currentLocation: string = '';
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
    private cardsDataHouseService: CardsDataHouseService,
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
          this.user.img = data.owner.img;
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
      this.getInfoUser();
    } else if (this.currentLocation === '/search-tenants') {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
        })
      );
    }
  }

  // Якщо я на сторінці профілю
  async getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.user.img = userObject.img[0].img;
    } else if (!userData) {
      setTimeout(() => {
        this.getInfoUser();
      }, 100);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  // Перемикання Фото в каруселі
  prevPhoto() {
    const length = this.user?.img.length || 0;
    if (this.currentPhotoIndex !== 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    const length = this.user?.img.length || 0;
    if (this.currentPhotoIndex < length) {
      this.currentPhotoIndex++;
    }
  }

  openFullScreenImage(photos: string): void {
    this.sharedService.openFullScreenImage(photos);
  }
}
