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

interface SearchParams {
  country: string;
  region: string;
  city: string;
  rooms_of: number | string;
  rooms_to: number | string;
  repair_status: string;
  area?: number | string;
  selectedBalcony: number | string;
  selectedBunker: number | string;
  animals: number | string;
  distance_metro: string;
  distance_stop: string;
  distance_green: string;
  distance_shop: string;
  distance_parking: string;
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
  search: boolean = false;
  selectedCity!: string;
  rooms_of!: number | any;
  rooms_to!: number | any;
  area_of!: number;
  area_to!: number;
  selectedRegion!: string;
  selectedAnimals!: string;
  selectedDistance_metro!: string;
  selectedDistance_stop!: string;
  selectedDistance_green!: string;
  selectedDistance_shop!: string;
  selectedDistance_parking!: string;
  selectedBunker!: number;
  selectedBalcony!: number;
  selectedRepair_status: any;

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
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
      repair_status: this.selectedRepair_status || '',
      animals: this.selectedAnimals || '',
      distance_metro: this.selectedDistance_metro || '',
      distance_stop: this.selectedDistance_stop || '',
      distance_green: this.selectedDistance_green || '',
      distance_shop: this.selectedDistance_shop || '',
      distance_parking: this.selectedDistance_parking || '',
      country: '',
      students: this.students ? 1 : '',
      woman: this.woman ? 1 : '',
      man: this.man ? 1 : '',
      family: this.family ? 1 : '',
      search: this.search ? 1 : '',
      selectedBalcony: this.selectedBalcony || '',
      selectedBunker: this.selectedBunker || '',
    };
    console.log(params)
  }

  editSearch(): void {
    this.disabled = false;
  }

  clearForm(): void {
    this.selectedAnimals = '';
    this.price_of = 0;
    this.price_to = 0;
    this.students = false;
    this.woman = false;
    this.man = false;
    this.family = false;
    this.search = false;
    this.selectedCity = '';
    this.rooms_of = 0;
    this.rooms_to = 0;
    this.area_of = 0;
    this.area_to = 0;
    this.selectedRegion = '';
    this.selectedAnimals = '';
    this.selectedDistance_metro = '';
    this.selectedDistance_stop = '';
    this.selectedDistance_green = '';
    this.selectedDistance_shop = '';
    this.selectedDistance_parking = '';
    this.selectedBunker = 0;
    this.selectedBalcony = 0;
    this.selectedRepair_status = '';
  }


}
