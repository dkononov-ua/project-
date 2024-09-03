import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-agree-step',
  templateUrl: './agree-step.component.html',
  styleUrls: ['./../../../step.scss'],
  animations: [
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
  ],
})

export class AgreeStepComponent implements OnInit, OnDestroy {

  offs: number = 0;
  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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

  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  selectedFlatId!: string | null;
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private router: Router,
    private selectedFlatIdService: SelectedFlatService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
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

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  getSelectParam() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId;
        if (this.selectedFlatId) {
          this.loadDataFlat();
        }
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

  // Переходимо до створення угоди
  goToAgreeCreate() {
    if (this.counterHouseDiscussio !== 0) {
      this.router.navigate(['/house/agree/create']);
    }
  }

  // Переходимо до створення акту за угодою
  goToActCreate() {
    if (this.counterHouseConcludedAgree !== 0) {
      this.router.navigate(['/house/act/create']);
    }
  }

  // Переходимо до надісланих угод
  goToAgreeReview() {
    if (this.counterHouseSendAgree !== 0) {
      this.router.navigate(['/house/agree/review']);
    }
  }

  // Переходимо до укладених угод
  goToConcluded() {
    if (this.counterHouseConcludedAgree !== 0) {
      this.router.navigate(['/house/agree/concluded']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

