import { FilterService } from '../filter.service';
import { regions } from '../../data/data-city';
import { cities } from '../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { serverPath } from 'src/app/config/server-config';
import { animations } from '../../interface/animation';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';

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
  ],
})

export class SearchHousingComponent implements OnInit {

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
  optionsFound: number = 0
  loading = true;
  filter_group: number = 1;
  openUser: boolean = false;

  userInfoSearch: any;

  card_info: number = 0;
  indexPage: number = 0;
  shownCard: string | undefined;
  myData: boolean = false;
  startX = 0;
  sortMenu: boolean = false;
  searchInfoUserData: boolean = false;
  filterValue: string = '';

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

  goBack(): void {
    this.location.back();
  }

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private location: Location,

  ) { }

  ngOnInit() {
    // перевірка який пристрій
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.getSearchInfo();
    this.getShowedCards();
  }

  async getSearchInfo() {
    // const userJson = localStorage.getItem('user');
    // if (userJson) {
    this.filterService.filterChange$.subscribe(async () => {
      const optionsFound = this.filterService.getOptionsFound();
      if (optionsFound && optionsFound !== 0) {
        this.optionsFound = optionsFound;
      } else {
        this.optionsFound = 0;
      }
    })
    // } else {
    //   console.log('Авторизуйтесь')
    // }
  }

  getShowedCards() {
    this.filterService.showedCards$.subscribe(showedCards => {
      if (showedCards !== '') {
        this.shownCard = showedCards;
      }
    });
  }

  onSortSelected(value: string) {
    this.filterValue = value;
    this.router.navigate(['/search-house/all-cards']);
    this.filterService.sortHouse(value)
  }

}

