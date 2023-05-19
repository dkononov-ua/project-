import { Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterService } from '../filter.service';
import { regions } from './data-search';
import { cities } from './data-search';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface SearchParams {
  [key: string]: any;
}
interface SearchParams {
  country: string;
  region: string;
  city: string;
  // rooms: number | string;

  selectedMinRooms: number | string;
  selectedMaxRooms: number | string;

  repair_status: string;
  area?: number | string;
  selectedKitchen_area: string;
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
  selectedRooms!: number | any;
  selectedMinArea!: number;
  selectedMaxArea!: number;
  selectedKitchen_area!: string;
  selectedRegion!: string;
  selectedAnimals!: string;
  selectedDistance_metro!: string;
  selectedDistance_stop!: string;
  selectedDistance_green!: string;
  selectedDistance_shop!: string;
  selectedDistance_parking!: string;

  selectedBunker!: number;
  selectedBalcony!: number;
  selectedMinRooms!: number;
  selectedMaxRooms!: number;


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

  startTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.searchQuery && this.searchQuery.length >= 3) {
        this.onSubmit();
      }
    }, 2000);
  }

  ngOnInit() {
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
    clearTimeout(this.timer); // Скидання попереднього таймера

    // Встановлення нового таймера на 2 секунди
    this.timer = setTimeout(() => {
      this.onSubmit(); // Виклик функції onSubmit після 2-секундної затримки
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
      // rooms: this.selectedRooms || '',
      selectedMinRooms: this.selectedMinRooms || '',
      selectedMaxRooms: this.selectedMaxRooms || '',
      selectedMinArea: this.selectedMinArea || '',
      selectedMaxArea: this.selectedMaxArea || '',
      repair_status: this.selectedRepair_status || '',
      selectedKitchen_area: this.selectedKitchen_area || '',
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

    let searchParamsArr: string[] = [];
    this.addSelectedValue(searchParamsArr, 'Регіон', this.selectedRegion);
    this.addSelectedValue(searchParamsArr, 'Місто', this.selectedCity);
    this.addSelectedValue(searchParamsArr, 'Кімнати', this.selectedRooms);
    this.addSelectedValue(searchParamsArr, 'Площа', this.selectedMinArea);
    this.addSelectedValue(searchParamsArr, 'Площа', this.selectedMaxArea);
    this.addSelectedValue(searchParamsArr, 'Ремонт', this.selectedRepair_status);
    this.addSelectedValue(searchParamsArr, 'Кухня', this.selectedKitchen_area);
    this.addSelectedValue(searchParamsArr, 'Балкон', this.selectedBalcony);
    this.addSelectedValue(searchParamsArr, 'Укриття', this.selectedBunker);
    this.addSelectedValue(searchParamsArr, 'Тварини', this.selectedAnimals);
    this.addSelectedValue(searchParamsArr, 'Метро', this.selectedDistance_metro);
    this.addSelectedValue(searchParamsArr, 'Зупинки', this.selectedDistance_stop);
    this.addSelectedValue(searchParamsArr, 'Парк', this.selectedDistance_green);
    this.addSelectedValue(searchParamsArr, 'Маркет', this.selectedDistance_shop);
    this.addSelectedValue(searchParamsArr, 'Парковка', this.selectedDistance_parking);
    this.addSelectedValue(searchParamsArr, 'Балкон', this.selectedBalcony);
    this.addSelectedValue(searchParamsArr, 'Укриття', this.selectedDistance_parking);
    this.searchParamsString = searchParamsArr.join(', ');

    // Отримати URL для відправки даних
    const url = this.buildSearchURL(params);

    setTimeout(() => {
      // Отримати змінні дані форми і відправити на сервер
      this.fetchFlatData(url);
      this.applyFilter(this.filteredFlats, this.filteredImages);

      // Побудувати рядок пошуку і створити посилання
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== '') {
          searchParams.set(key, params[key]);
        }
      });
      const searchQuery = searchParams.toString();
      const searchURL = `http://localhost:4200/housing-search/${searchQuery}`;

      // Вивести посилання в консолі
      console.log('Посилання на пошук:', searchURL);
    }, 2000);
  }

  private addSelectedValue(arr: string[], label: string, value: any) {
    if (value) {
      arr.push(`${label}: ${value}`);
    }
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
