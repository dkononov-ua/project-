import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
import { HouseInfo } from '../../../interface/info';
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
  loading: boolean = false;
  houseData: any;

  HouseInfo: HouseInfo = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: '',
    flat_index: '',
    private: 0,
    rent: 0,
    rooms: '',
    area: '',
    kitchen_area: '',
    repair_status: '',
    floor: '',
    balcony: '',
    distance_metro: '',
    distance_stop: '',
    distance_shop: '',
    distance_green: '',
    distance_parking: '',
    woman: '',
    man: '',
    family: '',
    students: '',
    animals: '',
    price_m: '',
    price_d: '',
    about: '',
    bunker: '',
    option_pay: 0,
    selectedKitchen_area: '',
    limit: '',
    id: 0,
    name: '',
    photos: [],
    img: '',
    metro: '',
    price_y: '',
    agent_id: undefined,
    owner_id: undefined,
    option_flat: undefined,
    room: undefined
  }

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

  currentPhotoIndex: number = 0;
  prevPhoto() {
    this.currentPhotoIndex--;
  }
  nextPhoto() {
    this.currentPhotoIndex++;
  }

  copyFlatId() {
    const flatId = this.HouseInfo.flat_id;
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

  constructor() { }

  ngOnInit(): void {
    this.loadDataFlat();
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.HouseInfo.region = parsedHouseData.flat.region;
        this.HouseInfo.flat_id = parsedHouseData.flat.flat_id;
        this.HouseInfo.country = parsedHouseData.flat.country;
        this.HouseInfo.city = parsedHouseData.flat.city;
        this.HouseInfo.street = parsedHouseData.flat.street;
        this.HouseInfo.houseNumber = parsedHouseData.flat.houseNumber;
        this.HouseInfo.apartment = parsedHouseData.flat.apartment;
        this.HouseInfo.flat_index = parsedHouseData.flat.flat_index;
        this.HouseInfo.private = parsedHouseData.flat.private;
        this.HouseInfo.rent = parsedHouseData.about.rent;
        this.HouseInfo.rooms = parsedHouseData.param.rooms;
        this.HouseInfo.repair_status = parsedHouseData.param.repair_status;
        this.HouseInfo.area = parsedHouseData.param.area;
        this.HouseInfo.kitchen_area = parsedHouseData.param.kitchen_area;
        this.HouseInfo.balcony = parsedHouseData.param.balcony;
        this.HouseInfo.floor = parsedHouseData.param.floor;
        this.HouseInfo.distance_metro = parsedHouseData.about.distance_metro;
        this.HouseInfo.distance_stop = parsedHouseData.about.distance_stop;
        this.HouseInfo.distance_shop = parsedHouseData.about.distance_shop;
        this.HouseInfo.distance_green = parsedHouseData.about.distance_green;
        this.HouseInfo.distance_parking = parsedHouseData.about.distance_parking;
        this.HouseInfo.woman = parsedHouseData.about.woman;
        this.HouseInfo.man = parsedHouseData.about.man;
        this.HouseInfo.family = parsedHouseData.about.family;
        this.HouseInfo.students = parsedHouseData.about.students;
        this.HouseInfo.option_pay = parsedHouseData.about.option_pay;
        this.HouseInfo.animals = parsedHouseData.about.animals;
        this.HouseInfo.price_m = parsedHouseData.about.price_m;
        this.HouseInfo.price_d = parsedHouseData.about.price_d;
        this.HouseInfo.about = parsedHouseData.about.about;
        this.HouseInfo.bunker = parsedHouseData.about.bunker;
        if (Array.isArray(parsedHouseData.imgs) && parsedHouseData.imgs.length > 0) {
          this.HouseInfo.photos = parsedHouseData.imgs;
        } else {
          this.HouseInfo.photos[0] = "housing_default.svg";
        }
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

}


