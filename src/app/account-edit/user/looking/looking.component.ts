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
  region: '',
  city: '',
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  area_of: number | undefined;
  area_to: number | undefined;
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
  option: any;
  lease_term: '',
  purpose_rent: '',
  looking_woman: false,
  looking_man: false,
  agree_search: false,
  students: false,
  woman: false,
  man: false,
  family: false,
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
    distance_metro: '',
    distance_stop: '',
    distance_green: '',
    distance_shop: '',
    distance_parking: '',
    optionPay: '',
    option: '',
    lease_term: '',
    purpose_rent: '',
    looking_woman: false,
    looking_man: false,
    agree_search: false,
    students: false,
    woman: false,
    man: false,
    family: false,
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
        distance_metro: '',
        distance_stop: '',
        distance_green: '',
        distance_shop: '',
        distance_parking: '',
        optionPay: '',
        option: '',
        lease_term: '',
        purpose_rent: '',
        looking_woman: false,
        looking_man: false,
        agree_search: false,
        students: false,
        woman: false,
        man: false,
        family: false,
      };
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
}
