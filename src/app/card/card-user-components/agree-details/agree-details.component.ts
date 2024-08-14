import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { Purpose, Distance, OptionPay, Animals } from '../../../interface/name';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { AddRatingComponent } from 'src/app/components/add-rating/add-rating.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-agree-details',
  templateUrl: './agree-details.component.html',
  styleUrls: ['./agree-details.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.bot,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.fadeIn,
    animations.appearance,
  ],
})

export class AgreeDetailsComponent implements OnInit, OnDestroy {

  detail: boolean = false;
  totalDays: number = 0;

  toogleOpen() {
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
  user: any;
  subscriptions: any[] = [];
  card_info: number = 0;
  currentLocation: string = '';
  isMobile: boolean = false;
  authorization: boolean = false;
  agreeDetails: any;

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataHouseService: CardsDataHouseService,
    private dialog: MatDialog,
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
    // Якщо я в меню мешканці
    if (this.currentLocation === '/house/residents/resident') {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
          this.getAgreeDetails();
        })
      );
    }
  }

  // Пошукові параметри користувача
  async getAgreeDetails(): Promise<any> {
    this.agreeDetails = undefined;
    setTimeout(async () => {
      this.agreeDetails = await this.cardsDataHouseService.getConcludedAgree();
    }, 100);
  }

  // Надати доступи користувачу
  addUserRating(user: any) {
    const dialogRef = this.dialog.open(AddRatingComponent, {
      data: { user }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}



