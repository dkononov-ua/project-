import { regions } from '../../../../data/data-city';
import { cities } from '../../../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
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
import { FilterService } from 'src/app/services/search/filter.service';
import { ChoseSubscribeService } from 'src/app/services/chose-subscribe.service';

@Component({
  selector: 'app-search-term-house',
  templateUrl: './search-term-house.component.html',
  styleUrls: ['./../../../../style/search/search.term.scss'],

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

export class SearchTermHouseComponent implements OnInit, OnDestroy {

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


  activeFilterLocation: number = 0;
  activeFilterHouseParam: number = 0;
  activeFilterFeatures: number = 0;
  activeFilterTime: number = 0;
  totalActiveFilters: number = 0;
  activeSorting: number = 0;
  userInfoSearch: any;

  hideSingleSelectionIndicator = signal(true);
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  awaitStatusBtn: boolean = true;

  afterTimeSet() {
    this.saveDayCounts();
    this.onSubmitWithDelay();
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

  collapseTime: boolean = false;
  collapseFeatures: boolean = false;
  collapseHouseParam: boolean = false;
  collapseLocation: boolean = false;
  collapseSort: boolean = false;

  collapseTimeStatus: boolean = false;
  collapseFeaturesStatus: boolean = false;
  collapseHouseParamStatus: boolean = false;
  collapseLocationStatus: boolean = false;
  collapseSortStatus: boolean = false;

  toogleFilter(filter: string) {
    this.collapseTime = false;
    this.collapseSort = false;
    this.collapseFeatures = false;
    this.collapseHouseParam = false;
    this.collapseLocation = false;
    switch (filter) {
      case 'time':
        this.collapseTime = true;
        this.setIndexPage(4);
        break;
      case 'filterParam':
        this.collapseSort = true;
        this.setIndexPage(4);
        break;
      case 'features':
        this.collapseFeatures = true;
        this.setIndexPage(4);
        break;
      case 'houseParam':
        this.collapseHouseParam = true;
        this.setIndexPage(4);
        break;
      case 'location':
        this.collapseLocation = true;
        this.setIndexPage(4);
        break;
    }
  }

  toogleAll() {
    this.setIndexPage(2);
    this.collapseTimeStatus = true;
    this.collapseSortStatus = true;
    this.collapseFeaturesStatus = true;
    this.collapseLocationStatus = true;
    this.collapseHouseParamStatus = true;
    this.awaitStatusBtn = false;
    setTimeout(() => {
      this.collapseTimeStatus = false;
      this.collapseSortStatus = false;
      this.collapseFeaturesStatus = false;
      this.collapseLocationStatus = false;
      this.collapseHouseParamStatus = false;
      this.collapseTime = false;
      this.collapseSort = false;
      this.collapseFeatures = false;
      this.collapseLocation = false;
      this.collapseHouseParam = false;
      this.awaitStatusBtn = true;
    }, 1000);
  }

  setIndexPage(index: number) {
    this.indexPage = index;
    this.choseSubscribeService.setIndexPage(index);
  }

  // Відправляю на сервіс фільтр який я хочу застосувати
  onSortSelected(value: string) {
    this.filterValue = value;
    this.filterService.sortHouse(value)
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
  filter_group: number = 1;
  openUser: boolean = false;

  card_info: number = 0;
  indexPage: number = 1;
  shownCard: any;
  myData: boolean = false;
  startX = 0;
  myDataExist: boolean = false;
  addСardsToArray: boolean = false;
  debounceTimer: any;
  streetData: any;
  cityData: any;
  filteredStreets: any;

  filterSwitchNext() {
    if (this.filter_group < 4) {
      this.filter_group++;
    }
  }

  filterSwitchPrev() {
    if (this.filter_group > 1) {
      this.filter_group--;
    }
  }


  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }

  isMobile = false;
  filterValue: string = '';
  subscriptions: any[] = [];
  blockBtnStatus: boolean = false;
  limit: number = 0;

  getBtnStatus() {
    this.subscriptions.push(
      this.filterService.blockBtnStatus$.subscribe(blockBtnStatus => {
        this.blockBtnStatus = blockBtnStatus;
      })
    )
  }

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private cityDataService: CityDataService,
    private choseSubscribeService: ChoseSubscribeService,) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkAuthorization();
    this.getSelectedFlat();
    this.getSortValue();
    this.checkChownCityData();
    this.getBtnStatus();
    this.getLimits();
  }

  // перевірію чи авторизований я і чи є в мене дані про профіль орендаря
  checkAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const searchInfoUserData = localStorage.getItem('searchInfoUserData');
      if (searchInfoUserData) {
        this.myDataExist = true;
      } else {
        this.myDataExist = false;
      }
    } else {
      this.myDataExist = false;
    }
  }

  getSortValue() {
    // console.log('getSortValue')
    this.filterService.sortValue$.subscribe(sortValue => {
      if (sortValue) {
        this.limit = 0;
        this.filteredFlats = [];
        if (sortValue === '0') {
          this.userInfo.filterData = '';
        } else {
          this.userInfo.filterData = sortValue;
        }
        this.onSubmitWithDelay()
      }
    });
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

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId;
        if (!this.selectedFlatId) {
          this.selectedFlatId = '1';
          this.onSubmitWithDelay();
        } else {
          this.onSubmitWithDelay();
        }
      })
    );
  }

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getLimits() {
    this.subscriptions.push(
      this.filterService.limits$.subscribe((limits: number) => {
        if (this.userInfo.limit !== limits) {
          this.userInfo.limit = limits;
          this.onSubmitWithDelay();
        }
      })
    );
  }

  clearFilterAll() {
    this.loading = true;
    this.myData = false;
    setTimeout(() => {
      this.indexPage = 1;
      this.loading = false;
    }, 500);
    this.userInfo.country = '';
    this.indexPage = 0;
    this.searchQuery = '';
    this.userInfo.room = undefined;
    this.userInfo.price = undefined;
    this.userInfo.rooms = undefined;
    this.userInfo.area = 0;
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
    this.userInfo.filterData = '';

    setTimeout(() => {
      this.onSubmitWithDelay();
    }, 100);
  }

  clearFilterTime() {
    this.userInfo.days = 0;
    this.userInfo.weeks = 0;
    this.userInfo.mounths = 0;
    this.userInfo.years = 0;
    this.userInfo.day_counts = undefined;
    this.afterTimeSet();
  }

  clearFilterFeatures() {
    this.loading = true;
    this.myData = false;
    setTimeout(() => {
      this.indexPage = 1;
      this.loading = false;
    }, 500);
    this.indexPage = 0;
    this.searchQuery = '';
    this.userInfo.animals = '';
    this.userInfo.option_pay = undefined;
    this.userInfo.price = undefined;
    this.userInfo.purpose_rent = '';
    this.userInfo.students = undefined;
    this.userInfo.woman = undefined;
    this.userInfo.man = undefined;
    this.userInfo.family = undefined;
    setTimeout(() => {
      this.onSubmitWithDelay();
    }, 100);
  }

  clearFilterHouseParam() {
    this.loading = true;
    this.myData = false;
    setTimeout(() => {
      this.indexPage = 1;
      this.loading = false;
    }, 500);
    this.indexPage = 0;
    this.userInfo.room = undefined;
    this.userInfo.rooms = undefined;
    this.userInfo.area = 0;
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
    setTimeout(() => {
      this.onSubmitWithDelay();
    }, 100);
  }

  clearFilterLocation() {
    this.loading = true;
    this.myData = false;
    setTimeout(() => {
      this.setIndexPage(2);
      this.loading = false;
    }, 500);
    this.indexPage = 0;
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
    setTimeout(() => {
      this.onSubmitWithDelay();
    }, 100);
  }

  clearSorting() {
    this.userInfo.filterData = '';
    setTimeout(() => {
      this.onSubmitWithDelay();
    }, 100);
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
    if (this.userInfo.distance_stop) count++;
    if (this.userInfo.distance_green) count++;
    if (this.userInfo.distance_shop) count++;
    if (this.userInfo.distance_parking) count++;
    if (this.userInfo.house !== undefined) count++;
    if (this.userInfo.flat !== undefined) count++;
    if (this.userInfo.kitchen_area > 0) count++;
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
    if (this.userInfo.day_counts && this.userInfo.day_counts !== '0') count++;
    return count;
  }

  // Метод для підрахунку сортування
  countSorting(): number {
    let count = 0;
    if (this.userInfo.filterData !== '') count++;
    return count;
  }

  countActiveFilters() {
    // Отримуємо кількість активних фільтрів для кожної групи параметрів
    this.activeFilterLocation = this.countFilterLocation();
    this.activeFilterHouseParam = this.countFilterHouseParam();
    this.activeFilterFeatures = this.countFilterFeatures();
    this.activeFilterTime = this.countFilterTime();
    this.activeSorting = this.countSorting();
    // Підраховуємо загальну кількість активних фільтрів
    this.totalActiveFilters = this.activeFilterLocation + this.activeFilterHouseParam + this.activeFilterFeatures + this.activeFilterTime;
  }

  loadDataUserSearch() {
    this.myData = true;
    const searchInfoUserData = localStorage.getItem('searchInfoUserData');
    if (searchInfoUserData !== null) {
      this.myDataExist = true;
      this.userInfoSearch = JSON.parse(searchInfoUserData);
      // console.log(this.userInfoSearch)
      this.userInfo.region = this.userInfoSearch.region || '';
      this.userInfo.city = this.userInfoSearch.city || '';
      this.userInfo.country = this.userInfoSearch.country || '';

      this.userInfo.area_of = this.userInfoSearch.area_of === '0.00' ? '' : this.userInfoSearch.area_of;
      this.userInfo.area_to = this.userInfoSearch.area_to === '100000.00' ? '' : this.userInfoSearch.area_to;

      this.userInfo.option_pay = this.userInfoSearch.option_pay.toString();
      this.userInfo.price_of = this.userInfoSearch.price_of;
      this.userInfo.price_to = this.userInfoSearch.price_to;

      this.userInfo.rooms_of = this.userInfoSearch.rooms_of;
      this.userInfo.rooms_to = this.userInfoSearch.rooms_to;

      this.userInfo.animals = this.userInfoSearch.animals === 'Неважливо' ? '' : this.userInfoSearch.animals;
      this.userInfo.repair_status = this.userInfoSearch.repair_status === 'Неважливо' ? '' : this.userInfoSearch.repair_status;
      this.userInfo.balcony = this.userInfoSearch.balcony === 'Неважливо' ? '' : this.userInfoSearch.balcony;
      this.userInfo.bunker = this.userInfoSearch.bunker === 'Неважливо' ? '' : this.userInfoSearch.bunker;

      this.userInfo.distance_metro = this.userInfoSearch.distance_metro;
      this.userInfo.distance_stop = this.userInfoSearch.distance_stop;
      this.userInfo.distance_green = this.userInfoSearch.distance_green;
      this.userInfo.distance_shop = this.userInfoSearch.distance_shop;
      this.userInfo.distance_parking = this.userInfoSearch.distance_parking;

      this.userInfo.students = this.userInfoSearch.students;
      this.userInfo.woman = this.userInfoSearch.woman;
      this.userInfo.man = this.userInfoSearch.man;
      this.userInfo.family = this.userInfoSearch.family;

      this.userInfo.district = this.userInfoSearch.district || '';
      this.userInfo.micro_district = this.userInfoSearch.micro_district || '';

      this.userInfo.metroname = this.userInfoSearch.metroname || '';
      this.userInfo.metrocolor = this.userInfoSearch.metrocolor || '';


      if (this.userInfoSearch.flat === 1 && this.userInfoSearch.house !== 1) {
        this.userInfo.option_flat = '2';
      } else if (this.userInfoSearch.flat !== 1 && this.userInfoSearch.house === 1) {
        this.userInfo.option_flat = '1';
      } else if (this.userInfoSearch.flat !== 1 && this.userInfoSearch.house === 1) {
        this.userInfo.option_flat = ''
      }

      this.userInfo.room = this.userInfoSearch.room;
      this.userInfo.looking_woman = this.userInfoSearch.looking_woman;
      this.userInfo.looking_man = this.userInfoSearch.looking_man;

      this.onSubmitWithDelay();

    } else {
      this.myDataExist = false;
    }
  }

  // пошук оселі по ID
  async searchByID() {
    if (this.searchQuery) {
      const endpoint = this.serverPath + '/search/flat';
      const flatId = this.searchQuery;
      const url = `${endpoint}/?flat_id=${flatId}`;
      await this.getSearchData(url);
      if (this.optionsFound === 1) {
        setTimeout(() => {
          this.indexPage = 2;
        }, 500);
      }
      return;
    }
    if (!this.searchQuery) {
      this.onSubmitWithDelay();
      return;
    }
  }

  // збір пошукових параметрів
  async searchFilter() {
    this.countActiveFilters();

    if (!this.userInfo.room) {
      this.userInfo.looking_woman = false;
      this.userInfo.looking_man = false;
    }

    const params = {
      price_of: this.userInfo.price_of || '',
      price_to: this.userInfo.price_to || '',
      region: this.userInfo.region || '',
      day_counts: this.userInfo.day_counts || '',
      city: this.userInfo.city || '',
      rooms_of: this.userInfo.rooms_of || '',
      rooms_to: this.userInfo.rooms_to || '',
      area_of: this.userInfo.area_of || '',
      area_to: this.userInfo.area_to || '',
      repair_status: this.userInfo.repair_status || '',
      kitchen_area: this.userInfo.kitchen_area || '',
      animals: this.userInfo.animals || '',
      distance_metro: this.userInfo.distance_metro || '',
      distance_stop: this.userInfo.distance_stop || '',
      distance_green: this.userInfo.distance_green || '',
      distance_shop: this.userInfo.distance_shop || '',
      distance_parking: this.userInfo.distance_parking || '',
      country: this.userInfo.country || '',

      students: this.userInfo.students ? '1' : '',
      woman: this.userInfo.woman ? '1' : '',
      man: this.userInfo.man ? '1' : '',
      family: this.userInfo.family ? '1' : '',


      balcony: this.userInfo.balcony || '',
      bunker: this.userInfo.bunker || '',
      option_flat: this.userInfo.option_flat || '',
      room: this.userInfo.room ? '1' : '',

      option_pay: this.userInfo.option_pay || '0',
      limit: this.limit || 0,
      looking_woman: this.userInfo.looking_woman ? '1' : '',
      looking_man: this.userInfo.looking_man ? '1' : '',
      filterData: this.userInfo.filterData || '',
      purpose_rent: this.userInfo.purpose_rent || '',
      days: this.userInfo.days || 0,
      weeks: this.userInfo.weeks || 0,
      months: this.userInfo.months || 0,
      years: this.userInfo.years || 0,
      house: this.userInfo.house || 0,
      flat: this.userInfo.flat || 0,
      street: this.userInfo.street || '',


      district: this.userInfo.district || '',
      micro_district: this.userInfo.micro_district || '',
      metroname: this.userInfo.metroname || '',
      metrocolor: this.userInfo.metrocolor || '',
      floor: this.userInfo.floor || '',

    };
    // console.log(params)
    const url = this.buildSearchURL(params);
    setTimeout(async () => {
      await this.getSearchData(url);
    }, 200);
  }


  // побудова URL пошукового запиту
  buildSearchURL(params: any): string {
    const endpoint = this.serverPath + '/search/flat';
    const paramsString = Object.keys(params).filter(key => params[key] !== '').map(key => key + '=' + params[key]).join('&');
    return `${endpoint}?${paramsString}`;
  }

  // передача пошукових фільтрів та отримання результатів пошуку
  async getSearchData(url: string) {
    if (url) {
      try {
        this.filterService.blockBtn(true)
        const response: any = await this.http.get(url).toPromise();
        if (response) {
          this.optionsFound = response.count;
          if (this.userInfo.filterData) {
            this.filteredFlats = response.img;
          } else if (!this.addСardsToArray) {
            this.filteredFlats = response.img;
          } else if (this.addСardsToArray) {
            this.filteredFlats.push(...response.img);
            setTimeout(() => {
              this.addСardsToArray = false;
            }, 100);
          }
          this.passInformationToService(this.filteredFlats, this.optionsFound);
          setTimeout(() => {
            this.filterService.blockBtn(false)
          }, 500);
        }
        this.loading = false;
      } catch (error) {
        console.log(error)
      }
    }
  }

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    this.filterService.blockBtn(true);
    // this.passInformationToService([], 0);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.searchFilter();
    }, 2000);
  }

  // передача отриманих даних до сервісу а потім виведення на картки карток
  passInformationToService(filteredFlats: any, optionsFound: number) {
    if (filteredFlats && optionsFound) {
      // console.log(filteredFlats)
      this.filterService.updateFilter(filteredFlats, optionsFound);
      this.loading = false;
    } else {
      this.filterService.updateFilter(undefined, 0);
      this.loading = false;
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
      this.onSubmitWithDelay();
    }
  }

  // Шукаю інформацію за обраною областю для виведення картинки та інфи по ній
  checkChownCityData() {
    if (this.userInfo.region) {
      const existingCity = this.cities.find((c: { region: string; }) => c.region === this.userInfo.region);
      if (existingCity) {
        this.chownCity = existingCity;
        console.log(this.chownCity)

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
      this.onSubmitWithDelay()
    }
  }

  // завантаження бази областей
  async onRegionsInputChange(regions: string) {
    this.filteredRegions = this.cityDataService.loadRegionsFromOwnDB(regions);
    this.onSubmitWithDelay()
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

  // Логіка для обробки змін в полі вибору району
  async onDistrictInputChange() {
    if (this.userInfo.city) {
      this.filteredDistricts = [];
      this.filteredDistricts = await this.cityDataService.loadDistrictFromOwnDB(this.userInfo.city);
      this.onSubmitWithDelay()
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
      this.onSubmitWithDelay();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

