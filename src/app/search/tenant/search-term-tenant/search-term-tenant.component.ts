  import { Subscription, debounceTime } from 'rxjs';
  import { FormGroup, FormBuilder } from '@angular/forms';
  import { regions } from '../../../shared/data-city';
  import { cities } from '../../../shared/data-city';
  import { HttpClient } from '@angular/common/http';
  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { trigger, transition, style, animate } from '@angular/animations';

  interface UserInfo {
    price_d: number | undefined;
    price_m: number | undefined;
    region: '',
    city: '',
    rooms: number | undefined;
    area: number | undefined;
    repair_status: '',
    bunker: '',
    balcony: '',
    animals: '',
    distance_metro: '',
    distance_stop: '',
    distance_green: '',
    distance_shop: '',
    distance_parking: '',
    optionPay: any;
    purpose_rent: '',
    looking_woman: false,
    looking_man: false,
    agree_search: false,
    students: false,
    woman: false,
    man: false,
    family: false,
    days: number | undefined;
    weeks: number | undefined;
    months: number | undefined;
    years: number | undefined;

    options_flat: number | undefined;
    room: boolean | undefined;

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

    userInfo: UserInfo = {
      options_flat: 0,
      room: false,
      price_d: 0,
      price_m: 0,
      region: '',
      city: '',
      rooms: 0,
      area: 0,
      repair_status: '',
      bunker: '',
      balcony: '',
      animals: '',
      distance_metro: '',
      distance_stop: '',
      distance_green: '',
      distance_shop: '',
      distance_parking: '',
      optionPay: 0,
      purpose_rent: '',
      looking_woman: false,
      looking_man: false,
      agree_search: false,
      students: false,
      woman: false,
      man: false,
      family: false,
      days: 0,
      weeks: 0,
      months: 0,
      years: 0,
    };

    filteredCities: any[] | undefined;
    filteredRegions: any[] | undefined;
    selectedRegion!: string;
    selectedCity!: string;
    regions = regions;
    cities = cities;
    minValue: number = 0;
    maxValue: number = 100000;
    disabled: boolean = true;
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

    isSearchTermCollapsed: boolean = false;

    constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
      this.getInfo();
    }

    async getInfo(): Promise<any> {
      const userJson = localStorage.getItem('user');
      if (userJson !== null) {
        this.http.post('http://localhost:3000/', JSON.parse(userJson))
          .subscribe((response: any) => {
            console.log(response)
            this.userInfo = response;
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('user not found');
      }
    }

    saveInfo(): void {
      const userJson = localStorage.getItem('user');
      if (userJson && this.disabled === false) {
        const data = { ...this.userInfo };
        console.log(data);
        this.http.post('http://localhost:3000/flatinfo/add/parametrs', { auth: JSON.parse(userJson), new: data })
          .subscribe((response: any) => {
            console.log(response);
          }, (error: any) => {
            console.error(error);
          });
        this.disabled = true;

      } else {
        console.log('user not found, the form is blocked');
      }
    }

    editInfo(): void {
      this.disabled = false;
    }

    loadCities() {
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

    loadDistricts() {
      const searchTerm = this.userInfo.city.toLowerCase();
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

    startTimer() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.searchQuery && this.searchQuery.length >= 3) {
          this.getInfo();
        }
      }, 2000);
    }

    toggleSearchTerm() {
      this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
    }
  }
