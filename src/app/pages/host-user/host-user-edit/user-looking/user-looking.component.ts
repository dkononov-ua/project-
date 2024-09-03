import { regions } from '../../../../data/data-city';
import { cities } from '../../../../data/data-city';
import { subway } from '../../../../data/subway';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { Location } from '@angular/common';
import { StorageUserDataService } from 'src/app/services/storageUserData.service';
import { CityDataService } from 'src/app/services/data/cityData.service';
import { UserInfo } from 'src/app/interface/info';
import { UserConfig } from 'src/app/interface/param-config';
import { StatusMessageService } from 'src/app/services/status-message.service';

@Component({
  selector: 'app-user-looking',
  templateUrl: './user-looking.component.html',
  styleUrls: ['./user-looking.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
    animations.top1,
    animations.top2,
  ],
})

export class UserLookingComponent implements OnInit, OnDestroy {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  @ViewChild('cityInput') cityInput: ElementRef | undefined;
  @ViewChild('regionInput') regionInput: ElementRef | undefined;

  userInfo: UserInfo = UserConfig;

  filteredStations: any[] = [];
  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string | undefined;
  regions = regions;
  cities = cities;
  subway = subway;
  minValue: number = 0;
  maxValue: number = 100000;

  minValueDays: number = 0;
  maxValueDays: number = 31;

  minValueWeeks: number = 0;
  maxValueWeeks: number = 4;

  minValueMounths: number = 0;
  maxValueMounths: number = 11;

  minValueYears: number = 0;
  maxValueYears: number = 3;

  disabled: boolean = true;

  currentStep: number = 1;
  statusMessage: string | undefined;
  errorMessage: string | undefined;
  activationUserSearch: boolean = false;
  deactivation: boolean = false;
  filteredStreets: any;

  changeStep(step: number): void {
    this.indexPage = step;
  }

  // показ карток
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  numConcludedAgree: any;
  selectedAgree: any;
  page: any;
  startX = 0;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  onKeyPress(event: KeyboardEvent, maxLength: number) {
    // Отримайте введене значення
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    // Перевірте, чи введене значення більше заданої довжини
    if (inputValue.length >= maxLength) {
      // Скасуйте подію, якщо введено більше символів, ніж дозволено
      event.preventDefault();
    }
    this.onDayCountsChange();
  }

  goBack(): void {
    this.location.back();
  }

  calculateTotalDays(): number {
    const days = this.userInfo.days || 0;
    const weeks = this.userInfo.weeks || 0;
    const mounths = this.userInfo.mounths || 0;
    const years = this.userInfo.years || 0;
    const totalDays = days + weeks * 7 + mounths * 30 + years * 365;
    return totalDays;
  }

  saveDayCounts(): void {
    const totalDays = this.calculateTotalDays();
    this.userInfo.day_counts = totalDays > 0 ? totalDays : 0;
  }

  onDayCountsChange(): void {
    this.saveDayCounts();
  }

  help: number = 0;
  toggleHelp(index: number) {
    this.help = index;
  }
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];

  debounceTimer: any;
  cityData: any;
  streetData: any;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private location: Location,
    private storageUserDataService: StorageUserDataService,
    private cityDataService: CityDataService,
    private statusMessageService: StatusMessageService,

  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    await this.getInfo();
  }

  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
        if (this.isMobile) {
          this.indexPage = 0;
        } else {
          this.indexPage = 1;
        }
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
      this.getStorageData();
    } else {
      this.authorization = false;
    }
  }

  checkRooms() {
    if (this.userInfo.room) {
      this.userInfo.looking_woman = false;
      this.userInfo.looking_man = false;
    }
  }

  // отримуємо інформацію про наш профіль орендаря
  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.userInfo = response.inf;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async saveInfo(): Promise<void> {

    const isActivated = await this.checkAtivationUserSearch();

    if (!isActivated) {
      return
    }

    if (this.userInfo.option_pay === 2) {
      this.userInfo.price_of = 0.01;
      this.userInfo.price_to = 0.01;
    }
    const data = {
      agree_search: false,
      price_of: this.userInfo.price_of,
      country: this.userInfo.country || 'Україна',
      price_to: this.userInfo.price_to,
      region: this.userInfo.region,
      city: this.userInfo.city,
      rooms_of: this.userInfo.rooms_of,
      rooms_to: this.userInfo.rooms_to,
      area_of: this.userInfo.area_of,
      area_to: this.userInfo.area_to,
      repair_status: this.userInfo.repair_status,
      bunker: this.userInfo.bunker,
      balcony: this.userInfo.balcony,
      animals: this.userInfo.animals,
      distance_metro: this.userInfo.distance_metro,
      distance_stop: this.userInfo.distance_stop,
      distance_green: this.userInfo.distance_green,
      distance_shop: this.userInfo.distance_shop,
      distance_parking: this.userInfo.distance_parking,
      option_pay: this.userInfo.option_pay,
      day_counts: this.userInfo.day_counts,
      purpose_rent: this.userInfo.purpose_rent,
      house: this.userInfo.house,
      flat: this.userInfo.flat,
      room: this.userInfo.room,
      looking_woman: this.userInfo.looking_woman,
      looking_man: this.userInfo.looking_man,
      students: this.userInfo.students,
      woman: this.userInfo.woman,
      man: this.userInfo.man,
      family: this.userInfo.family,
      days: this.userInfo.days,
      weeks: this.userInfo.weeks,
      mounths: this.userInfo.mounths,
      years: this.userInfo.years,
      about: this.userInfo.about,
      metro: this.userInfo.metro,
    };
    // console.log(data)
    this.storageUserDataService.activateTenantProfile(data);
  }

  // Якщо я на сторінці профілю
  async getStorageData() {
    const storageUserLooking = localStorage.getItem('storageUserLooking');
    if (storageUserLooking) {
      const storageUserObject = JSON.parse(storageUserLooking);
      this.userInfo = storageUserObject;
    }
  }

  saveInfoLocal() {
    if (this.userInfo.option_pay === 2) {
      this.userInfo.price_of = 0.01;
      this.userInfo.price_to = 0.01;
    }
    const data = {
      agree_search: false,
      price_of: this.userInfo.price_of,
      price_to: this.userInfo.price_to,
      region: this.userInfo.region,
      city: this.userInfo.city,
      rooms_of: this.userInfo.rooms_of,
      rooms_to: this.userInfo.rooms_to,
      area_of: this.userInfo.area_of,
      area_to: this.userInfo.area_to,
      repair_status: this.userInfo.repair_status,
      bunker: this.userInfo.bunker,
      balcony: this.userInfo.balcony,
      animals: this.userInfo.animals,
      distance_metro: this.userInfo.distance_metro,
      distance_stop: this.userInfo.distance_stop,
      distance_green: this.userInfo.distance_green,
      distance_shop: this.userInfo.distance_shop,
      distance_parking: this.userInfo.distance_parking,
      option_pay: this.userInfo.option_pay,
      day_counts: this.userInfo.day_counts,
      purpose_rent: this.userInfo.purpose_rent,
      house: this.userInfo.house,
      flat: this.userInfo.flat,
      room: this.userInfo.room,
      looking_woman: this.userInfo.looking_woman,
      looking_man: this.userInfo.looking_man,
      students: this.userInfo.students,
      woman: this.userInfo.woman,
      man: this.userInfo.man,
      family: this.userInfo.family,
      days: this.userInfo.days,
      weeks: this.userInfo.weeks,
      mounths: this.userInfo.mounths,
      years: this.userInfo.years,
      about: this.userInfo.about,
      metro: this.userInfo.metro,
    };
    localStorage.setItem('storageUserLooking', JSON.stringify(data));
    setTimeout(() => {
      this.sharedService.getAuthorization();
    }, 1500);
  }

  // робимо клік на поле там де треба вносити інформацію
  triggerInputClick(input: string): void {
    if (input === 'region' && this.regionInput) {
      this.regionInput.nativeElement.click();
    } else if (input === 'city' && this.cityInput) {
      this.cityInput.nativeElement.click();
    }
  }

  // перевіряємо поля без яких оголошення не буде відображатись в пошуку
  async checkAtivationUserSearch(): Promise<boolean> {
    this.errorMessage = '';
    if (!this.userInfo.city || this.userInfo.city === '') {
      this.activationUserSearch = false;
      this.statusMessageService.setStatusMessage('Треба вказати місто');
      setTimeout(() => {
        this.triggerInputClick('city');
        this.statusMessageService.setStatusMessage('');
      }, 1500);
    } else if (!this.userInfo.region || this.userInfo.region === '') {
      this.activationUserSearch = false;
      this.statusMessageService.setStatusMessage('Треба вказати область');
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
        this.triggerInputClick('region');
      }, 1500)
    } else if (this.userInfo.option_pay === undefined || this.userInfo.option_pay === null) {
      this.activationUserSearch = false;
      this.statusMessageService.setStatusMessage('Треба вказати варіант оплати');
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
      }, 1500);
    } else if (this.userInfo.region && this.userInfo.city && this.userInfo.option_pay !== undefined && this.userInfo.option_pay !== null) {
      this.activationUserSearch = true;
    }
    return this.activationUserSearch;
  }

  ifSelectedCity(cityData: any) {
    this.cityDataService.ifSelectedCity(cityData);
    this.cityData = cityData;
    // console.log(this.cityData)
    if (this.cityData) {
      this.userInfo.region = cityData.regionUa;
      this.userInfo.city = cityData.cityUa;
      if (this.userInfo.city === 'Київ') {
        this.userInfo.region = 'Київська'
      }
      // this.userInfo.district = cityData.districtUa;
      // this.userInfo.micro_district = '';
      // this.userInfo.street = '';
    }
  }

  ifSelectedStreet(streetData: any) {
    this.cityDataService.ifSelectedStreet(streetData);
    this.streetData = streetData;
    // console.log(this.streetData)
    if (this.streetData) {
      this.userInfo.street = streetData.streetUa;
      this.userInfo.micro_district = '';
    }
  }

  // завантаження бази областей
  async onRegionsInputChange(regions: string) {
    this.filteredRegions = this.cityDataService.loadRegionsFromOwnDB(regions);
  }
  // завантаження бази міст областей районів
  async onCityInputChange(city: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (city && city.length >= 3) {
      const existingCity = this.filteredCities?.find((c: { cityUa: string; }) => c.cityUa === city);
      if (existingCity) {
        return;
      }
      this.debounceTimer = setTimeout(async () => {
        this.filteredCities = await this.cityDataService.onCityInputChange(city);
        if (!this.filteredCities || this.filteredCities.length === 0) {
          // якщо апі не відповідає або нічого не знайшло я шукаю у власній БД міст
          this.filteredCities = await this.cityDataService.loadCitiesFromOwnDB(city);
        }
      }, 1000);
    }
  }
  // завантаження бази вулиць
  async onStreetInputChange(street: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (street && street.length >= 2) {
      const existingStreet = this.filteredStreets?.find((s: { streetUa: string; }) => s.streetUa === street);
      if (existingStreet) {
        return; // Виходимо, щоб уникнути повторного запиту
      }

      this.debounceTimer = setTimeout(async () => {
        this.filteredStreets = await this.cityDataService.onStreetInputChange(street);
        console.log(this.filteredStreets);
      }, 500);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
