import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface FlatInfo {
  osbb_name: string | undefined;
  osbb_phone: number;
  pay_card: number;
  wifi: string | undefined;
  info_about: string | undefined;
}

@Component({
  selector: 'app-house-info',
  templateUrl: './house-info.component.html',
  styleUrls: ['./house-info.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HouseInfoComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  isOpen = true;
  isOnline = true;
  isOffline = false;
  idleTimeout: any;
  isCopied = false;
  switch: boolean = false;
  indexCard: number = 1;

  user = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    tell: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  house = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: '',
    flat_index: '',
    private: Number(''),
    rent: Number(''),
    live: Number(''),
    who_live: Number(''),
    subscribers: '',
  };

  param = {
    region: '',
    rooms: '',
    area: '',
    kitchen_area: '',
    repair_status: Number(''),
    floor: '',
    balcony: Number(''),
  };

  options: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Новий',
    2: 'Добрий',
    3: 'Задовільний',
    4: 'Поганий',
    5: 'Класичний балкон',
    6: 'Французький балкон',
    7: 'Лоджія',
    8: 'Тераса',
    9: 'Веранда',
    10: 'Підземний паркінг',
    11: 'Є повноцінне укриття в будинку',
    12: 'Є укриття поряд з будинком',
    13: 'Немає',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    1: 'до 100м',
    2: 'до 300м',
    3: 'до 500м',
    4: 'до 1км',
    5: 'на території',
  }

  checkBox: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Так',
    2: 'Ні',
  }

  checkBoxAnimals: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Без тварин',
    2: 'За попередньою домовленістю',
    3: 'Можна з тваринами',
  }

  about = {
    distance_metro: Number(''),
    distance_stop: Number(''),
    distance_shop: Number(''),
    distance_green: Number(''),
    distance_parking: Number(''),
    woman: Number(''),
    man: Number(''),
    family: Number(''),
    students: Number(''),
    animals: Number(''),
    price_m: Number(''),
    price_d: Number(''),
    about: '',
    bunker: Number(''),
    option_pay: Number(''),
  };

  copyFlatId() {
    const flatId = this.house.flat_id;

    navigator.clipboard.writeText(flatId)
      .then(() => {
        console.log('ID оселі скопійовано!');
        this.isCopied = true;

        setTimeout(() => {
          this.isCopied = false;
        }, 2000);
      })
      .catch((error) => {
        console.log('Помилка при копіюванні ID оселі.');
        this.isCopied = false;
      });
  }


  isFeatureEnabled: boolean = false;
  toggleMode(): void {
    this.isFeatureEnabled = !this.isFeatureEnabled;
  }

  addressHouse: any;
  images: string[] = [];
  flatImg: any = [{ img: "housing_default.svg" }];
  selectedFlatId!: string | null;
  loading: boolean = false;
  flatInfo: any;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.getSelectedFlatId();
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        this.getInfo();
      } else {
        console.log('no flat')
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.http.post(serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          if (response)
            this.house.region = response.flat.region;
          this.house.flat_id = response.flat.flat_id;
          this.house.country = response.flat.country;
          this.house.city = response.flat.city;
          this.house.street = response.flat.street;
          this.house.houseNumber = response.flat.houseNumber;
          this.house.apartment = response.flat.apartment;
          this.house.flat_index = response.flat.flat_index;
          this.house.private = response.flat.private;
          this.house.rent = response.about.rent;
          this.house.live = response.flat.live;
          this.house.who_live = response.flat.who_live;
          this.house.subscribers = response.flat.subscribers;

          this.param.rooms = response.param.rooms;
          this.param.repair_status = response.param.repair_status;
          this.param.area = response.param.area;
          this.param.kitchen_area = response.param.kitchen_area;
          this.param.balcony = response.param.balcony;
          this.param.floor = response.param.floor;

          this.about.distance_metro = response.about.distance_metro;
          this.about.distance_stop = response.about.distance_stop;
          this.about.distance_shop = response.about.distance_shop;
          this.about.distance_green = response.about.distance_green;
          this.about.distance_parking = response.about.distance_parking;
          this.about.woman = response.about.woman;
          this.about.man = response.about.man;
          this.about.family = response.about.family;
          this.about.students = response.about.students;
          this.about.option_pay = response.about.option_pay;

          this.about.animals = response.about.animals;
          this.about.price_m = response.about.price_m;
          this.about.price_d = response.about.price_d;
          this.about.about = response.about.about;
          this.about.bunker = response.about.bunker;

          if (response.imgs !== 'Картинок нема') {
            this.flatImg = response.imgs;
          }

          if (this.flatImg !== undefined && Array.isArray(this.flatImg) && this.flatImg.length > 0 && response.imgs !== 'Картинок нема') {
            for (const img of this.flatImg) {
              this.images.push(serverPath + '/img/flat/' + img.img);
            }
          } else {
            this.images.push(serverPath + '/housing_default.svg');
          }

          this.flatInfo = response;
          this.loading = false;
        }, (error: any) => {
          console.error(error);
          this.loading = false;
        });
    } else {
      console.log('house not found');
      this.loading = false;
    }
  };
}


