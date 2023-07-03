import { Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterService } from '../filter.service';
import { regions } from './data-search';
import { cities } from './data-search';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterPipe } from './filter.pipe';

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
  kitchen_area: string;
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
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss'],
})

export class SearchTermComponent implements OnInit {

  public showInput = false;
  public userId: string | undefined;
  searchQuery: string | undefined;
  searchParamsString: string = '';
  price_of: number | undefined;
  price_to: number | undefined;
  students: boolean = false;
  woman: boolean = false;
  man: boolean = false;
  family: boolean = false;
  selectedCity!: string;
  rooms_of!: number | any;
  rooms_to!: number | any;
  area_of!: number;
  area_to!: number;
  kitchen_area!: string;
  selectedRegion!: string;
  selectedAnimals!: string;
  selectedDistance_metro!: string;
  selectedDistance_stop!: string;
  selectedDistance_green!: string;
  selectedDistance_shop!: string;
  selectedDistance_parking!: string;

  selectedBunker!: number;
  selectedBalcony!: number;


  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  selectedRepair_status: any;
  searchParamsArr: string[] = [];
  searchSuggestions: string[] = [];
  regions = regions;
  cities = cities;
  endpoint = 'http://localhost:3000/search/flat';
  filteredFlats?: any;
  flatImages: any[] | undefined;
  filteredImages: any[] | any;
  minValue: number = 0;
  maxValue: number = 100000;

  form: FormGroup | undefined;
  timer: any;
  private subscription: Subscription | undefined;

  constructor(private filterService: FilterService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.onSubmit();
  }

  loadCities() {
    const selectedRegionObj = this.regions.find(region => region.name === this.selectedRegion);
    this.cities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.selectedCity = '';
    this.onSubmit();
  }

  fetchFlatData(url: string) {
    this.subscription = this.http.get<{ flat_inf: any[], flat_img: any[] }>(url).subscribe((data) => {
      console.log(data)
      const { flat_inf, flat_img } = data;
      if (flat_inf && flat_img) {
        this.flatInfo = flat_inf;
      }
      this.filteredFlats = data.flat_inf;
      this.applyFilter(this.filteredFlats, data);
    });
  }

  onInputChange() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.onSubmit();
    }, 2000);
  }

  onSubmit() {
    if (this.searchQuery) {
      const flatId = this.searchQuery;
      const url = `${this.endpoint}/?flat_id=${flatId}`;
      this.fetchFlatData(url);
      return;
    }

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
      kitchen_area: this.kitchen_area || '',
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
      selectedBalcony: this.selectedBalcony || '',
      selectedBunker: this.selectedBunker || '',
    };

    console.log(params)

    const url = this.buildSearchURL(params);

    setTimeout(() => {
      this.fetchFlatData(url);
      this.applyFilter(this.filteredFlats, this.filteredImages);
    }, 2000);
  }

  startTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.searchQuery && this.searchQuery.length >= 3) {
        this.onSubmit();
      }
    }, 2000);
  }

  buildSearchURL(params: any): string {
    const endpoint = 'http://localhost:3000/search/flat';
    const paramsString = Object.keys(params)
      .filter(key => params[key] !== '')
      .map(key => key + '=' + params[key])
      .join('&');
    return `${endpoint}?${paramsString}`;
  }

  applyFilter(filteredFlats: any, filteredImages: any) {
    this.filterService.updateFilter(filteredFlats, filteredImages);
  }
}
