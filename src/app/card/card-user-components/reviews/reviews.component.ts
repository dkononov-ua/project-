import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.top3,
    animations.top4,
  ],
})

export class ReviewsComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // параметри оселі
  chosenFlat: any;
  subscriptions: any[] = [];
  ratingOwner: number = 0;

  card_info: number = 0;
  reviews: any;
  numberOfReviews: any;
  currentLocation: string = '';
  user: any;
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private sharedService: SharedService,
    private cardsDataService: CardsDataService,
    private cardsDataHouseService: CardsDataHouseService,
    private location: Location,
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
          this.chosenFlat = data;
          // Якщо є обрана оселя
          if (this.chosenFlat) {
            // Запитую рейтинг власника
            await this.getRatingOwner(this.chosenFlat?.owner.user_id);
          }
        })
      );
      // Якщо я в меню оселі
    } else if (
      this.currentLocation === '/house/discus/discussion' ||
      this.currentLocation === '/house/discus/subscribers' ||
      this.currentLocation === '/house/discus/subscriptions' ||
      this.currentLocation === '/house/residents/resident' ||
      this.currentLocation === '/house/residents/owner'
    ) {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
          console.log(data)
          // console.log(this.user)
          if (this.user) {
            // Запитую рейтинг власника
            if (this.currentLocation === '/house/residents/owner') {
              await this.getRatingOwner(this.user.user_id);
            } else {
              await this.getRatingTenant(this.user.user_id);
            }
          }
        })
      );
    } else if (this.currentLocation === '/user/info') {
      // this.getInfoUser();
    } else if (this.currentLocation === '/search/tenant') {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
          // console.log(this.user)
          if (this.user) {
            // Запитую рейтинг власника
            await this.getRatingTenant(this.user.user_id);
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  // Отримую рейтинг користувача
  async getRatingOwner(user_id: any): Promise<any> {
    const response: any = await this.sharedService.getRatingOwner(user_id);
    // console.log(response);
    this.reviews = response.reviews;
    this.ratingOwner = response.ratingOwner;
    this.numberOfReviews = response.numberOfReviewsOwner;
  }

  // Отримую рейтинг власника
  async getRatingTenant(user_id: any): Promise<any> {
    const response: any = await this.sharedService.getRatingTenant(user_id);
    // console.log(response);
    this.reviews = response.reviews;
    this.ratingOwner = response.ratingOwner;
    this.numberOfReviews = response.numberOfReviewsOwner;
  }

}




