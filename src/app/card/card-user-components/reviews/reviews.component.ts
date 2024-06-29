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

  constructor(
    private sharedService: SharedService,
    private cardsDataService: CardsDataService,
    private cardsDataHouseService: CardsDataHouseService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    this.checkLocation();
  }

  checkLocation() {
    // Якщо я в меню користувача
    if (
      this.currentLocation === '/subscribers-discuss' ||
      this.currentLocation === '/subscribers-user' ||
      this.currentLocation === '/subscriptions-user'
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
      this.currentLocation === '/subscribers-discus' ||
      this.currentLocation === '/subscribers-house' ||
      this.currentLocation === '/subscriptions-house'
    ) {
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
    } else if (this.currentLocation === '/user/info') {
      // this.getInfoUser();
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




