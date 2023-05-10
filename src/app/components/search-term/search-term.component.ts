import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription, debounceTime, filter } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { SendDataService } from 'src/app/services/send-data.service';
import { Router } from '@angular/router';

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
  limit: string;
}

@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss'],
})
export class SearchTermComponent implements OnInit {
  searchQueryString = '';
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

  myForm: FormGroup | undefined | any;
  sendData: any;
  selectedRepair_status: any;

  endpoint = 'http://localhost:3000/search/flat';
  private searchSubscription: Subscription | null = null;
  form: any;
  searchParamsArr: any;

  constructor(private http: HttpClient, private SendDataService: SendDataService, private router: Router) { }

  ngOnInit() {
    this.myForm = new FormGroup({
      price_of: new FormControl(),
      price_to: new FormControl(),
      students: new FormControl(),
      woman: new FormControl(),
      man: new FormControl(),
      family: new FormControl()
    });

    this.myForm.valueChanges
      .pipe(
        debounceTime(2000)
      )
      .subscribe(() => {
        this.onSubmit();
      });
  }

  onSubmit() {
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
      limit: '',
      country: '',
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

    this.searchParamsString = searchParamsArr.join(', ');
    console.log('Обрані параметри пошуку:', this.searchParamsString);

    const url = this.buildSearchURL(params);

    this.updateURL();
    this.fetchFlatData(url);
  }

  // Додавання значення до масиву параметрів пошуку
  addSelectedValue(searchParamsArr: string[], label: string, value: string) {
    if (value) {
      searchParamsArr.push(`${label}: ${value}`);
    }
  }

  // Формування URL для пошуку
  buildSearchURL(params: SearchParams): string {
    const endpoint = 'http://localhost:3000/search/flat';
    const paramsString = Object.keys(params)
      .filter(key => params[key] !== '') // Видаляємо пусті значення
      .map(key => key + '=' + params[key])
      .join('&');
    return `${endpoint}?${paramsString}`;
  }

  // Оновлення URL з використанням значень пошуку
  updateURL() {
    this.router.navigate([], {
      queryParams: { searchParams: this.searchParamsString },
      queryParamsHandling: 'merge'
    });
  }

  fetchFlatData(url: string) {
    this.subscription = this.http.get<{ flat_inf: any[] }>(url).subscribe((data) => {
      const flatInfo = data.flat_inf; // Отримуємо інформацію про оселі з відповіді
      if (flatInfo) {
        // console.log(flatInfo); // Виводимо всі оселі

        // Додаткова фільтрація на сервері
        const filteredFlats = this.filterFlatsBySelections(flatInfo);

        console.log(filteredFlats); // Виводимо відфільтровані дані в консоль
      } else {
        console.log('flatInfo is undefined');
      }
    });
  }

  filterFlatsBySelections(flatInfo: any[]): any[] {
    const filteredFlats = flatInfo.filter((flat) => {
      // Перевіряємо кожну оселю на відповідність вибраним значенням у селектах
      if (this.selectedCity && flat.city !== this.selectedCity) {
        return false; // Оселя не відповідає вибраному місту
      }
      if (this.selectedRooms && flat.rooms !== this.selectedRooms) {
        return false; // Оселя не відповідає вибраній кількості кімнат
      }
      if (this.selectedArea) {
        let areaLabel = '';
        let areaFilter = false;
        switch (this.selectedArea) {
          // ...
        }
        if (areaFilter) {
          this.searchParamsArr.push(`Площа: ${areaLabel}`);
        }
        return areaFilter;
      }
      if (this.myForm) {
        const price_of = this.myForm.get('price_of').value;
        const price_to = this.myForm.get('price_to').value;
        if (price_of && flat.price < price_of) {
          return false; // Оселя не відповідає вибраній мінімальній ціні
        }
        if (price_to && flat.price > price_to) {
          return false; // Оселя не відповідає вибраній максимальній ціні
        }
        const students = this.myForm.get('students').value;
        const woman = this.myForm.get('woman').value;
        const man = this.myForm.get('man').value;
        const family = this.myForm.get('family').value;
        if ((students && flat.target !== 'students') ||
            (woman && flat.target !== 'woman') ||
            (man && flat.target !== 'man') ||
            (family && flat.target !== 'family')) {
          return false; // Оселя не відповідає вибраній категорії пошуку
        }
      }
      return true; // Оселя відповідає всім вибраним значенням у селектах та формі
    });

    console.log(filteredFlats); // Виводимо відфільтровані дані в консоль

    return filteredFlats;
  }


  search(searchString: string) {
    this.searchSubscription?.unsubscribe();
    if (searchString && searchString.length > 3) {
      this.searchSubscription = this.http.get(`${this.endpoint}?search=${searchString}`)
        .subscribe(data => {
          // do something with the response data
        });
    }
  }

  inputSearchHandler(event: any) {
    const searchString = event.target.value.trim();
    setTimeout(() => {
      this.search(searchString);
    }, 3000);
  }

  minValue: number = 0;
  maxValue: number = 100000;

  regions = [
    { id: 0, name: 'Всі області' },
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
