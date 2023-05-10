import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

interface FlatInfo {
  region: string;
  city: string;
  rooms: string;
  area: string;
  repair_status: string;
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
  country: string;
  price: any;
  id: number;
  name: string;
  photos: string[]; // Зберігаємо URL-адреси фотографій у властивості photos
  img: string;
}




interface Subscriber {
  price: any;
  id: number;
  name: string;
  photoUrl: string;
}

@Component({
  selector: 'app-housing-search',
  templateUrl: './housing-search.component.html',
  styleUrls: ['./housing-search.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})

export class HousingSearchComponent implements OnInit {

  getImageUrl(fileName: string): string {
    return `http://localhost:3000/img/flat/${fileName}`;
  }

  selectedFlat: FlatInfo | any;
  flatInfo: FlatInfo[] = [];
  filteredFlats: FlatInfo[] | undefined;
  currentCard: any;
  filterForm: FormGroup;
  subscription: Subscription | undefined;



  filterChange$: Observable<any> | undefined; // Observable для слідкування за змінами фільтрів

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    // Решта коду...
    this.filterForm = this.formBuilder.group({
      // Визначте ваші фільтри тут
    });
  }

  ngOnInit(): void {
    const url = 'http://localhost:3000/search/flat'; // Ваш URL для отримання даних про оселі
    this.fetchFlatData(url);
    if (this.filteredFlats && this.filteredFlats.length > 0) {
      this.currentCardIndex = 0;
      this.selectedFlat = this.filteredFlats[this.currentCardIndex];
    }

    if (this.filterForm) {
      this.filterChange$ = this.filterForm.valueChanges;
      this.filterChange$.subscribe((value) => {
        this.filterFlats();
      });
    }

  }


  selectFlat(flat: FlatInfo) {
    this.selectedFlat = flat;
  }

  handleFilteredFlats(filteredFlats: FlatInfo[]) {
    console.log(filteredFlats); // Виводимо відфільтровані дані в консоль

    // Відображення відфільтрованих даних на сторінці
    this.filteredFlats = filteredFlats;
  }



  fetchFlatData(url: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.http.get<{ flat_inf: FlatInfo[] }>(url).subscribe((data) => {
      const flatInfo = data.flat_inf; // Отримуємо інформацію про оселі з відповіді
      if (flatInfo) {
        this.flatInfo = flatInfo.map((flat) => {
          flat.photos = [flat.img];
          return flat;
        });

        this.filterFlats(); // Оновити відфільтровані дані після отримання нових осель

        if (this.filteredFlats && this.filteredFlats.length > 0) {
          this.currentCardIndex = 0;
          this.selectedFlat = this.filteredFlats[this.currentCardIndex];
        }

        console.log('Отримано інформацію про оселі');
      } else {
        console.log('Немає інформації про оселі');
      }
    });
  }

  filterFlats() {
    if (this.filterForm && this.flatInfo) {
      const filters = this.filterForm.value; // Отримуємо значення фільтрів з форми
  
      const filteredFlats = this.flatInfo.filter((flat) => {
        // Перевіряємо, чи оселя відповідає умовам фільтрів
        // Використовуйте значення з фільтрів для виконання перевірок
  
        // Приклад: фільтр за кількістю кімнат
        if (filters.rooms && filters.rooms !== flat.rooms) {
          return false;
        }
  
        // Приклад: фільтр за ціною
        if (filters.price && flat.price > filters.price) {
          return false;
        }
  
        // Додайте інші умови фільтрації, відповідно до вашого вимоги
  
        return true; // Повертаємо true, якщо оселя відповідає всім умовам фільтрації
      });
  
      this.filteredFlats = filteredFlats;
      this.handleFilteredFlats(filteredFlats); // Оновити відображення на сторінці
    }
  }
  


  filterFlatsBySelections(flatInfo: FlatInfo[]): FlatInfo[] {
    // Виконується фільтрація осель на основі вибраних умов
    // Повертає відфільтрований масив FlatInfo[]

    const filteredFlats: FlatInfo[] = [];

    // Додайте код фільтрації осель за вашими умовами
    // І додайте відповідні оселі до filteredFlats

    return filteredFlats;
  }


  getFlatPhotos(flat: FlatInfo): string[] {
    return flat.photos;
  }

  currentCardIndex: number = 0;
  cards: FlatInfo[] = [];

  onNextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.filteredFlats!.length;
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
  }

  onPrevCard() {
    this.currentCardIndex = (this.currentCardIndex - 1 + this.filteredFlats!.length) % this.filteredFlats!.length;
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
  }


  onSubscribe() {
    // Do something when subscribe button is clicked
  }

}
