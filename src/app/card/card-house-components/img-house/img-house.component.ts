import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { HouseInfo } from '../../../interface/info';
import { HouseConfig } from '../../../interface/param-config';

@Component({
  selector: 'app-img-house',
  templateUrl: './img-house.component.html',
  styleUrls: ['./img-house.component.scss'],
  animations: [
    animations.left2,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
  ],
})

export class ImgHouseComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  subscriptions: any[] = [];
  currentPhotoIndex: number = 0;
  currentLocation: string = '';
  authorization: boolean = false;
  isMobile: boolean = false;
  house: HouseInfo = HouseConfig;
  photoExists: boolean = false;

  constructor(
    private sharedService: SharedService,
    private location: Location,
    private cardsDataService: CardsDataService,
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
      await this.checkLocation();
    } else {
      this.authorization = false;
    }
  }

  // перевірка де я знаходжусь
  async checkLocation() {
    if (this.currentLocation === '/house/info') {
      await this.loadDataFlat();
    } else {
      await this.getCardsData();
    }
  }

  // Беру дані своєї оселі з локального сховища
  async loadDataFlat(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      const parsedHouseData = JSON.parse(houseData);
      if (Array.isArray(parsedHouseData.imgs) && parsedHouseData.imgs.length > 0) {
        this.house.photos = parsedHouseData.imgs;
        this.photoExists = true;
      } else {
        this.photoExists = false;
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // Підписка на отримання даних обраної оселі
  async getCardsData() {
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        if (data) {
          if (Array.isArray(data.img) && data.img.length !== 0) {
            this.house.photos = data.img.map((img: string) => ({
              flat_id: data.flat.flat_id,
              img: img
            }));
            this.photoExists = true;
          } else {
            this.photoExists = false;
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  prevPhoto() {
    if (!this.authorization) {
      this.sharedService.getAuthorization();
    } else {
      const length = this.house?.photos.length || 0;
      if (this.currentPhotoIndex !== 0) {
        this.currentPhotoIndex--;
      }
    }
  }

  nextPhoto() {
    if (!this.authorization) {
      this.sharedService.getAuthorization();
    } else {
      const length = this.house?.photos.length || 0;
      if (this.currentPhotoIndex < length) {
        this.currentPhotoIndex++;
      }
    }
  }

  openFullScreenImage(photos: any): void {
    this.sharedService.openFullScreenImage(photos);
  }

}


