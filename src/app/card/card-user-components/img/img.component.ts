import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';

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
          this.user.img = data.owner.img;
        })
      );
    }
  }

  getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.user.img = userObject.img[0].img;
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
