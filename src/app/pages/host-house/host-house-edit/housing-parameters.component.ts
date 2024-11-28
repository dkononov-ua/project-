import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';
import { Location } from '@angular/common';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { MenuService } from 'src/app/services/menu.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

@Component({
  selector: 'app-housing-parameters',
  templateUrl: './housing-parameters.component.html',
  styleUrls: ['./housing-parameters.component.scss'],
  animations: [
    animations.right2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
  ],
})

export class HousingParametersComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  addHouse: boolean = false;
  selectedFlatId!: string | null;
  indexPage: number = 0;
  page: any;

  houseData: any;
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
  startX = 0;
  isMobile = false;

  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  authorizationHouse: boolean = false;


  collapseParam: boolean = false;
  collapseParamStatus: boolean = false;
  collapseLocation: boolean = false;
  collapseLocationStatus: boolean = false;
  collapseAbout: boolean = false;
  collapseAboutStatus: boolean = false;
  collapsePhoto: boolean = false;
  collapsePhotoStatus: boolean = false;
  collapseAdditional: boolean = false;
  collapseAdditionalStatus: boolean = false;


  awaitStatusBtn: boolean = true;
  userData: any;
  fillingCont: number = 0;
  fillingInf: number = 0;
  totalFillingCont: number = 0;
  totalСompletion: number = 0;
  totalFillingInf: number = 0;
  totalFilling: number = 0;
  additionalHouseInfo: any;
  totalLocation: number = 0;
  totalParam: number = 0;
  totalAdditional: number = 0;
  totalAbout: number = 0;
  totalPhoto: number = 0;
  activeFilterLocation: number = 0;
  activeFilterParam: number = 0;
  activeFilterAdditional: number = 0;
  activeFilterAbout: number = 0;
  activeFilterPhoto: number = 0;
  totalActiveFilters: any;
  downloadedPhoto: any;

  toogleFilter(filter: string) {
    this.collapseParam = false;
    this.collapseLocation = false;
    this.collapseAbout = false;
    this.collapsePhoto = false;
    this.collapseAdditional = false;
    switch (filter) {
      case 'Param':
        this.collapseParam = true;
        break;
      case 'Location':
        this.collapseLocation = true;
        break;
      case 'About':
        this.collapseAbout = true;
        break;
      case 'Photo':
        this.collapsePhoto = true;
        break;
      case 'Additional':
        this.collapseAdditional = true;
        break;
    }
  }

  toogleAll() {
    this.collapseParamStatus = true;
    this.collapseLocationStatus = true;
    this.collapsePhotoStatus = true;
    this.collapseAboutStatus = true;
    this.collapseAdditionalStatus = true;
    this.awaitStatusBtn = false;
    setTimeout(() => {
      this.collapseParamStatus = false;
      this.collapseLocationStatus = false;
      this.collapsePhotoStatus = false;
      this.collapseAboutStatus = false;
      this.collapseAdditionalStatus = false;
      this.collapseParam = false;
      this.collapseLocation = false;
      this.collapsePhoto = false;
      this.collapseAbout = false;
      this.collapseAdditional = false;
      this.awaitStatusBtn = true;
    }, 1000);
  }

  getSpinnerClass(value: number): string {
    if (value >= 70) {
      return 'spinner-green';
    } else if (value >= 50) {
      return 'spinner-yellow';
    } else if (value > 0) {
      return 'spinner-red';
    } else {
      return 'spinner-gray';
    }
  }



  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private location: Location,
    private statusMessageService: StatusMessageService,
    private menuService: MenuService,
    private cardsDataHouseService: CardsDataHouseService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    await this.getSelectedFlatId();
    this.getToogleMenu();
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

  // підписка на статус меню
  async getToogleMenu() {
    this.subscriptions.push(
      this.menuService.toogleMenuEditHouse$.subscribe(async (status: boolean) => {
        if (!status) {
          this.toogleAll();
        }
      })
    );
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
        if (this.selectedFlatId) {
          this.loadDataFlat();
        } else {
          console.log('Оберіть оселю')
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
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

  async getAdditionalHouseInfo(): Promise<any> {
    this.additionalHouseInfo = await this.cardsDataHouseService.getAdditionalHouseInfo();
    this.countActiveFilters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }

  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.router.navigate(['/house/house-info']);
      }
    } else if (direction === 'left') {
      if (this.indexPage <= 4) {
        this.indexPage++;
      }
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  getHouseAcces(): void {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      if (this.acces_citizen === 1) {
        this.getAdditionalHouseInfo();
      }
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    } else {
      this.getAdditionalHouseInfo();
    }
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterLocation(): number {
    const totalFields = 15;
    let count = 0;
    // if (this.houseData.flat.country) count++;
    if (this.houseData.flat.region) count++;
    if (this.houseData.flat.city) count++;
    if (this.houseData.flat.district) count++;
    if (this.houseData.flat.micro_district) count++;
    if (this.houseData.param.metroname) count++;
    if (this.houseData.param.metrocolor) count++;
    if (this.houseData.flat.distance_metro) count++;
    if (this.houseData.flat.distance_green) count++;
    if (this.houseData.flat.distance_parking) count++;
    if (this.houseData.flat.distance_shop) count++;
    if (this.houseData.flat.distance_stop) count++;
    if (this.houseData.flat.street) count++;
    if (this.houseData.flat.houseNumber) count++;
    if (this.houseData.flat.flat_index) count++;
    if (this.houseData.flat.apartment) count++;
    this.totalLocation = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterParam(): number {
    const totalFields = 8;
    let count = 0;
    if (this.houseData.param.option_flat) count++;
    if (this.houseData.param.repair_status) count++;
    if (this.houseData.param.area) count++;
    if (this.houseData.param.kitchen_area) count++;
    if (this.houseData.param.rooms) count++;
    if (this.houseData.param.floor) count++;
    if (this.houseData.param.floorless) count++;
    if (this.houseData.param.balcony) count++;
    this.totalParam = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterAdditional(): number {
    const totalFields = 5;
    let count = 0;
    if (this.additionalHouseInfo.info_about) count++;
    if (this.additionalHouseInfo.osbb_name) count++;
    if (this.additionalHouseInfo.osbb_phone) count++;
    if (this.additionalHouseInfo.pay_card) count++;
    if (this.additionalHouseInfo.wifi) count++;
    this.totalAdditional = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterAbout(): number {
    const totalFields = 10;
    let count = 0;
    if (this.houseData.about.animals) count++;
    if (this.houseData.about.option_pay) count++;
    if (this.houseData.about.bunker) count++;
    if (this.houseData.about.price_m && this.houseData.about.price_m !== 0) count++;
    // if (this.houseData.about.price_d !== 0) count++;
    // if (this.houseData.about.private !== 0) count++;
    if (this.houseData.about.room) count++;
    if (this.houseData.about.students !== undefined && this.houseData.about.students !== null) count++;
    if (this.houseData.about.woman !== undefined && this.houseData.about.woman !== null) count++;
    if (this.houseData.about.man !== undefined && this.houseData.about.man !== null) count++;
    if (this.houseData.about.family !== undefined && this.houseData.about.family !== null) count++;
    if (this.houseData.about.about) count++;
    this.totalAbout = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterPhoto(): number {
    const totalFields = 20;
    if (this.houseData.imgs && this.houseData.imgs !== 'Картинок нема') {
      this.downloadedPhoto = this.houseData.imgs.length;
      this.totalPhoto = parseFloat(((this.downloadedPhoto / totalFields) * 100).toFixed(2));
    } else {
      this.downloadedPhoto = 0;
    }
    return this.downloadedPhoto || 0;
  }

  countActiveFilters() {
    // Отримуємо кількість активних фільтрів для кожної групи параметрів
    this.activeFilterLocation = this.countFilterLocation();
    this.activeFilterParam = this.countFilterParam();
    if (this.additionalHouseInfo) {
      this.activeFilterAdditional = this.countFilterAdditional();
    } else {
      this.activeFilterAdditional = 0;
    }
    this.activeFilterAbout = this.countFilterAbout();
    this.activeFilterPhoto = this.countFilterPhoto();
    // Підраховуємо загальну кількість активних фільтрів
    this.totalActiveFilters = this.activeFilterLocation + this.activeFilterParam + this.activeFilterAdditional + this.activeFilterAbout + this.activeFilterPhoto;
    const totalFields = 58;
    this.totalFilling = parseFloat(((this.totalActiveFilters / totalFields) * 100).toFixed(2));
  }






}
