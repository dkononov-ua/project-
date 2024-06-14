import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [animations.top3],
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

  constructor(
    private sharedService: SharedService,
    private cardsDataService: CardsDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    // Підписка на отримання даних обраної оселі
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        this.chosenFlat = data;
        // Якщо є обрана оселя
        if (this.chosenFlat) {
          // Запитую рейтинг власника
          await this.getRating(this.chosenFlat?.owner.user_id);
          // Перевіряю чи створений чат
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  // Отримую рейтинг користувача
  async getRating(user_id: any): Promise<any> {
    const response: any = await this.sharedService.getRatingOwner(user_id);
    // console.log(response);
    this.reviews = response.reviews;
    this.ratingOwner = response.ratingOwner;
    this.numberOfReviews = response.numberOfReviewsOwner;
  }

}




