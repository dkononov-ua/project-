import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-agree-host',
  templateUrl: './agree-host.component.html',
  styleUrls: ['./../../pages.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top1,
  ],
})

export class AgreeHostComponent implements OnInit, OnDestroy {

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
  counterHouseNewMessage: number = 0;
  counterHouseSendAgree: number = 0;
  counterHouseConcludedAgree: number = 0;
  houseConcludedAgreeIds: any = [];
  houseSendAgree: any = [];
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
    private counterService: CounterService,
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
      if (this.acces_agreement === 1) {
        this.getHouseSendAgree();
        this.getHouseConcludedAgree();
        this.getActAgree();
      }
      if (this.acces_discuss === 1) {
        this.getHouseDiscussioCount();
      }
      if (this.acces_subs === 1) {
        this.getHouseSubscribersCount();
        this.getHouseSubscriptionsCount();
      }
    } else {
      this.getHouseSendAgree();
      await this.getHouseConcludedAgree();
      this.getHouseDiscussioCount();
      this.getHouseSubscribersCount();
      this.getHouseSubscriptionsCount();
      this.getActAgree();
    }
  }

  // перевірка підписників оселі
  getHouseSubscribersCount() {
    this.subscriptions.push(
      this.counterService.counterHouseSubscribers$.subscribe(data => {
        this.counterHouseSubscribers = Number(data);
      })
    );
    // this.counterService.getHouseSubscribersCount(0);
  }

  // перевірка підписок оселі
  getHouseSubscriptionsCount() {
    this.subscriptions.push(
      this.counterService.counterHouseSubscriptions$.subscribe(data => {
        this.counterHouseSubscriptions = Number(data);
      })
    );
    // this.counterService.getHouseSubscriptionsCount(0);
  }

  // перевірка дискусій оселі
  getHouseDiscussioCount() {
    this.subscriptions.push(
      this.counterService.counterHouseDiscussio$.subscribe(data => {
        this.counterHouseDiscussio = Number(data);
      })
    );
    // this.counterService.getHouseDiscussioCount(0);
  }

  // кількість надісланих угод
  getHouseSendAgree() {
    this.subscriptions.push(
      this.counterService.counterHouseSendAgree$.subscribe(data => {
        this.counterHouseSendAgree = Number(data);
        // console.log(this.counterHouseSendAgree)
      }),
      this.counterService.houseSendAgree$.subscribe(data => {
        this.houseSendAgree = data;
        // console.log(this.houseSendAgree)
      })
    );
    this.counterService.getHouseSendAgree(this.selectedFlatId, 0);
  }

  // кількість ухвалених угод
  async getHouseConcludedAgree() {
    this.subscriptions.push(
      this.counterService.counterHouseConcludedAgree$.subscribe(data => {
        this.counterHouseConcludedAgree = Number(data);
        // console.log(this.counterHouseConcludedAgree);
      }),
      this.counterService.houseConcludedAgreeIds$.subscribe(data => {
        this.houseConcludedAgreeIds = data;
        // console.log(this.houseConcludedAgreeIds);
      })
    );

    this.counterService.getHouseConcludedAgree(this.selectedFlatId, 0);
  }

  // Перевіряємо чи сформовані акти передачі оселі по ухваленим угодам
  async getActAgree(): Promise<any> {
    this.subscriptions.push(
      this.counterService.actExistsArray$.subscribe(data => {
        this.actExistsArray = data;
        // console.log(this.actExistsArray)

        this.counterActExistsArray = this.actExistsArray.length;
        // console.log(this.counterActExistsArray)
      })
    );
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

