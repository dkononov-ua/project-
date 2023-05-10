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
  photoUrl: string;
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
    return `http://localhost:3000/img/flat/${fileName}`; // Оновіть URL відповідно до вашого сервера та шляху до зображень
  }

  selectedFlat: FlatInfo | undefined;
  subscription: any;
  flatInfo: FlatInfo[] = [];
  filteredFlats: any[] | undefined;
  currentCard: any; // Додано


  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.currentCard = {}; // Додано
  }

  ngOnInit(): void {
    const url = 'http://localhost:3000/search/flat'; // Ваш URL для отримання даних про оселі
    this.fetchFlatData(url);
  }

  selectFlat(flat: FlatInfo) {
    this.selectedFlat = flat;
    this.getImageUrl `http://localhost:3000/img/flat/${fileName}`; // Оновіть URL відповідно до вашого сервера та шляху до зображень
  }


  handleFilteredFlats(filteredFlats: any[]) {
    console.log(filteredFlats); // Виводимо відфільтровані дані в консоль

    // Відображення відфільтрованих даних на сторінці
    this.filteredFlats = filteredFlats;
  }


  fetchFlatData(url: string) {
    this.subscription = this.http.get<{ flat_inf: any[] }>(url).subscribe((data) => {
      const flatInfo = data.flat_inf; // Отримуємо інформацію про оселі з відповіді
      if (flatInfo) {
        console.log(flatInfo); // Виводимо всі оселі

        this.flatInfo = flatInfo;
        this.filteredFlats = this.flatInfo; // Зберігаємо всі оселі у властивості filteredFlats

        console.log(this.filteredFlats); // Виводимо всі оселі в консоль

        // Перевірка наявності даних
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

  // onNextCard() {
  //   this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
  //   this.currentCard = this.cards[this.currentCardIndex];
  // }

  // onPrevCard() {
  //   this.currentCardIndex = (this.currentCardIndex - 1 + this.cards.length) % this.cards.length;
  //   this.currentCard = this.cards[this.currentCardIndex];
  // }

  onSubscribe() {
    // Do something when subscribe button is clicked
  }


  currentCardIndex = 0;

  // cards: any[] = [
  //   {
  //     title: 'Картка 1',
  //     description: 'Інформація про орендодавця.',
  //     tell: '+380677727447',
  //     firstName: 'Олена',
  //     lastName: 'Кругляк',
  //     image: 'assets/photo3.JPG',
  //     passport: 'https://example.com',
  //     passportText: 'Документи',
  //     grantAccess: 'https://example.com',
  //     grantAccessText: 'Надати доступ',
  //     bankDetails: 'https://example.com',
  //     bankDetailsText: 'Реквізити',
  //     descriptionHouse: 'Інформація про оселю.',
  //     address: 'Херсон, вул Степана Бандери №3. кв №24.',
  //     homeAccount: 'home-account',
  //     homeAccountText: 'Аккаунт оселі',
  //     imageCarousel: 'assets/cd5dc32d8c2c7963e7b0f3bf82f5e0a4.jpg',
  //     imageCarousel1: 'assets/image.jpg',
  //     price: '9 000 ₴/міс',

  //     numberRooms: '2',
  //     district: 'Поділ',
  //     city: 'Київ',
  //     typeHousing: 'Квартира',
  //     animals: 'Можна з тваринами',
  //   },

  //   {
  //     title: 'Картка 2',
  //     description: 'Інформація про орендодавця.',
  //     tell: '+380677727447',
  //     firstName: 'Денис',
  //     lastName: 'Кононов',
  //     image: 'assets/photo1.png',
  //     passport: 'https://example.com',
  //     passportText: 'Документи',
  //     grantAccess: 'https://example.com',
  //     grantAccessText: 'Надати доступ',
  //     bankDetails: 'https://example.com',
  //     bankDetailsText: 'Реквізити',
  //     createDeal: 'payments',
  //     createDealText: 'Створити угоду',
  //     descriptionHouse: 'Інформація про оселю.',
  //     imageCarousel: 'assets/badroom.jpg',
  //     imageCarousel1: 'assets/kitchwn.jpeg',

  //     address: 'Київ, вул Чорнобильська №19. кв №24.',
  //     homeAccount: '/home-account',
  //     homeAccountText: 'Аккаунт оселі',
  //     price: '10 500 ₴/міс',

  //     numberRooms: '2',
  //     district: 'Поділ',
  //     city: 'Київ',
  //     typeHousing: 'Квартира',
  //     animals: 'Можна з тваринами',
  //   },
  //   {
  //     title: 'Картка 3',
  //     description: 'Інформація про орендодавця.',
  //     tell: '+380677727447',
  //     firstName: 'Віталій',
  //     lastName: ' Селіверстов',
  //     image: 'assets/photo4.jpg',
  //     passport: 'https://example.com',
  //     passportText: 'Документи',
  //     grantAccess: 'https://example.com',
  //     grantAccessText: 'Надати доступ',
  //     bankDetails: 'https://example.com',
  //     bankDetailsText: 'Реквізити',
  //     createDeal: 'payments',
  //     createDealText: 'Створити угоду',
  //     descriptionHouse: 'Інформація про оселю.',
  //     address: 'Львів, вул Варшавська №11. кв №24.',
  //     homeAccount: '/home-account',
  //     homeAccountText: 'Аккаунт оселі',
  //     imageCarousel: 'assets/pjegjb8bq1036v0be3ums2o3o1iqrdsd.jpg',
  //     imageCarousel1: 'assets/stat-hitech-01.jpg',
  //     price: '12 000 ₴/міс',

  //     numberRooms: '1',
  //     district: 'Святошинський',
  //     city: 'Київ',
  //     typeHousing: 'Квартира',
  //     animals: 'Без тварин',
  //   }
  // ];

  // houses: Subscriber[] = [
  //   {
  //     id: 1,
  //     name: 'Київ',
  //     photoUrl: 'assets/bg-reg.jpg',
  //     price: '10K ₴',
  //   },
  //   {
  //     id: 2,
  //     name: 'Львів',
  //     photoUrl: 'assets/image.jpg',
  //     price: '9K ₴',
  //   },
  //   {
  //     id: 3,
  //     name: 'Київ',
  //     photoUrl: 'assets/kitchwn.jpeg',
  //     price: '12K ₴',
  //   },
  //   {
  //     id: 4,
  //     name: 'Київ',
  //     photoUrl: 'assets/kitchwn.jpeg',
  //     price: '12K ₴',
  //   },
  //   {
  //     id: 5,
  //     name: 'Київ',
  //     photoUrl: 'assets/kitchwn.jpeg',
  //     price: '12K ₴',
  //   },
  //   {
  //     id: 6,
  //     name: 'Київ',
  //     photoUrl: 'assets/kitchwn.jpeg',
  //     price: '12K ₴',
  //   },
  //   {
  //     id: 7,
  //     name: 'Київ',
  //     photoUrl: 'assets/kitchwn.jpeg',
  //     price: '12K ₴',
  //   },

  // ];
}
