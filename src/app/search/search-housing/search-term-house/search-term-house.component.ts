import { FilterService } from '../../filter.service';
import { regions } from '../../../data/data-city';
import { cities } from '../../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

interface UserInfo {
  price_of: string | undefined;
  price_to: string | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms_of: string | undefined;
  rooms_to: string | undefined;
  area_of: string;
  area_to: string;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: string | undefined;
  distance_stop: string | undefined;
  distance_green: string | undefined;
  distance_shop: string | undefined;
  distance_parking: string | undefined;
  option_pay: string | undefined;
  purpose_rent: string | undefined;
  looking_woman: string | undefined;
  looking_man: string | undefined;
  students: string | undefined;
  woman: string | undefined;
  man: string | undefined;
  family: string | undefined;
  days: number | undefined;
  weeks: number | undefined;
  months: number | undefined;
  years: number | undefined;
  day_counts: string | undefined;
  room: string | undefined;
  house: number | undefined;
  flat: number | undefined;
  limit: number;
  option_flat: string | undefined;
  country: string | undefined;
  kitchen_area: string | undefined;
  filterData: string | undefined;
}

interface SearchParams {
  [key: string]: any;
}
@Component({
  selector: 'app-search-term-house',
  templateUrl: './search-term-house.component.html',
  styleUrls: ['../../search.term.scss'],
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
  ],
})

export class SearchTermHouseComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  limit: number = 0;
  offs: number = 0;

  pageEvent: PageEvent = {
    length: 0,
    pageSize: 20,
    pageIndex: 0
  };

  userInfo: UserInfo = {
    country: '',
    price_of: '',
    price_to: '',
    region: '',
    city: '',
    rooms_of: '',
    rooms_to: '',
    area_of: '',
    area_to: '',
    repair_status: '',
    animals: '',
    distance_metro: '',
    distance_stop: '',
    distance_green: '',
    distance_shop: '',
    distance_parking: '',
    students: '',
    woman: '',
    man: '',
    family: '',
    balcony: '',
    bunker: '',
    option_flat: '2',
    room: '',
    looking_woman: '',
    looking_man: '',
    option_pay: '0',
    kitchen_area: '',
    purpose_rent: undefined,
    days: undefined,
    weeks: undefined,
    months: undefined,
    years: undefined,
    day_counts: undefined,
    house: undefined,
    flat: undefined,
    limit: 0,
    filterData: '',
  };

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;

  regions = regions;
  cities = cities;

  isSearchTermCollapsed: boolean = false;
  filteredFlats: any[] = [];
  minValue: number = 0;
  maxValue: number = 100000;
  searchQuery: any;
  searchTimer: any;
  // загальна кількість знайдених осель
  optionsFound: number = 0
  loading = true;
  filter_group: number = 1;
  openUser: boolean = false;

  userInfoSearch: any;

  card_info: number = 0;
  indexPage: number = 1;
  shownCard: string | undefined;
  myData: boolean = false;
  startX = 0;
  sortMenu: boolean = false;
  searchInfoUserData: boolean = false;
  myDataExist: boolean = false;
  addСardsToArray: boolean = false;
  subscriptions: any[] = [];

  filterSwitchNext() {
    if (this.filter_group < 3) {
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

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.getServerPath();
    this.searchFilter();
    this.getSortValue();
    this.getLoadCards();
    const searchInfoUserData = localStorage.getItem('searchInfoUserData');
    if (searchInfoUserData !== null) {
      this.myDataExist = true;
    } else {
      this.myDataExist = false;
    }
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  getSortValue() {
    // console.log('getSortValue')
    this.filterService.sortValue$.subscribe(sortValue => {
      if (sortValue !== '') {
        this.limit = 0;
        this.filteredFlats = [];
        this.userInfo.filterData = sortValue;
        this.onSubmitWithDelay()
      }
    });
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
        this.router.navigate(['/user/info']);
      }
    } else {
      if (this.filter_group <= 2 && this.indexPage === 1) {
        this.filter_group++;
      }
    }
  }

  loadDataUserSearch() {
    this.myData = true;
    const searchInfoUserData = localStorage.getItem('searchInfoUserData');
    if (searchInfoUserData !== null) {
      this.myDataExist = true;
      this.userInfoSearch = JSON.parse(searchInfoUserData);
      this.userInfo.region = this.userInfoSearch.region;
      this.userInfo.city = this.userInfoSearch.city;

      this.userInfo.area_of = this.userInfoSearch.area_of === '0.00' ? '' : this.userInfoSearch.area_of;
      this.userInfo.area_to = this.userInfoSearch.area_to === '100000.00' ? '' : this.userInfoSearch.area_to;

      this.userInfo.option_pay = this.userInfoSearch.option_pay.toString();
      this.userInfo.price_of = this.userInfoSearch.price_of;
      this.userInfo.price_to = this.userInfoSearch.price_to;

      this.userInfo.rooms_of = this.userInfoSearch.rooms_of === 0 ? '' : this.userInfoSearch.rooms_of;
      this.userInfo.rooms_to = this.userInfoSearch.rooms_to === 6 ? '' : this.userInfoSearch.rooms_to;

      this.userInfo.animals = this.userInfoSearch.animals === 'Неважливо' ? '' : this.userInfoSearch.animals;
      this.userInfo.repair_status = this.userInfoSearch.repair_status === 'Неважливо' ? '' : this.userInfoSearch.repair_status;
      this.userInfo.balcony = this.userInfoSearch.balcony === 'Неважливо' ? '' : this.userInfoSearch.balcony;
      this.userInfo.bunker = this.userInfoSearch.bunker === 'Неважливо' ? '' : this.userInfoSearch.bunker;

      this.userInfo.distance_metro = this.userInfoSearch.distance_metro === 0 ? '' : this.userInfoSearch.distance_stop;
      this.userInfo.distance_stop = this.userInfoSearch.distance_stop === 0 ? '' : this.userInfoSearch.distance_stop;
      this.userInfo.distance_green = this.userInfoSearch.distance_green === 0 ? '' : this.userInfoSearch.distance_green;
      this.userInfo.distance_shop = this.userInfoSearch.distance_shop === 0 ? '' : this.userInfoSearch.distance_shop;
      this.userInfo.distance_parking = this.userInfoSearch.distance_parking === 0 ? '' : this.userInfoSearch.distance_parking;

      this.userInfo.students = this.userInfoSearch.students;
      this.userInfo.woman = this.userInfoSearch.woman;
      this.userInfo.man = this.userInfoSearch.man;
      this.userInfo.family = this.userInfoSearch.family;

      this.userInfo.option_flat = this.userInfoSearch.house === 1 ? '1' : (this.userInfoSearch.flat === 1 ? '2' : '');
      this.userInfo.room = this.userInfoSearch.room;
      this.userInfo.looking_woman = this.userInfoSearch.looking_woman;
      this.userInfo.looking_man = this.userInfoSearch.looking_man;

      this.onSubmitWithDelay();

    } else {
      this.myDataExist = false;
    }
  }

  clearFilter() {
    this.myData = false;
    this.indexPage = 0;
    this.loading = true;
    setTimeout(() => {
      this.indexPage = 1;
      this.loading = false;
    }, 500);
    this.searchQuery = '';
    this.userInfo = {
      country: '',
      price_of: '',
      price_to: '',
      region: '',
      city: '',
      rooms_of: '',
      rooms_to: '',
      area_of: '',
      area_to: '',
      repair_status: '',
      animals: '',
      distance_metro: '',
      distance_stop: '',
      distance_green: '',
      distance_shop: '',
      distance_parking: '',
      students: '',
      woman: '',
      man: '',
      family: '',
      balcony: '',
      bunker: '',
      option_flat: '2',
      room: '',
      looking_woman: '',
      looking_man: '',
      option_pay: '0',
      kitchen_area: '',
      purpose_rent: '',
      days: undefined,
      weeks: undefined,
      months: undefined,
      years: undefined,
      day_counts: undefined,
      house: undefined,
      flat: undefined,
      limit: 0,
      filterData: '',
    };
    this.onSubmitWithDelay();
  }

  // завантаження бази міст
  loadCities() {
    if (this.userInfo.region || this.userInfo.region === '') {
      const searchTerm = this.userInfo.region.toLowerCase();
      this.filteredRegions = this.regions.filter(region =>
        region.name.toLowerCase().includes(searchTerm)
      );
      const selectedRegionObj = this.filteredRegions.find(region =>
        region.name === this.userInfo.region
      );
      this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
      this.userInfo.city = '';
    }
  }

  // завантаження бази областей
  loadRegion() {
    if (this.userInfo.city) {
      const searchTerm = this.userInfo.city.toLowerCase();
      const selectedRegionObj = this.regions.find(region =>
        region.name === this.userInfo.region
      );
      this.filteredCities = selectedRegionObj ? selectedRegionObj.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm)) : [];
      const selectedCityObj = this.filteredCities.find(city =>
        city.name === this.userInfo.city
      );
    }
  }

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    this.filterService.blockBtn(true);
    this.passInformationToService([], 0);
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.searchFilter();
    }, 2000);
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
      this.searchFilter();
      return;
    }
  }

  // збір пошукових параметрів
  async searchFilter() {
    const params: UserInfo = {
      price_of: this.userInfo.price_of || '',
      price_to: this.userInfo.price_to || '',
      region: this.userInfo.region || '',
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
      country: '',
      students: this.userInfo.students ? '1' : '',
      woman: this.userInfo.woman ? '1' : '',
      man: this.userInfo.man ? '1' : '',
      family: this.userInfo.family ? '1' : '',
      balcony: this.userInfo.balcony || '',
      bunker: this.userInfo.bunker || '',
      option_flat: this.userInfo.option_flat,
      room: this.userInfo.room ? '1' : '0',
      option_pay: this.userInfo.option_pay || '0',
      limit: this.limit,
      looking_woman: this.userInfo.looking_woman ? '1' : '0',
      looking_man: this.userInfo.looking_man ? '1' : '0',
      filterData: this.userInfo.filterData || '',
      purpose_rent: undefined,
      days: undefined,
      weeks: undefined,
      months: undefined,
      years: undefined,
      day_counts: undefined,
      house: undefined,
      flat: undefined
    };
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
          this.calculatePaginatorInfo()
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

  // передача отриманих даних до сервісу а потім виведення на картки карток
  passInformationToService(filteredFlats: any, optionsFound: number) {
    if (filteredFlats && optionsFound) {
      this.filterService.updateFilter(filteredFlats, optionsFound);
      this.loading = false;
    } else {
      this.filterService.updateFilter(undefined, 0);
      this.loading = false;
    }
  }

  // наступна сторінка
  incrementOffset() {
    // console.log('Incrementing offset');
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.optionsFound) {
      this.pageEvent.pageIndex++;
      this.limit = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      // console.log('New limit:', this.limit);
      this.searchFilter();
    } else {
      console.log('No more data to load');
    }
  }

  // попередня сторінка
  decrementOffset() {
    // console.log('попередня сторінка')
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.limit = offs;
    }
    this.searchFilter();
  }

  getLoadCards() {
    this.filterService.loadCards$.subscribe(loadValue => {
      if (loadValue !== '') {
        if (loadValue === 'prev') {
          this.addСardsToArray = true;
          this.decrementOffset();
        } else if (loadValue === 'next') {
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
    // console.log(this.shownCard);
    this.filterService.showedCards(this.shownCard)
    return `показано ${startIndex} - ${endIndex} з ${this.optionsFound} знайдених`;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}


