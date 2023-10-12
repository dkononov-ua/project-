import { FilterService } from '../../filter.service';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { serverPath } from 'src/app/shared/server-config';

interface SearchParams {
  [key: string]: any;
}
@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss'],
})

export class SearchTermComponent implements OnInit {

  limit: number = 0;
  offs: number = 0;
  pageEvent: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  };

  price_of!: number;
  price_to!: number;
  region!: string;
  city!: string;
  rooms_of: any = '0';
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
  option_flat: string = "2";
  room: number = 0;
  option_pay: number = 0;
  kitchen_area!: number;
  filterData: number = 0;
  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;

  isSearchTermCollapsed: boolean = false;
  filteredFlats?: any;
  minValue: number = 0;
  maxValue: number = 100000;
  searchQuery: any;
  searchTimer: any;
  // загальна кількість знайдених осель
  optionsFound: number = 0
  loading = true;

  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.searchFilter();
  }

  // завантаження бази міст
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

  // завантаження бази областей
  loadRegion() {
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

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.searchFilter();
    }, 1000);
  }

  // пошук оселі по ID
  searchByID() {
    if (this.searchQuery) {
      const endpoint = serverPath + '/search/flat';
      const flatId = this.searchQuery;
      const url = `${endpoint}/?flat_id=${flatId}`;
      this.getSearchData(url);
      return;
    }
    if (!this.searchQuery) {
      this.searchFilter();
      return;
    }
  }

  // збір пошукових параметрів
  async searchFilter() {
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
      option_flat: this.option_flat,
      room: this.room ? '1' : '0',
      option_pay: this.option_pay ? '1' : '0',
      limit: this.limit,
      filterData: this.filterData || '',
    };
    const url = this.buildSearchURL(params);
    await this.getSearchData(url);
  }

  // побудова URL пошукового запиту
  buildSearchURL(params: any): string {
    const endpoint = serverPath + '/search/flat';
    const paramsString = Object.keys(params).filter(key => params[key] !== '').map(key => key + '=' + params[key]).join('&');
    return `${endpoint}?${paramsString}`;
  }

  // передача пошукових фільтрів та отримання результатів пошуку
  async getSearchData(url: string) {
    const response: any = await this.http.get(url).toPromise();
    this.optionsFound = response.count;
    this.filteredFlats = response.img;
    this.passInformationToService(this.filteredFlats, this.optionsFound);
    this.loading = false;
  }

  // передача отриманих даних до сервісу а потім виведення на картки карток
  passInformationToService(filteredFlats: any, optionsFound: number) {
    if (filteredFlats && optionsFound) {
      this.filterService.updateFilter(filteredFlats, optionsFound);
      this.loading = false;
    } else {
      this.filterService.updateFilter(undefined, 0);
      this.loading = false;
    }
  }

  // наступна сторінка
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.optionsFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.limit = offs;
    }
    this.searchFilter();
  }

  // попередня сторінка
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.limit = offs;
    }
    this.searchFilter();
  }
}
