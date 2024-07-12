import { FilterService } from '../filter.service';
import { regions } from '../../data/data-city';
import { cities } from '../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';
import { ChoseSubscribeService } from 'src/app/services/chose-subscribe.service';

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
  selector: 'app-search-housing',
  templateUrl: './search-housing.component.html',
  styleUrls: ['../search.term.scss'],
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
    animations.appearance,
  ],
})

export class SearchHousingComponent implements OnInit {

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
    pageSize: 5,
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
  filteredFlats?: any;
  minValue: number = 0;
  maxValue: number = 100000;
  searchQuery: any;
  searchTimer: any;
  // загальна кількість знайдених осель
  counterFound: number = 0
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
  filterValue: string = '';
  authorization: boolean = false;

  toggleSortMenu() {
    this.sortMenu = !this.sortMenu;
  }

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

  isMobile = false;
  counterUserSubscriptions: any;

  goBack(): void {
    this.location.back();
  }
  subscriptions: any[] = [];
  blockBtnStatus: boolean = false;

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private counterService: CounterService,
    private sharedService: SharedService,
    private choseSubscribeService: ChoseSubscribeService,

  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    await this.getSearchInfo();
    this.getShowedCards();
    await this.getIndexPage();
    await this.getLoadResult();
  }

  // перевірка девайсу
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

  // показую маленький лоадер на кількість знайдених варіантів
  async getLoadResult() {
    this.subscriptions.push(
      this.filterService.blockBtnStatus$.subscribe(async (status: boolean) => {
        this.blockBtnStatus = status;
        setTimeout(() => {
          if (this.blockBtnStatus) {
            this.blockBtnStatus = !this.blockBtnStatus;
          }
        }, 3000);
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getUserSubscriptionsCount()
      await this.counterService.getUserSubscriptionsCount();
    } else {
      this.authorization = false;
    }
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        const counterUserSubscriptions: any = data;
        if (counterUserSubscriptions.status === 'Немає доступу') {
          this.counterUserSubscriptions = null;
        } else {
          this.counterUserSubscriptions = counterUserSubscriptions;
        }
      })
    );
  }

  // підписка на кількість знайдених осель
  async getSearchInfo() {
    this.subscriptions.push(
      this.filterService.filterChange$.subscribe(async () => {
        const counterFound = this.filterService.getOptionsFound();
        if (counterFound && counterFound !== 0) {
          this.counterFound = counterFound;
        } else {
          this.counterFound = 0;
        }
      })
    );
  }

  getShowedCards() {
    this.filterService.showedCards$.subscribe(showedCards => {
      // console.log(showedCards)
      if (showedCards !== '') {
        this.shownCard = showedCards;
      }
    });
  }

  onSortSelected(value: string) {
    this.filterValue = value;
    this.filterService.sortHouse(value)
  }

  // Відкриваю сторінку профілю
  async getIndexPage() {
    this.subscriptions.push(
      this.choseSubscribeService.indexPage$.subscribe(indexPage => {
        this.indexPage = indexPage;
      })
    )
  }

}

