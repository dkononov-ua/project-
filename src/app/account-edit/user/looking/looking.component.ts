import { Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

interface SearchParams {
  [key: string]: any;
}
@Component({
  selector: 'app-looking',
  templateUrl: './looking.component.html',
  styleUrls: ['./looking.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateY(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation5', [
      transition('void => *', [
        style({ transform: 'translateY(100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ])
  ],
})

export class LookingComponent implements OnInit {

  price_of: number | undefined;
  price_to: number | undefined;
  students: boolean = false;
  woman: boolean = false;
  man: boolean = false;
  family: boolean = false;
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
  distance_metro: string | undefined;
  distance_stop: string | undefined;
  distance_green: string | undefined;
  distance_shop: string | undefined;
  distance_parking: string | undefined;
  optionPay: any;
  option: any;
  looking_woman: boolean = false;
  looking_man: boolean = false;
  lease_term: string | undefined;
  purpose_rent: string | undefined;
  agree_search: boolean = false;

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;
  endpoint = 'http://localhost:3000/search/flat';
  minValue: number = 0;
  maxValue: number = 100000;
  disabled: boolean = true;
  loading: boolean | undefined;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.onSubmit();
  }

  loadCities() {
    this.filteredRegions = this.selectedRegion ? this.regions.filter(region => region.name.toLowerCase().includes(this.selectedRegion.toLowerCase())) : this.regions;
    const selectedRegionObj = this.regions.find(region => region.name === this.selectedRegion);
    this.cities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.selectedCity = '';
    this.filteredCities = this.selectedCity ? this.cities.filter(city => city.name.toLowerCase().includes(this.selectedCity.toLowerCase())) : this.cities;
  }

  onSubmit() {
    this.disabled = true;

    const params: SearchParams = {
      price_of: this.price_of || '',
      price_to: this.price_to || '',
      region: this.selectedRegion || '',
      city: this.selectedCity || '',
      rooms_of: this.rooms_of || '',
      rooms_to: this.rooms_to || '',
      area_of: this.area_of || '',
      area_to: this.area_to || '',
      repair_status: this.repair_status || '',
      animals: this.animals || '',
      distance_metro: this.distance_metro || '',
      distance_stop: this.distance_stop || '',
      distance_green: this.distance_green || '',
      distance_shop: this.distance_shop || '',
      distance_parking: this.distance_parking || '',
      country: '',
      students: this.students ? 1 : '',
      woman: this.woman ? 1 : '',
      man: this.man ? 1 : '',
      family: this.family ? 1 : '',
      agree_search: this.agree_search ? 1 : '',
      balcony: this.balcony || '',
      bunker: this.bunker || '',
      optionPay: this.optionPay || '',
      option: this.option || '',
      looking_woman: this.looking_woman ? 1 : '',
      looking_man: this.looking_man ? 1 : '',
      lease_term: this.lease_term || '',
      purpose_rent: this.purpose_rent || '',
    };
    console.log(params)
  }

  editSearch(): void {
    this.disabled = false;
  }

  clearForm(): void {
    this.animals = '';
    this.price_of = 0;
    this.price_to = 0;
    this.students = false;
    this.woman = false;
    this.man = false;
    this.family = false;
    this.agree_search = false;
    this.selectedCity = '';
    this.rooms_of = 0;
    this.rooms_to = 0;
    this.area_of = 0;
    this.area_to = 0;
    this.region = '';
    this.animals = '';
    this.distance_metro = '';
    this.distance_stop = '';
    this.distance_green = '';
    this.distance_shop = '';
    this.distance_parking = '';
    this.bunker = '';
    this.balcony = '';
    this.repair_status = '';
    this.looking_woman = false;
    this.looking_man = false;
    this.lease_term = '';
    this.purpose_rent = '';
    this.option = false;
    this.optionPay = false;
  }
}
