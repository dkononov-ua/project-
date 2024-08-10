import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-house-agree-progress',
  templateUrl: './house-agree-progress.component.html',
  styleUrls: ['./../../progress.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.top1,
    animations.top2,
    animations.top3,
  ],
})

export class HouseAgreeProgressComponent implements OnInit, OnDestroy {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  goBack(): void {
    this.location.back();
  }
  selectedFlatId!: string | null;
  statusMessage: string | undefined;
  houseData: any;
  authorization: boolean = false;
  loading: boolean = false;

  counterHouseSubscribers: number = 0;
  counterHouseSubscriptions: number = 0;
  counterHouseDiscussio: number = 0;
  counterHouseSendAgree: number = 0;
  counterHouseConcludedAgree: number = 0;
  houseConcludedAgreeIds: any = [];
  actExistsArray: any = [];
  counterActExistsArray: number = 0;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;

  unreadHouseMessage: any;
  iReadHouseMessage: boolean = false;
  counterHouseNewMessage: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private updateComponent: UpdateComponentService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    this.checkUserAuthorization();
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getSelectParam();
    } else {
      this.authorization = false;
    }
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  getSelectParam() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId;
        this.loadDataFlat();
      })
    );
  }

  // Беру дані своєї оселі з локального сховища
  async loadDataFlat(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
    } else {
      this.houseData = undefined;
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      if (this.acces_agreement === 1) {
        this.getStorageHouseCounter();
      }
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    }
    this.getStorageHouseCounter();
  }

  // Отримання лічильників по угодам
  async getStorageHouseCounter() {
    this.counterHouseSubscribers = Number(localStorage.getItem('counterHouseSubscribers'));
    this.counterHouseSubscriptions = Number(localStorage.getItem('counterHouseSubscriptions'));
    this.counterHouseDiscussio = Number(localStorage.getItem('counterHouseDiscussio'));
    this.counterHouseSendAgree = Number(localStorage.getItem('counterHouseSendAgree'));
    this.counterHouseConcludedAgree = Number(localStorage.getItem('counterHouseConcludedAgree'));

    const houseConcludedAgreeIds = localStorage.getItem('houseConcludedAgreeIds');
    if (houseConcludedAgreeIds) {
      this.houseConcludedAgreeIds = JSON.parse(houseConcludedAgreeIds);
    }
    const actExistsArray = localStorage.getItem('actExistsArray');
    if (actExistsArray) {
      this.actExistsArray = JSON.parse(actExistsArray);
    }
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}




