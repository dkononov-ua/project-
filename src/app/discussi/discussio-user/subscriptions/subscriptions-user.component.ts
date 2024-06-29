import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { LocationHouseService } from 'src/app/services/location-house.service';

@Component({
  selector: 'app-subscriptions-user',
  templateUrl: './subscriptions-user.component.html',
  styleUrls: ['./../../discussi.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class SubscriptionsUserComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // параметри оселі
  chosenFlat: any;
  choseFlatId: any | null;
  subscriptions: any[] = [];
  // показ карток
  page: number = 0;
  indexPage: number = 1;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  counterFound = PaginationConfig.counterFound;
  startX = 0;
  isMobile: boolean = false;

  constructor(
    private choseSubscribeService: ChoseSubscribeService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private router: Router,
    private cardsDataService: CardsDataService,
  ) {  }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );

    // Підписка на отримання айді обраної оселі
    this.subscriptions.push(
      this.choseSubscribeService.selectedFlatId$.subscribe(async selectedFlatId => {
        this.choseFlatId = selectedFlatId;
      })
    );

    // Підписка на отримання даних обраної оселі
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        this.chosenFlat = data;
        // Якщо є обрана оселя
        if (this.chosenFlat) {
          this.indexPage = 2;
        }
      })
    );

    // Підписка на отримання кількості карток
    await this.counterService.getUserSubscriptionsCount();
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(async data => {
        this.counterFound = Number(data);
      })
    );
  }

  ngOnDestroy() {
    this.cardsDataService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onPanStart(event: any): void {
    this.startX = 0;
  }

  onPanMove(event: any): void {
    this.startX = event.deltaX;
  }

  onPanEnd(event: any): void {
    const minDeltaX = 50;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        if (this.indexPage !== 0) {
          this.indexPage--;
        } else {
          this.router.navigate(['/user/info']);
        }
      } else {
        if (this.indexPage !== 1 && !this.chosenFlat) {
          this.indexPage++;
        } else if (this.chosenFlat && this.indexPage <= 1) {
          this.indexPage++;
        }
      }
    }
  }

}

