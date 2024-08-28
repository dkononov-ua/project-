import { regions } from '../../../../data/data-city';
import { cities } from '../../../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterUserService } from '../../../../services/search/filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';
import { UsereSearchConfig } from '../../../../interface/param-config'
import { UserInfoSearch } from '../../../../interface/info'
import { animations } from '../../../../interface/animation';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { CityDataService } from 'src/app/services/data/cityData.service';
@Component({
  selector: 'app-search-term-tenants',
  templateUrl: './search-term-tenants.component.html',
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
    animations.top3,
    animations.top1,
  ],
})

export class SearchTermTenantsComponent implements OnInit, OnDestroy {

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
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;

  userInfo: UserInfoSearch = UsereSearchConfig;

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;
  minValue: number = 0;
  maxValue: number = 100000;
  loading = true;
  timer: any;
  searchQuery: string | undefined;
  minValueDays: number = 0;
  maxValueDays: number = 31;
  minValueWeeks: number = 0;
  maxValueWeeks: number = 4;
  minValueMonths: number = 0;
  maxValueMonths: number = 11;
  minValueYears: number = 0;
  maxValueYears: number = 5;
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

  calculateTotalDays(): number {
    const days = this.userInfo.days || 0;
    const weeks = this.userInfo.weeks || 0;
    const months = this.userInfo.months || 0;
    const years = this.userInfo.years || 0;
    const totalDays = days + weeks * 7 + months * 30 + years * 365;
    return totalDays;
  }

  saveDayCounts(): void {
    const totalDays = this.calculateTotalDays();
    this.userInfo.day_counts = totalDays > 0 ? totalDays.toString() : '';
  }

  onDayCountsChange(): void {
    this.saveDayCounts();
  }

  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }
  isMobile = false;
  filterValue: string = '';
  subscriptions: any[] = [];

  constructor(
    private filterUserService: FilterUserService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private cityDataService: CityDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkAuthorization();
    this.getSelectedFlat();
    this.getLoadCards();
  }

  // перевірію чи авторизований я і чи є в мене дані про оселю
  checkAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        this.myDataExist = true;
      } else {
        this.myDataExist = true;
      }
    } else {
      this.myDataExist = true;
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

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId;
        if (!this.selectedFlatId) {
          this.selectedFlatId = '1';
          this.searchFilter();
        } else {
          this.searchFilter();
        }
      })
    );
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
    if (direction === 'right' && this.indexPage === 1) {
      if (this.filter_group !== 1) {
        this.filter_group--;
      } else {
        this.router.navigate(['/house/house-info']);
      }
    } else {
      if (this.filter_group <= 3 && this.indexPage === 1) {
        this.filter_group++;
      }
    }
  }

  clearFilter() {
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
    this.userInfo.area = undefined;
    this.userInfo.repair_status = '';
    this.userInfo.bunker = '';
    this.userInfo.balcony = '';
    this.userInfo.animals = '';
    this.userInfo.distance_metro = '';
    this.userInfo.distance_stop = '';
    this.userInfo.distance_green = '';
    this.userInfo.distance_shop = '';
    this.userInfo.distance_parking = '';
    this.userInfo.option_pay = undefined;
    this.userInfo.purpose_rent = '';
    this.userInfo.looking_woman = false;
    this.userInfo.looking_man = false;
    this.userInfo.students = undefined;
    this.userInfo.limit = 0;
    this.userInfo.woman = undefined;
    this.userInfo.man = undefined;
    this.userInfo.family = undefined;
    this.userInfo.days = undefined;
    this.userInfo.weeks = undefined;
    this.userInfo.months = undefined;
    this.userInfo.years = undefined;
    this.userInfo.day_counts = undefined;
    this.userInfo.house = undefined;
    this.userInfo.flat = undefined;
    this.userInfo.kitchen_area = undefined;
    this.userInfo.room = undefined;
    this.userInfo.city = '';
    this.userInfo.region = '';
    this.userInfo.district = '';
    this.userInfo.street = '';
    this.userInfo.micro_district = '';

    this.onSubmitWithDelay();
  }

  async loadDataFlat(): Promise<void> {
    this.myData = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.userInfo.region = parsedHouseData.flat.region;
        this.userInfo.city = parsedHouseData.flat.city;
        this.userInfo.rooms = parsedHouseData.param.rooms;
        this.userInfo.repair_status = parsedHouseData.param.repair_status || 'Неважливо';
        this.userInfo.area = parsedHouseData.param.area;
        this.userInfo.kitchen_area = parsedHouseData.param.kitchen_area;
        this.userInfo.balcony = parsedHouseData.param.balcony || 'Неважливо';
        // this.userInfo.floor = parsedHouseData.param.floor;
        this.userInfo.distance_metro = parsedHouseData.flat.distance_metro;
        this.userInfo.distance_stop = parsedHouseData.flat.distance_stop;
        this.userInfo.distance_shop = parsedHouseData.flat.distance_shop;
        this.userInfo.distance_green = parsedHouseData.flat.distance_green;
        this.userInfo.distance_parking = parsedHouseData.flat.distance_parking;
        this.userInfo.woman = parsedHouseData.about.woman;
        this.userInfo.man = parsedHouseData.about.man;
        this.userInfo.family = parsedHouseData.about.family;
        this.userInfo.students = parsedHouseData.about.students;
        this.userInfo.option_pay = parsedHouseData.about.option_pay;
        this.userInfo.room = parsedHouseData.about.room;
        this.userInfo.animals = parsedHouseData.about.animals || 'Неважливо';
        this.userInfo.price = parsedHouseData.about.price_m ? parsedHouseData.about.price_m : parsedHouseData.about.price_d;
        this.userInfo.bunker = parsedHouseData.about.bunker || 'Неважливо';
        if (parsedHouseData.param.option_flat === 1) {
          this.userInfo.house = 1;
          this.userInfo.flat = 0;
        } else if (parsedHouseData.param.option_flat === 2) {
          this.userInfo.house = 0;
          this.userInfo.flat = 1;
        }
        this.onSubmitWithDelay();
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  // пошук
  async searchFilter(): Promise<void> {
    try {
      const response: any = await this.http.post(this.serverPath + '/search/user', { ...this.userInfo, flat_id: this.selectedFlatId }).toPromise();
      // console.log(response.user_inf)
      // console.log(this.filteredUsers)
      if (Array.isArray(response.user_inf) && response.user_inf.length > 0 && !this.addСardsToArray) {
        // console.log('Запит на нові оголошення')
        this.filteredUsers = response.user_inf;
        this.optionsFound = response.search_count;
        this.passInformationToService(this.filteredUsers, this.optionsFound);
      } else if (Array.isArray(response.user_inf) && response.user_inf.length > 0 && this.addСardsToArray) {
        // console.log('Додавання нових оголошень до попередніх')
        // this.filteredUsers.push(...response.user_inf);
        this.filteredUsers = response.user_inf;
        this.optionsFound = response.search_count;
        this.passInformationToService(this.filteredUsers, this.optionsFound);
      } else {
        this.filteredUsers = [];
        this.optionsFound = 0;
        this.passInformationToService(this.filteredUsers, this.optionsFound);
      }
    } catch (error) {
      console.error(error);
      this.sharedService.setStatusMessage('Помилка пошуку');
      setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
    }
  }

  // пошук юзера по ID
  searchByUserID(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const userJson = localStorage.getItem('user');
      const userId = this.searchQuery;
      if (userJson && this.searchQuery) {
        this.http.post(this.serverPath + '/search/user', { auth: JSON.parse(userJson), user_id: userId, flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            this.filteredUsers = response.user_inf;
            this.optionsFound = response.search_count;
            this.filterUserService.updateFilter(this.filteredUsers, this.optionsFound);
            if (response.search_count === 1) {
              this.indexPage = 2;
            }
          }, (error: any) => {
            console.error(error);
          });
      } else {
        this.searchFilter();
        console.log('user not found');
      }
    }, 1000);
  }

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    this.filterUserService.blockBtn(true);
    this.passInformationToService([], 0);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.searchFilter();
    }, 2000);
  }

  // передача отриманих даних до сервісу а потім виведення на картки карток
  passInformationToService(filteredFlats: any, optionsFound: number) {
    this.calculatePaginatorInfo()
    this.filterUserService.updateFilter(filteredFlats, optionsFound);
  }

  // наступна сторінка
  incrementOffset() {
    // console.log('Incrementing offset');
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.optionsFound) {
      this.pageEvent.pageIndex++;
      this.userInfo.limit = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      // console.log('Передаю на сервер збільшений ліміт', this.userInfo.limit);
      this.searchFilter();
    } else {
      // console.log('Нових оголошень немає');
      // this.sharedService.setStatusMessage('Більше оголошень немає...');
      // setTimeout(() => {
      //   this.sharedService.setStatusMessage('');
      // }, 1500);
    }
  }

  // попередня сторінка
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.userInfo.limit = offs;
    }
    this.searchFilter();
  }

  getLoadCards() {
    this.filterUserService.loadCards$.subscribe(loadValue => {
      if (loadValue !== '') {
        if (loadValue === 'prev') {
          // this.addСardsToArray = true;
          // this.decrementOffset();
        } else if (loadValue === 'next') {
          // console.log('Знаходжусь внузу контейнера')
          this.addСardsToArray = true;
          this.incrementOffset();
        }
      }
    });
  }

  calculatePaginatorInfo(): string {
    const startIndex = (this.pageEvent.pageIndex * this.pageEvent.pageSize) + 1;
    const endIndex = Math.min((this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize, this.optionsFound);
    this.shownCard = `${startIndex} - ${endIndex}`;
    this.filterUserService.showedCards(this.shownCard)
    return `показано ${startIndex} - ${endIndex} з ${this.optionsFound} знайдених`;
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
      this.onSubmitWithDelay()
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

