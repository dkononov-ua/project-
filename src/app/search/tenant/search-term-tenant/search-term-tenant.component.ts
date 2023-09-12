import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FilterUserService } from '../../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { PageEvent } from '@angular/material/paginator';
interface UserInfo {
  price: number | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms: number | undefined;
  area: string | undefined;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: string | undefined;
  distance_stop: string | undefined;
  distance_green: string | undefined;
  distance_shop: string | undefined;
  distance_parking: string | undefined;
  option_pay: any;
  purpose_rent: string | undefined;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
  students: boolean | undefined;
  woman: boolean | undefined;
  man: boolean | undefined;
  family: boolean | undefined;
  days: number | undefined;
  weeks: number | undefined;
  months: number | undefined;
  years: number | undefined;
  day_counts: string | undefined;
  room: boolean | undefined;
  house: number | undefined;
  flat: number | undefined;
  limit: number;
}
@Component({
  selector: 'app-search-term-tenant',
  templateUrl: './search-term-tenant.component.html',
  styleUrls: ['./search-term-tenant.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class SearchTermTenantComponent implements OnInit {

  limit: number = 0;
  offs: number = 0;
  // загальна кількість знайдених осель
  optionsFound: number = 0

  pageEvent: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  };

  userInfo: UserInfo = {
    room: undefined,
    price: 0,
    region: '',
    city: '',
    rooms: 0,
    area: '',
    repair_status: '',
    bunker: '',
    balcony: '',
    animals: '',
    distance_metro: '',
    distance_stop: '',
    distance_green: '',
    distance_shop: '',
    distance_parking: '',
    option_pay: 0,
    purpose_rent: '',
    looking_woman: undefined,
    looking_man: undefined,
    students: true,
    woman: true,
    man: true,
    family: true,
    days: 0,
    weeks: 0,
    months: 0,
    years: 0,
    day_counts: '',
    house: 0,
    flat: 0,
    limit: 0,
  };

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;
  minValue: number = 0;
  maxValue: number = 100000;

  loading: boolean | undefined;
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
  isSearchTermCollapsed: boolean = true;
  filteredUsers!: [any];
  searchTimer: any;
  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  filteredFlats?: any;
  selectedFlatId!: string | null;

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

  constructor(
    private filterUserService: FilterUserService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.getSelectedFlatId();
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.searchFilter();
      }
    });
  }

  // пошук
  searchFilter(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/search/user', { auth: JSON.parse(userJson), ...this.userInfo, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response)
          this.filteredUsers = response.user_inf;
          this.optionsFound = response.search_count;
          this.passInformationToService(this.filteredUsers)
        }, (error: any) => {
          console.error(error);
        });
    } else {
      this.passInformationToService(this.filteredUsers)
      console.log('user not found');
    }
  }

  // пошук юзера по ID
  searchByUserID(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const userJson = localStorage.getItem('user');
      const userId = this.searchQuery;

      if (userJson && this.searchQuery) {
        this.http.post('http://localhost:3000/search/user', { auth: JSON.parse(userJson), user_id: userId, flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            console.log(response)
            this.filteredUsers = response.user_inf;
            this.filterUserService.updateFilter(this.filteredUsers);
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
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.searchFilter();
    }, 2000);
  }

  // передача отриманих даних до сервісу а потім виведення на картки карток
  passInformationToService(filteredUsers: any) {
    this.filterUserService.updateFilter(filteredUsers);
  }

  // завантаження бази міст
  loadCities() {
    const searchTerm = this.userInfo.region!.toLowerCase();
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );
    const selectedRegionObj = this.filteredRegions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.userInfo.city = '';
  }

  // завантаження бази областей
  loadRegions() {
    const searchTerm = this.userInfo.city!.toLowerCase();
    const selectedRegionObj = this.regions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj
      ? selectedRegionObj.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm)
      )
      : [];

    const selectedCityObj = this.filteredCities.find(city =>
      city.name === this.userInfo.city
    );
  }

  // наступна сторінка
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.optionsFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.userInfo.limit = offs;
    }
    this.searchFilter();
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
}
