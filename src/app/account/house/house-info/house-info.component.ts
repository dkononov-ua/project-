import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
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
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
  ],
})
export class HouseInfoComponent implements OnInit {

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  isOpen = true;
  isCopied = false;
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

  currentPhotoIndex: number = 0;
  prevPhoto() {
    this.currentPhotoIndex--;
  }
  nextPhoto() {
    this.currentPhotoIndex++;
  }

  copyFlatId() {
    const flatId = this.house.flat_id;
    navigator.clipboard.writeText(flatId)
      .then(() => {
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 1000);
      })
      .catch((error) => {
        this.isCopied = false;
      });
  }

  images: string[] = [];
  flatImg: any = [{ img: "housing_default.svg" }];
  loading: boolean = false;
  houseData: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDataFlat();
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.house.region = parsedHouseData.flat.region;
        this.house.flat_id = parsedHouseData.flat.flat_id;
        this.house.country = parsedHouseData.flat.country;
        this.house.city = parsedHouseData.flat.city;
        this.house.street = parsedHouseData.flat.street;
        this.house.houseNumber = parsedHouseData.flat.houseNumber;
        this.house.apartment = parsedHouseData.flat.apartment;
        this.house.flat_index = parsedHouseData.flat.flat_index;
        this.house.private = parsedHouseData.flat.private;
        this.house.rent = parsedHouseData.about.rent;
        this.house.live = parsedHouseData.flat.live;
        this.house.who_live = parsedHouseData.flat.who_live;
        this.house.subscribers = parsedHouseData.flat.subscribers;

        this.param.rooms = parsedHouseData.param.rooms;
        this.param.repair_status = parsedHouseData.param.repair_status;
        this.param.area = parsedHouseData.param.area;
        this.param.kitchen_area = parsedHouseData.param.kitchen_area;
        this.param.balcony = parsedHouseData.param.balcony;
        this.param.floor = parsedHouseData.param.floor;

        this.about.distance_metro = parsedHouseData.about.distance_metro;
        this.about.distance_stop = parsedHouseData.about.distance_stop;
        this.about.distance_shop = parsedHouseData.about.distance_shop;
        this.about.distance_green = parsedHouseData.about.distance_green;
        this.about.distance_parking = parsedHouseData.about.distance_parking;
        this.about.woman = parsedHouseData.about.woman;
        this.about.man = parsedHouseData.about.man;
        this.about.family = parsedHouseData.about.family;
        this.about.students = parsedHouseData.about.students;
        this.about.option_pay = parsedHouseData.about.option_pay;

        this.about.animals = parsedHouseData.about.animals;
        this.about.price_m = parsedHouseData.about.price_m;
        this.about.price_d = parsedHouseData.about.price_d;
        this.about.about = parsedHouseData.about.about;
        this.about.bunker = parsedHouseData.about.bunker;

        if (this.house.rent == 1) {
          this.indexCard = 1;
        } else {
          this.indexCard = 2;
        }

        if (Array.isArray(parsedHouseData.imgs) && parsedHouseData.imgs.length > 0) {
          this.flatImg = parsedHouseData.imgs;
        } else {
          this.flatImg = [{ img: "housing_default.svg" }];
        }
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

}


