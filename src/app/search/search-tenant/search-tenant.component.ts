import { regions } from '../../shared/data-city';
import { cities } from '../../shared/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FilterUserService } from '../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { PageEvent } from '@angular/material/paginator';
import { serverPath } from 'src/app/shared/server-config';

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
  students: number | undefined;
  woman: number | undefined;
  man: number | undefined;
  family: number | undefined;
  days: number | undefined;
  weeks: number | undefined;
  months: number | undefined;
  years: number | undefined;
  day_counts: string | undefined;
  room: boolean | undefined;
  house: number | undefined;
  flat: number | undefined;
  limit: number;

  kitchen_area: number | undefined;
}
@Component({
  selector: 'app-search-tenant',
  templateUrl: './search-tenant.component.html',
  styleUrls: ['./search-tenant.component.scss'],
})

export class SearchTenantComponent implements OnInit {

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
    price: undefined,
    region: '',
    city: '',
    rooms: undefined,
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
    students: 1,
    woman: 1,
    man: 1,
    family: 1,
    days: undefined,
    weeks: undefined,
    months: undefined,
    years: undefined,
    day_counts: undefined,
    house: undefined,
    flat: undefined,
    limit: 0,
    kitchen_area: undefined,
  };

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
  filteredUsers!: [any];
  searchTimer: any;
  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  filteredFlats?: any;
  selectedFlatId!: string | null;
  houseData: any;
  filter_group: number = 1;
  openUser: boolean = false;

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

  constructor(
    private filterUserService: FilterUserService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService) { }

  async ngOnInit(): Promise<void> {
    this.getSelectedFlatId();
  }

  clearFilter() {
    this.userInfo.room = undefined;
    this.userInfo.price = undefined;
    this.userInfo.region = undefined;
    this.userInfo.city = undefined;
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
    this.userInfo.option_pay = 0;
    this.userInfo.purpose_rent = '';
    this.userInfo.looking_woman = undefined;
    this.userInfo.looking_man = undefined;
    this.userInfo.students = 1;
    this.userInfo.woman = 1;
    this.userInfo.man = 1;
    this.userInfo.family = 1;
    this.userInfo.days = undefined;
    this.userInfo.weeks = undefined;
    this.userInfo.months = undefined;
    this.userInfo.years = undefined;
    this.userInfo.day_counts = undefined;
    this.userInfo.house = undefined;
    this.userInfo.flat = undefined;
    this.userInfo.kitchen_area = undefined;
    this.searchFilter()

  }

  async loadDataFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        console.log(parsedHouseData)
        this.userInfo.region = parsedHouseData.flat.region;
        this.userInfo.city = parsedHouseData.flat.city;
        this.userInfo.rooms = parsedHouseData.param.rooms;
        this.userInfo.repair_status = parsedHouseData.param.repair_status || 'Неважливо';
        this.userInfo.area = parsedHouseData.param.area;
        this.userInfo.kitchen_area = parsedHouseData.param.kitchen_area;
        this.userInfo.balcony = parsedHouseData.param.balcony || 'Неважливо';
        // this.userInfo.floor = parsedHouseData.param.floor;
        this.userInfo.distance_metro = parsedHouseData.flat.distance_metro.toString();
        this.userInfo.distance_stop = parsedHouseData.flat.distance_stop.toString();
        this.userInfo.distance_shop = parsedHouseData.flat.distance_shop.toString();
        this.userInfo.distance_green = parsedHouseData.flat.distance_green.toString();
        this.userInfo.distance_parking = parsedHouseData.flat.distance_parking.toString();
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
        this.searchFilter()
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
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
      console.log(this.userInfo)
      this.http.post(serverPath + '/search/user', { auth: JSON.parse(userJson), ...this.userInfo, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response)
          if (Array.isArray(response.user_inf) && response.user_inf.length > 0) {
            this.filteredUsers = response.user_inf;
            this.optionsFound = response.search_count;
            this.passInformationToService(this.filteredUsers, this.optionsFound);
            this.loading = false;
          } else {
            this.filteredUsers = [null];
            this.optionsFound = 0;
            this.passInformationToService(this.filteredUsers, this.optionsFound);
            this.loading = false;
          }
        }, (error: any) => {
          console.error(error);
          this.loading = false;

        });
    } else {
      this.passInformationToService(this.filteredUsers, this.optionsFound)
      console.log('user not found');
      this.loading = false;
    }
  }

  // пошук юзера по ID
  searchByUserID(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const userJson = localStorage.getItem('user');
      const userId = this.searchQuery;

      if (userJson && this.searchQuery) {
        this.http.post(serverPath + '/search/user', { auth: JSON.parse(userJson), user_id: userId, flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            this.filteredUsers = response.user_inf;
            console.log(this.filteredUsers)
            this.filterUserService.updateFilter(this.filteredUsers, this.optionsFound);
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
  passInformationToService(filteredFlats: any, optionsFound: number) {
    this.filterUserService.updateFilter(filteredFlats, optionsFound);
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

