import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, HostBinding, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

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
  subscription: any;
  flatInfo: FlatInfo[] = [];
  filteredFlats: any[] | undefined;
  currentCard: any;



  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.currentCard = {};
  }

  ngOnInit(): void {
    const url = 'http://localhost:3000/search/flat'; // Ваш URL для отримання даних про оселі
    this.fetchFlatData(url);
    if (this.filteredFlats && this.filteredFlats.length > 0) {
      this.currentCardIndex = 0;
      this.selectedFlat = this.filteredFlats[this.currentCardIndex];
    }
  }

  selectFlat(flat: FlatInfo) {
    this.selectedFlat = flat;
  }



  handleFilteredFlats(filteredFlats: any[]) {
    console.log(filteredFlats); // Виводимо відфільтровані дані в консоль

    // Відображення відфільтрованих даних на сторінці
    this.filteredFlats = filteredFlats;
  }


  fetchFlatData(url: string) {
    this.subscription = this.http.get<{ flat_inf: any[] }>(url).subscribe((data) => {
      const flatInfo = data.flat_inf;
      if (flatInfo) {
        console.log(flatInfo);

        this.flatInfo = flatInfo.map((flat: FlatInfo) => {
          flat.photos = [flat.img];

          return flat;
        });

        this.filteredFlats = this.flatInfo;

        console.log(this.filteredFlats);

        if (this.filteredFlats && this.filteredFlats.length > 0) {
          console.log('Отримано інформацію про оселі');
        } else {
          console.log('Немає інформації про оселі');
        }
      } else {
        console.log('flatInfo is undefined');
      }
    });
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
