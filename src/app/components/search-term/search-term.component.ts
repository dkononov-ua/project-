import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { SendDataService } from 'src/app/services/send-data.service';

@Component({
  selector: 'app-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss'],
})
export class SearchTermComponent implements OnInit {

  selectedCity!: string;
  selectedRooms!: number;
  selectedRating!: number;
  selectedArea!: number;
  selectedRegion!: string;


  myForm: FormGroup | undefined | any;
  sendData: any;
  selectedRepair_status: any;
  selectedDistance_parking: any;
  selectedDistance_green: any;
  selectedDistance_shop: any;
  selectedDistance_stop: any;
  selectedDistance_metro: any;
  selectedAnimals: any;

  onSubmit() {
    const formValue = this.myForm?.value;
    const params = new HttpParams()
      .set('price_of', formValue.price_of)
      .set('price_to', formValue.price_to)
      .set('students', formValue.students)
      .set('woman', formValue.woman)
      .set('man', formValue.man)
      .set('family', formValue.family);
    this.http.get(`${this.endpoint}`, { params }).subscribe(data => {
    });
  }

  onSubmit2() {
    const formData = new FormData();
    formData.append('region', this.selectedRegion),
    this.sendData.sendFormData(formData).subscribe((response: any) => {
      console.log('Server response:', response);
    });
  }


  endpoint = 'http://localhost:3000/search/flat';
  private searchSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private SendDataService: SendDataService) { }

  search(searchString: string) {
    this.searchSubscription?.unsubscribe();
    if (searchString && searchString.length > 3) {
      this.searchSubscription = this.http.get(`${this.endpoint}?search=${searchString}`)
        .subscribe(data => {
          // do something with the response data
        });
    }
  }

  // submitForm() {
  //   this.SendDataService.sendFormData(this.myForm).subscribe(
  //     response => {
  //       console.log('Дані успішно відправлені на сервер');
  //     },
  //     error => {
  //       console.error('Сталася помилка при відправленні даних на сервер', error);
  //     }
  //   );
  // }

  debounce(cb: any, ms: number) {
    let timer: any = null;
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(cb, ms);
    };
  }

  inputSearchHandler(event: any) {
    this.debounce(() => {
      const searchString = event.target.value.trim();
      this.search(searchString);
    }, 3000)();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      price_of: new FormControl(),
      price_to: new FormControl(),
      students: new FormControl(),
      woman: new FormControl(),
      man: new FormControl(),
      family: new FormControl()
    });
    this.onPriceRangeChange();

    const inputSearch = document.querySelector('.search-input') as HTMLInputElement;
    inputSearch.addEventListener('keyup', (event) => {
      this.inputSearchHandler(event);
    });

  }

  minValue: number = 0;
  maxValue: number = 100000;

  selectedMinValue: number = 0;
  selectedMaxValue: number = 100000;

  onPriceRangeChange() {
    if (this.selectedMaxValue < this.selectedMinValue) {
      const temp = this.selectedMinValue;
      this.selectedMinValue = this.selectedMaxValue;
      this.selectedMaxValue = temp;
    }
  }


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
    { id: 0, name: 'Всі області' },
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
    { id: 25, name: 'АР Крим' }
  ];
}
