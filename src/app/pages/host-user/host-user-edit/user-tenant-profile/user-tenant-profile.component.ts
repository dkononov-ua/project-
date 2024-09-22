import { regions } from '../../../../data/data-city';
import { cities } from '../../../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';
import { UsereSearchConfig } from '../../../../interface/param-config'
import { UserInfoSearch } from '../../../../interface/info'
import { animations } from '../../../../interface/animation';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { CityDataService } from 'src/app/services/data/cityData.service';
import { subway } from '../../../../data/subway';
import { distance } from '../../../../data/distance-confiq';
import * as select_options from 'src/app/data/select-options';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { StorageUserDataService } from 'src/app/services/storageUserData.service';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { Purpose, Distance, OptionPayTenant, Animals, Floor, Repair } from '../../../../interface/name';

@Component({
  selector: 'app-user-tenant-profile',
  templateUrl: './user-tenant-profile.component.html',
  styleUrls: ['./user-tenant-profile.component.scss'],

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
    animations.appearance,
  ],
})

export class UserTenantProfileComponent implements OnInit, OnDestroy {

  // розшифровка пошукових параметрів
  purpose = Purpose;
  aboutDistance = Distance;
  option_pay = OptionPayTenant;
  animals = Animals;
  floor = Floor;
  repair = Repair;

  @ViewChild('cityInput') cityInput: ElementRef | undefined;
  @ViewChild('regionInput') regionInput: ElementRef | undefined;

  activeFilterLocation: number = 0;
  activeFilterHouseParam: number = 0;
  activeFilterFeatures: number = 0;
  activeFilterTime: number = 0;
  totalActiveFilters: number = 0;
  authorization: boolean = false;

  searchReason: number = 0;

  statusMessage: string | undefined;
  errorMessage: string | undefined;
  activationUserSearch: boolean = false;
  deactivation: boolean = false;
  suggestConservation: boolean = false;


  checkReason() {

    if (this.searchReason === 1) {
      this.userInfo.option_pay = 3;
      this.maxValue = 10000000;
      this.minValue = 10000;
      this.step = 10000;
      this.userInfo.animals = '';
      this.userInfo.students = undefined;
      this.userInfo.woman = undefined;
      this.userInfo.man = undefined;
      this.userInfo.family = undefined;
    } else {
      this.userInfo.option_pay = 0;
      this.maxValue = 100000;
      this.minValue = 0;
      this.step = 1000;
    }
  }

  minValue: number = 0;
  maxValue: number = 100000;
  step: number = 1000;

  validatePriceRange(type: 'from' | 'to') {
    if (type === 'from' && this.userInfo.price_of > this.userInfo.price_to) {
      this.userInfo.price_to = this.userInfo.price_of;
    } else if (type === 'to' && this.userInfo.price_to < this.userInfo.price_of) {
      this.userInfo.price_of = this.userInfo.price_to;
    }
  }

  validateAreaRange(type: 'from' | 'to') {
    const area_of = Number(this.userInfo.area_of);
    const area_to = Number(this.userInfo.area_to);
    if (type === 'from' && area_of > area_to) {
      this.userInfo.area_to = area_of.toString();
    } else if (type === 'to' && area_to < area_of) {
      this.userInfo.area_of = area_to.toString();
    }
  }

  getRepairStatusName(value: number): string {
    const status = select_options.repair.find(r => r.value === value);
    return status ? status.name : 'Не визначено';
  }

  hideSingleSelectionIndicator = signal(true);
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  awaitStatusBtn: boolean = true;

  afterTimeSet() {
    this.saveDayCounts();
  }

  calculateTotalDays(): number {
    const days = Number(this.userInfo.days) || 0;
    const weeks = Number(this.userInfo.weeks) || 0;
    const months = Number(this.userInfo.mounths) || 0;
    const years = Number(this.userInfo.years) || 0;
    const totalDays = days + weeks * 7 + months * 30 + years * 365;
    return totalDays;
  }

  saveDayCounts(): void {
    const totalDays = this.calculateTotalDays();
    this.userInfo.day_counts = totalDays.toString();
  }


  collapseParam: boolean = false;
  collapseTime: boolean = false;
  collapseFeatures: boolean = false;
  collapseHouseParam: boolean = false;
  collapseLocation: boolean = false;

  collapseParamStatus: boolean = false;
  collapseTimeStatus: boolean = false;
  collapseFeaturesStatus: boolean = false;
  collapseHouseParamStatus: boolean = false;
  collapseLocationStatus: boolean = false;

  toogleFilter(filter: string) {
    this.collapseTime = false;
    this.collapseFeatures = false;
    this.collapseHouseParam = false;
    this.collapseLocation = false;
    this.collapseParam = false;
    switch (filter) {
      case 'time':
        this.collapseTime = true;
        break;
      case 'features':
        this.collapseFeatures = true;
        break;
      case 'houseParam':
        this.collapseHouseParam = true;
        break;
      case 'location':
        this.collapseLocation = true;
        break;
      case 'param':
        this.collapseParam = true;
        break;
    }
  }

  toogleAll() {
    this.collapseTimeStatus = true;
    this.collapseFeaturesStatus = true;
    this.collapseLocationStatus = true;
    this.collapseHouseParamStatus = true;
    this.collapseParamStatus = true;
    this.awaitStatusBtn = false;
    setTimeout(() => {
      this.collapseTimeStatus = false;
      this.collapseFeaturesStatus = false;
      this.collapseLocationStatus = false;
      this.collapseHouseParamStatus = false;
      this.collapseParamStatus = false;
      this.collapseTime = false;
      this.collapseFeatures = false;
      this.collapseLocation = false;
      this.collapseHouseParam = false;
      this.collapseParam = false;
      this.awaitStatusBtn = true;
    }, 1000);
  }

  pickCity(item: any) {
    this.chownCity = item;
    this.userInfo.city = item.name;
    this.userInfo.region = item.region;
    this.checkIfCityHasMetro();
    this.onDistrictInputChange();
    this.onSubmitWithDelay();
  }

  chownCity: any;
  subways = subway; // імпортовані дані про метро
  metroLines: any[] = []; // для зберігання ліній метро обраного міста
  stations: any[] = []; // для зберігання станцій метро обраної лінії
  lines: any[] = []; // Лінії метро обраного міста
  districts: any[] = []; // для зберігання районів міста Київ
  filteredDistricts: any;
  originalDistrictsList: any;
  metroExists: boolean = false;
  distanceConfiq = distance;
  options_floor = select_options.floor;

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // пагінатор
  offs = PaginationConfig.offs;
  optionsFound = PaginationConfig.counterFound;

  userInfo: UserInfoSearch = UsereSearchConfig;

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;
  loading = true;
  timer: any;
  searchQuery: string | undefined;

  minValueKitchen: number = 0;
  maxValueKitchen: number = 100;
  minValueFloor: number = -3;
  maxValueFloor: number = 47;
  isSearchTermCollapsed: boolean = false;
  filteredUsers: any[] = [];
  searchTimer: any;
  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  filteredFlats?: any;
  selectedFlatId!: string | null;
  houseData: any;

  shownCard: any;
  myData: boolean = false;
  startX = 0;
  myDataExist: boolean = false;
  addСardsToArray: boolean = false;
  debounceTimer: any;
  streetData: any;
  cityData: any;
  filteredStreets: any;

  isMobile = false;
  filterValue: string = '';
  subscriptions: any[] = [];
  blockBtnStatus: boolean = false;

  getBtnStatus() {

  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
    private cityDataService: CityDataService,
    private choseSubscribersService: ChoseSubscribersService,
    private storageUserDataService: StorageUserDataService,
    private statusMessageService: StatusMessageService,

  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.checkChownCityData();
    this.getBtnStatus();
    this.onSubmitWithDelay();
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

  // Якщо я на сторінці профілю
  async getStorageData() {
    const storageUserLooking = localStorage.getItem('storageUserLooking');
    if (storageUserLooking) {
      const storageUserObject = JSON.parse(storageUserLooking);
      this.userInfo = storageUserObject;
      this.countActiveFilters();
    } else {
      this.getInfo();
    }
  }

  // підписка на шлях до серверу
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

  clearFilterAll() {
    this.userInfo.about = '';
    this.userInfo.country = '';
    this.userInfo.room = undefined;
    this.userInfo.repair_status = 0;
    this.userInfo.bunker = '';
    this.userInfo.balcony = '';
    this.userInfo.animals = '';
    this.userInfo.distance_metro = 0;
    this.userInfo.distance_stop = 0;
    this.userInfo.distance_green = 0;
    this.userInfo.distance_shop = 0;
    this.userInfo.distance_parking = 0;
    this.userInfo.option_pay = undefined;
    this.userInfo.purpose_rent = '';
    this.userInfo.looking_woman = false;
    this.userInfo.looking_man = false;
    this.userInfo.students = undefined;
    this.userInfo.limit = 0;
    this.userInfo.woman = undefined;
    this.userInfo.man = undefined;
    this.userInfo.family = undefined;
    this.userInfo.house = undefined;
    this.userInfo.flat = undefined;
    this.userInfo.kitchen_area = 0;
    this.userInfo.room = undefined;
    this.userInfo.city = '';
    this.userInfo.region = '';
    this.userInfo.district = '';
    this.userInfo.street = '';
    this.userInfo.micro_district = '';
    this.userInfo.metroname = '';
    this.userInfo.metrocolor = '';
    this.chownCity = undefined;
    this.userInfo.days = 0;
    this.userInfo.weeks = 0;
    this.userInfo.mounths = 0;
    this.userInfo.years = 0;
    this.userInfo.day_counts = undefined;

    this.userInfo.rooms_to = 0;
    this.userInfo.rooms_of = 0;
    this.userInfo.area_to = '';
    this.userInfo.area_of = '';
    this.userInfo.price_of = 0;
    this.userInfo.price_to = 0;
    this.userInfo.floor = 0;

    this.afterTimeSet();
    this.countActiveFilters();
    this.suggestConservation = false;
  }

  clearFilterTime() {
    this.userInfo.days = 0;
    this.userInfo.weeks = 0;
    this.userInfo.mounths = 0;
    this.userInfo.years = 0;
    this.userInfo.day_counts = undefined;
    this.afterTimeSet();
    this.countActiveFilters();
  }

  clearFilterFeatures() {
    this.userInfo.about = '';
    this.userInfo.animals = '';
    this.userInfo.option_pay = undefined;
    this.userInfo.price_of = 0;
    this.userInfo.price_to = 0;
    this.userInfo.purpose_rent = '';
    this.userInfo.students = undefined;
    this.userInfo.woman = undefined;
    this.userInfo.man = undefined;
    this.userInfo.family = undefined;
    this.countActiveFilters();

  }

  clearFilterHouseParam() {
    this.userInfo.rooms_to = 0;
    this.userInfo.rooms_of = 0;
    this.userInfo.rooms = undefined;
    this.userInfo.area_to = '';
    this.userInfo.area_of = '';
    this.userInfo.bunker = '';
    this.userInfo.balcony = '';
    this.userInfo.repair_status = 0;
    this.userInfo.distance_stop = 0;
    this.userInfo.distance_green = 0;
    this.userInfo.distance_shop = 0;
    this.userInfo.distance_parking = 0;
    this.userInfo.house = undefined;
    this.userInfo.flat = undefined;
    this.userInfo.kitchen_area = 0;
    this.userInfo.room = undefined;
    this.userInfo.looking_woman = false;
    this.userInfo.looking_man = false;
    this.userInfo.floor = 0;
    this.countActiveFilters();
  }

  clearFilterLocation() {
    this.searchQuery = '';
    this.userInfo.country = '';
    this.userInfo.region = '';
    this.userInfo.city = '';
    this.userInfo.district = '';
    this.userInfo.street = '';
    this.userInfo.micro_district = '';
    this.userInfo.metroname = '';
    this.userInfo.metrocolor = '';
    this.userInfo.distance_metro = 0;
    this.chownCity = undefined;
    this.countActiveFilters();
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterLocation(): number {
    let count = 0;
    if (this.userInfo.country) count++;
    if (this.userInfo.region) count++;
    if (this.userInfo.city) count++;
    if (this.userInfo.district) count++;
    if (this.userInfo.street) count++;
    if (this.userInfo.micro_district) count++;
    if (this.userInfo.metroname) count++;
    if (this.userInfo.metrocolor) count++;
    if (this.userInfo.distance_metro) count++;
    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterHouseParam(): number {
    let count = 0;
    if (this.userInfo.room !== undefined) count++;
    if (this.userInfo.rooms !== undefined) count++;
    if (this.userInfo.area > 0) count++;
    if (this.userInfo.bunker !== '') count++;
    if (this.userInfo.balcony !== '') count++;
    if (this.userInfo.repair_status > 0) count++;
    if (this.userInfo.distance_stop !== 0) count++;
    if (this.userInfo.distance_green !== 0) count++;
    if (this.userInfo.distance_shop !== 0) count++;
    if (this.userInfo.distance_parking !== 0) count++;
    if (this.userInfo.house !== undefined) count++;
    if (this.userInfo.flat !== undefined) count++;
    if (this.userInfo.kitchen_area !== undefined) count++;
    if (this.userInfo.looking_woman) count++;
    if (this.userInfo.looking_man) count++;

    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterFeatures(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.userInfo.animals !== '') count++;
    if (this.userInfo.option_pay !== undefined) count++;
    if (this.userInfo.price && this.userInfo.price !== 0) count++;
    if (this.userInfo.purpose_rent !== '') count++;
    if (this.userInfo.students !== undefined) count++;
    if (this.userInfo.woman !== undefined) count++;
    if (this.userInfo.man !== undefined) count++;
    if (this.userInfo.family !== undefined) count++;
    return count;
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterTime(): number {
    let count = 0;
    if (this.userInfo.days !== 0) count++;
    if (this.userInfo.weeks !== 0) count++;
    if (this.userInfo.mounths !== 0) count++;
    // if (this.userInfo.day_counts && this.userInfo.day_counts !== '0') count++;
    return count;
  }

  countActiveFilters() {
    // Отримуємо кількість активних фільтрів для кожної групи параметрів
    this.activeFilterLocation = this.countFilterLocation();
    this.activeFilterHouseParam = this.countFilterHouseParam();
    this.activeFilterFeatures = this.countFilterFeatures();
    this.activeFilterTime = this.countFilterTime();

    // Підраховуємо загальну кількість активних фільтрів
    this.totalActiveFilters = this.activeFilterLocation + this.activeFilterHouseParam + this.activeFilterFeatures + this.activeFilterTime;
  }

  // отримуємо інформацію про наш профіль орендаря
  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) }).toPromise();
        console.log(response)
        if (response.status === true) {
          this.userInfo = response.inf;
          this.countActiveFilters();
          if (this.userInfo.option_pay === 3) {
            this.searchReason = 1;
          } else {
            this.searchReason = 0;
          }
          this.checkIfCityHasMetro();
          this.checkChownCityData();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async ifSelectedCity(cityData: any) {
    if (cityData.cityUa !== this.userInfo.city) {
      this.filteredDistricts = [];
      this.filteredRegions = [];
      this.userInfo.micro_district = '';
      this.userInfo.district = '';
      this.userInfo.region = '';
      this.userInfo.metrocolor = '';
      this.userInfo.metroname = '';
    }
    this.cityDataService.ifSelectedCity(cityData);
    this.cityData = cityData;
    if (this.cityData) {
      this.userInfo.region = cityData.regionUa;
      this.userInfo.city = cityData.cityUa;
      if (this.userInfo.city === 'Київ') {
        this.userInfo.region = 'Київська'
      } else {
        this.districts = [];
      }
      this.checkChownCityData();
    }
  }

  // Шукаю інформацію за обраною областю для виведення картинки та інфи по ній
  checkChownCityData() {
    if (this.userInfo.region) {
      const existingCity = this.cities.find((c: { region: string; }) => c.region === this.userInfo.region);
      if (existingCity) {
        this.chownCity = existingCity;
        // console.log(this.chownCity)
        this.checkIfCityHasMetro();
        this.onDistrictInputChange();
      }
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
    this.onSubmitWithDelay();
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
    this.onSubmitWithDelay();
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

  // Логіка для обробки змін в полі вибору району
  async onDistrictInputChange() {
    if (this.userInfo.city) {
      this.filteredDistricts = [];
      this.filteredDistricts = await this.cityDataService.loadDistrictFromOwnDB(this.userInfo.city);
    }
  }

  checkIfCityHasMetro() {
    if (this.userInfo.city === 'Київ' || this.userInfo.city === 'Харків' || this.userInfo.city === 'Дніпро') {
      this.metroExists = true;
      this.onCitySelect(this.userInfo.city);
    } else {
      this.metroExists = false;
    }
  }

  // Обробка вибору міста для отримання ліній метро
  onCitySelect(selected: string) {
    if (this.userInfo.city !== selected) {
      this.stations = []; // Скидаємо список станцій
      this.userInfo.metrocolor = ''; // Очищуємо вибрану лінію метро
    }
    const selectedCity = this.subways.find(city => city.name === selected);
    if (selectedCity) {
      this.lines = selectedCity.lines;
      if (this.userInfo.metrocolor) {
        this.onLineSelect(this.userInfo.metrocolor);
      }
    }
  }

  // Обробка вибору лінії метро для отримання станцій метро
  onLineSelect(selected: any) {
    const selectedLine = this.lines.find(line => line.name === selected);
    if (selectedLine) {
      this.stations = selectedLine.stations;

    }
  }

  // перевіряємо поля без яких оголошення не буде відображатись в пошуку
  async checkAtivationUserSearch(): Promise<boolean> {
    if (!this.userInfo.city || this.userInfo.city === '') {
      this.activationUserSearch = false;
      this.statusMessageService.setStatusMessage('Треба вказати місто');
      setTimeout(() => {
        this.triggerInputClick('city');
        this.toogleFilter('location');
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
      this.toogleFilter('features');

      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
      }, 1500);
    } else if (this.userInfo.region && this.userInfo.city && this.userInfo.option_pay !== undefined && this.userInfo.option_pay !== null) {
      this.activationUserSearch = true;
    }
    return this.activationUserSearch;
  }

  // робимо клік на поле там де треба вносити інформацію
  triggerInputClick(input: string): void {
    if (input === 'region' && this.regionInput) {
      this.toogleFilter('location');
      this.regionInput.nativeElement.click();
    } else if (input === 'city' && this.cityInput) {
      this.toogleFilter('location');
      this.cityInput.nativeElement.click();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async saveInfo(): Promise<void> {
    const isActivated = await this.checkAtivationUserSearch();
    if (!isActivated) {
      return
    }
    this.storageUserDataService.activateTenantProfile(this.userInfo);
  }

  saveInfoLocal() {
    if (this.userInfo.option_pay === 2) {
      this.userInfo.price_of = 0.01;
      this.userInfo.price_to = 0.01;
    }
    localStorage.setItem('storageUserLooking', JSON.stringify(this.userInfo));
    setTimeout(() => {
      this.sharedService.getAuthorization();
    }, 1500);
  }

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      if (this.userInfo.city && this.userInfo.region && this.userInfo.option_pay !== undefined && this.userInfo.option_pay !== null) {
        this.suggestConservation = true;
      }
      this.countActiveFilters();
    }, 1500);
  }


}

