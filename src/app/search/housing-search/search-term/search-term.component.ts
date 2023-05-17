import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription, debounceTime, filter } from 'rxjs';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { FilterService } from '../filter.service';

interface SearchParams {
  [key: string]: any;
}

interface SearchParams {
  country: string;
  region: string;
  city: string;
  rooms: number | string;
  repair_status: string;
  area: string;
  selectedKitchen_area: string;
  balcony: string;
  bunker: string;
  animals: string;
  distance_metro: string;
  distance_stop: string;
  distance_green: string;
  distance_shop: string;
  distance_parking: string;
  limit: number | undefined;
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
  private subscription: Subscription | undefined;

  selectedCity!: string;
  selectedRooms!: number | any;
  selectedRating!: number;
  selectedArea!: string;
  selectedKitchen_area!: string;
  selectedRegion!: string;
  selectedAnimals!: string;
  selectedDistance_metro!: string;
  selectedDistance_stop!: string;
  selectedDistance_green!: string;
  selectedDistance_shop!: string;
  selectedDistance_parking!: string;
  selectedBunker!: string;
  selectedBalcony!: string;
  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  limit!: number | any;

  myForm: FormGroup | undefined | any;
  selectedRepair_status: any;
  searchParamsArr: string[] = [];
  searchSuggestions: string[] = [];

  timer: any;


  endpoint = 'http://localhost:3000/search/flat';
  private searchSubscription: Subscription | null = null;
  form: any;
  filteredFlats: any;
  flatImages: any[] | undefined;
  filteredImages: any[] | any;

  constructor(private filterService: FilterService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.myForm = this.formBuilder.group({
      price_of: [],
      price_to: [],
      students: [],
      woman: [],
      man: [],
      family: []
    });
  }

  startTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.searchQuery && this.searchQuery.length >= 3) {
        this.onSubmit();
      }
    }, 2000);
  }

  public addUserToHouse(): void {
    console.log(`Користувач з ID ${this.userId} доданий до оселі.`);
    this.userId = '';
    this.showInput = false;
  }

  ngOnInit() {
    this.myForm.valueChanges
      .pipe(
        debounceTime(2000)
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }

  fetchFlatData(url: string) {
    this.subscription = this.http.get<{ flat_inf: any[], flat_img: any[] }>(url).subscribe((data) => {
      console.log(data)
      const { flat_inf, flat_img } = data;
      if (flat_inf && flat_img) {
        this.flatInfo = flat_inf;
        this.flatImages = flat_img;
        this.filterService.updateFilter(flat_inf, flat_img); // Оновити дані фільтрації та фотографій у службі
      }
      this.filteredFlats = data.flat_inf;
      // this.filteredImages = data;
      this.applyFilter(this.filteredFlats, data);
    });
  }

  onSubmit() {
    if (this.searchQuery) {
      const flatId = this.searchQuery;
      const url = `${this.endpoint}/?flat_id=${flatId}`;
      this.fetchFlatData(url);
      return;
    }

    const params: SearchParams = {
      region: this.selectedRegion || '',
      city: this.selectedCity || '',
      rooms: this.selectedRooms || '',
      area: this.selectedArea || '',
      repair_status: this.selectedRepair_status || '',
      selectedKitchen_area: this.selectedKitchen_area || '',
      balcony: this.selectedBalcony || '',
      bunker: this.selectedBunker || '',
      animals: this.selectedAnimals || '',
      distance_metro: this.selectedDistance_metro || '',
      distance_stop: this.selectedDistance_stop || '',
      distance_green: this.selectedDistance_green || '',
      distance_shop: this.selectedDistance_shop || '',
      distance_parking: this.selectedDistance_parking || '',
      limit: this.limit || '',
      country: '',
      students: this.myForm.get('students').value ? 1 : '',
      woman: this.myForm.get('woman').value ? 1 : '',
      man: this.myForm.get('man').value ? 1 : '',
      family: this.myForm.get('family').value ? 1 : '',
    };

    let searchParamsArr: string[] = [];

    this.addSelectedValue(searchParamsArr, 'Регіон', this.selectedRegion);
    this.addSelectedValue(searchParamsArr, 'Місто', this.selectedCity);
    this.addSelectedValue(searchParamsArr, 'Кімнати', this.selectedRooms);
    this.addSelectedValue(searchParamsArr, 'Площа', this.selectedArea);
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
    this.addSelectedValue(searchParamsArr, 'Limit', this.limit);


    this.searchParamsString = searchParamsArr.join(', ');
    console.log('Обрані параметри пошуку:', this.searchParamsString);

    const url = this.buildSearchURL(params);

    this.updateURL();
    this.fetchFlatData(url);
    const filteredFlats = this.filterFlatsBySelections(this.flatInfo!);
    this.filteredFlats = filteredFlats;
    this.applyFilter(this.filteredFlats, this.filteredImages);
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

  updateURL() {
    this.router.navigate([], {
      queryParams: { searchParams: this.searchParamsString },
      queryParamsHandling: 'merge'
    });
  }

  applyFilter(filteredFlats: any, filteredImages: any) {
    this.filterService.updateFilter(filteredFlats, filteredImages);
    console.log(filteredFlats);
  }

  filterFlatsBySelections(flatInfo: any[]): any[] {
    const filteredFlats = flatInfo.filter((flat) => {
      if (this.selectedCity && flat.city !== this.selectedCity) {
        return false;
      }
      if (this.selectedRooms && flat.rooms !== this.selectedRooms) {
        return false;
      }

      return true;
    });

    return filteredFlats;
  }

  minValue: number = 0;
  maxValue: number = 100000;

  regions = [
    { id: 1, name: 'Вінницька' },
    { id: 2, name: 'Волинська' },
    { id: 3, name: 'Дніпропетровська' },
    { id: 4, name: 'Донецька' },
    { id: 5, name: 'Житомирська' },
    { id: 6, name: 'Закарпатська' },
    { id: 7, name: 'Запорізька' },
    { id: 8, name: 'Івано-Франківська' },
    { id: 9, name: 'Київська' },
    { id: 10, name: 'Кіровоградська' },
    { id: 11, name: 'Луганська' },
    { id: 12, name: 'Львівська' },
    { id: 13, name: 'Миколаївська' },
    { id: 14, name: 'Одеська' },
    { id: 15, name: 'Полтавська' },
    { id: 16, name: 'Рівненська' },
    { id: 17, name: 'Сумська' },
    { id: 18, name: 'Тернопільська' },
    { id: 19, name: 'Харківська' },
    { id: 20, name: 'Херсонська' },
    { id: 21, name: 'Хмельницька' },
    { id: 22, name: 'Черкаська' },
    { id: 23, name: 'Чернівецька' },
    { id: 24, name: 'Чернігівська' },
    { id: 25, name: 'АР Крим' }
  ];

  cities = [
    { id: 1, name: 'Вінниця' },
    { id: 2, name: 'Луцьк' },
    { id: 3, name: 'Дніпро' },
    { id: 4, name: 'Донецьк' },
    { id: 5, name: 'Житомир' },
    { id: 6, name: 'Ужгород' },
    { id: 7, name: 'Запоріжжя' },
    { id: 8, name: 'Івано-Франківськ' },
    { id: 9, name: 'Київ' },
    { id: 10, name: 'Кропивницький' },
    { id: 11, name: 'Луганськ' },
    { id: 12, name: 'Львів' },
    { id: 13, name: 'Миколаїв' },
    { id: 14, name: 'Одеса' },
    { id: 15, name: 'Полтава' },
    { id: 16, name: 'Рівне' },
    { id: 17, name: 'Суми' },
    { id: 18, name: 'Тернопіль' },
    { id: 19, name: 'Харків' },
    { id: 20, name: 'Херсон' },
    { id: 21, name: 'Хмельницьк' },
    { id: 22, name: 'Черкаси' },
    { id: 23, name: 'Чернівці' },
    { id: 24, name: 'Чернігів' },
    { id: 25, name: 'АР Крим' },
    { id: 26, name: 'Крюківщина' },
  ];
}
