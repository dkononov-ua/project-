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
  photoExists: boolean = false;

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

  checkLocation() {
    // Перевірка поточного шляху для вибору відповідного сервісу
    if (this.isUserRoute()) {
      this.subscriptionsCardsDataService();
    } else if (this.isHouseRoute()) {
      this.subscriptionsDataHouseService();
    } else if (this.isUserProfile()) {
      this.getInfoUser();
    } else if (this.isTenantSearch()) {
      this.subscriptionsDataHouseService();
    } else if (this.isResidentsOwner()) {
      this.subscriptionsDataHouseService();
    }
  }

  // Перевіряє, чи поточний шлях належить до роутів користувача
  private isUserRoute(): boolean {
    return ['/user/discus/discussion', '/user/discus/subscribers-user', '/user/discus/subscriptions-user'].includes(this.currentLocation);
  }

  // Перевіряє, чи поточний шлях належить до роутів оселі
  private isHouseRoute(): boolean {
    return ['/house/discus/discussion', '/house/discus/subscribers', '/house/discus/subscriptions', '/house/residents/resident'].includes(this.currentLocation);
  }

  // Перевіряє, чи поточний шлях належить до сторінки профілю користувача
  private isUserProfile(): boolean {
    return this.currentLocation === '/user/info';
  }

  // Перевіряє, чи поточний шлях належить до пошуку орендарів
  private isTenantSearch(): boolean {
    return this.currentLocation === '/search/tenant';
  }

  // Перевіряє, чи поточний шлях належить до сторінки власника
  private isResidentsOwner(): boolean {
    return this.currentLocation === '/house/residents/owner';
  }

  // Підписка на інформацію про власника
  subscriptionsCardsDataService() {
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        this.user.img = data.owner.img;
      })
    );
  }

  // Підписка на інформацію про користувача
  subscriptionsDataHouseService() {
    this.subscriptions.push(
      this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
        this.user = data;
      })
    );
  }

  // Отримання інформації про користувача з локального сховища
  async getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.user.img = userObject.img[0].img;
    } else {
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
