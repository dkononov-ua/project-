import { Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterService } from '../../filter.service';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SearchParams {
  [key: string]: any;
}

@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss'],
})

export class SearchTermComponent implements OnInit {
  public showInput = false;
  public userId: string | undefined;

  price_of!: number;
  price_to!: number;
  region!: string;
  city!: string;
  rooms_of!: number;
  rooms_to!: number;
  area_of!: number;
  area_to!: number;
  repair_status!: string;
  animals!: string;
  distance_metro!: number;
  distance_stop!: number;
  distance_green!: number;
  distance_shop!: number;
  distance_parking!: number;
  students: number = 0;
  woman: number = 0;
  man: number = 0;
  family: number = 0;
  balcony!: string;
  bunker!: string;
  option_flat: number = 2;
  room: number = 0;
  option_pay: number = 0;
  kitchen_area!: number;

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;

  isSearchTermCollapsed: boolean = false;
  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  selectedRepair_status: any;
  searchParamsArr: string[] = [];
  searchSuggestions: string[] = [];
  endpoint = 'http://localhost:3000/search/flat';
  filteredFlats?: any;
  flatImages: any[] | undefined;
  filteredImages: any[] | any;
  minValue: number = 0;
  maxValue: number = 100000;
  form: FormGroup | undefined;
  timer: any;
  private subscription: Subscription | undefined;
  searchQuery: any;
  searchTimer: any;


  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    ) { }

  ngOnInit() {
    this.onSubmit();
  }

  onSubmitWithDelay() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.onSubmit();
    }, 1000);
  }

  loadCities() {
    const searchTerm = this.selectedRegion.toLowerCase();
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );
    const selectedRegionObj = this.filteredRegions.find(region =>
      region.name === this.selectedRegion
    );
    this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.selectedCity = '';
  }

  loadDistricts() {
    const searchTerm = this.selectedCity.toLowerCase();
    const selectedRegionObj = this.regions.find(region =>
      region.name === this.selectedRegion
    );
    this.filteredCities = selectedRegionObj
      ? selectedRegionObj.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm)
      )
      : [];

    const selectedCityObj = this.filteredCities.find(city =>
      city.name === this.selectedCity
    );
  }

  async fetchFlatData(url: string) {
    const response : any = await this.http.get(url).toPromise();
    console.log(response.img)
    console.log(response.count)
    this.filteredFlats = response.img
    this.applyFilter(response.img)
  }

  onInputChange() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.onSubmit();
    }, 1000);
  }

  onSubmit() {
    this.filteredCities = this.selectedCity ? this.cities.filter(city => city.name.toLowerCase().includes(this.selectedCity.toLowerCase())) : this.cities;

    if (this.searchQuery) {
      const flatId = this.searchQuery;
      console.log(this.searchQuery)
      const url = `${this.endpoint}/?flat_id=${flatId}`;
      console.log(url)
      this.fetchFlatData(url);
      return;
    }

    setTimeout(async () => {
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
        kitchen_area: this.kitchen_area || '',
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
        balcony: this.balcony || '',
        bunker: this.bunker || '',
        option_flat: this.option_flat || '1',
        room: this.room ? '1' : '0',
        option_pay: this.option_pay ? '1' : '0',
      };

      const url = this.buildSearchURL(params);

      await this.fetchFlatData(url);
      this.applyFilter(this.filteredFlats);
    }, 1000);
  }

  startTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.searchQuery && this.searchQuery.length >= 3) {
        this.onSubmit();
      }
    }, 1000);
  }

  buildSearchURL(params: any): string {
    const endpoint = 'http://localhost:3000/search/flat';
    console.log(params)
    const paramsString = Object.keys(params)
      .filter(key => params[key] !== '')
      .map(key => key + '=' + params[key])
      .join('&');
    console.log(`${endpoint}?${paramsString}`)
    return `${endpoint}?${paramsString}`;
  }

  applyFilter(filteredFlats: any) {
    this.filterService.updateFilter(filteredFlats);
  }

  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }
}
