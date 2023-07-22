import { Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

interface UserInfo {
  price_of: number | undefined;
  price_to: number | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  area_of: number | undefined;
  area_to: number | undefined;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: number | undefined;
  distance_stop: number | undefined;
  distance_green: number | undefined;
  distance_shop: number | undefined;
  distance_parking: number | undefined;
  optionPay: number | undefined;
  lease_term: string | undefined;
  purpose_rent: string | undefined;
  house: boolean | undefined;
  flat: boolean | undefined;
  room: boolean | undefined;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
  agree_search: boolean | undefined;
  students: boolean | undefined;
  woman: boolean | undefined;
  man: boolean | undefined;
  family: boolean | undefined;
  days: number | undefined;
  weeks: number | undefined;
  months: number | undefined;
  years: number | undefined;
}
@Component({
  selector: 'app-looking',
  templateUrl: './looking.component.html',
  styleUrls: ['./looking.component.scss'],
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

export class LookingComponent implements OnInit {

  userInfo: UserInfo = {
    price_of: 0,
    price_to: 0,
    region: '',
    city: '',
    rooms_of: 0,
    rooms_to: 0,
    area_of: 0,
    area_to: 0,
    repair_status: '',
    bunker: '',
    balcony: '',
    animals: '',
    distance_metro: 0,
    distance_stop: 0,
    distance_green: 0,
    distance_shop: 0,
    distance_parking: 0,
    optionPay: 0,
    house: false,
    flat: false,
    room: false,
    lease_term: '',
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

  minValueDays: number = 0;
  maxValueDays: number = 31;

  minValueWeeks: number = 0;
  maxValueWeeks: number = 4;

  minValueMonths: number = 0;
  maxValueMonths: number = 11;

  minValueYears: number = 0;
  maxValueYears: number = 3;

  disabled: boolean = true;
  loading: boolean | undefined;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/features/get', {auth: JSON.parse(userJson)})
        .subscribe((response: any) => {
          console.log(response)
          this.userInfo = response.inf;
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
      this.http.post('http://localhost:3000/features/add', { auth: JSON.parse(userJson), new: data })
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

  clearInfo(): void {
    if (this.disabled === false)
      this.userInfo = {
        price_of: 0,
        price_to: 0,
        region: '',
        city: '',
        rooms_of: 0,
        rooms_to: 0,
        area_of: 0,
        area_to: 0,
        repair_status: '',
        bunker: '',
        balcony: '',
        animals: '',
        distance_metro: 0,
        distance_stop: 0,
        distance_green: 0,
        distance_shop: 0,
        distance_parking: 0,
        optionPay: 0,
        house: false,
        flat: false,
        room: false,
        lease_term: '',
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
  }

  loadCities() {
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase()
    );
    const selectedRegionObj = this.filteredRegions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.userInfo.city = '';
  }

  loadDistricts() {
    const selectedRegionObj = this.regions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj
      ? selectedRegionObj.cities.filter(city =>
        city.name.toLowerCase()
      )
      : [];

    const selectedCityObj = this.filteredCities.find(city =>
      city.name === this.userInfo.city
    );
  }
}
