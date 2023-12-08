import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { HouseInfo } from '../../../interface/info';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ]
})
export class ParametersComponent implements OnInit {
  path_logo = path_logo;
  serverPath = serverPath;

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
    distance_metro: Number(''),
    distance_stop: Number(''),
    distance_shop: Number(''),
    distance_green: Number(''),
    distance_parking: Number(''),
    woman: '',
    man: '',
    family: '',
    students: '',
    animals: Number(''),
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
    option_flat: Number(''),
    room: Number(''),
    agent_id: undefined,
    owner_id: undefined
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
  }

  aboutDistance: { [key: number]: any } = {
    0: 'Немає',
    5: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
    2000: '2км',
  }

  checkBox: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Так',
    2: 'Ні',
  }

  animals: { [key: number]: string } = {
    0: 'Приховати',
    1: 'Без тварин',
    2: 'За домовленістю',
    3: 'Можна з тваринами',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
  }

  houseData: any;
  constructor() { }

  ngOnInit(): void { this.loadDataFlat(); }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.HouseInfo.agent_id = parsedHouseData.flat.agent_id;
        this.HouseInfo.apartment = parsedHouseData.flat.apartment;
        this.HouseInfo.city = parsedHouseData.flat.city;
        this.HouseInfo.country = parsedHouseData.flat.country;
        this.HouseInfo.distance_green = parsedHouseData.flat.distance_green;
        this.HouseInfo.distance_metro = parsedHouseData.flat.distance_metro;
        this.HouseInfo.distance_parking = parsedHouseData.flat.distance_parking;
        this.HouseInfo.distance_shop = parsedHouseData.flat.distance_shop;
        this.HouseInfo.distance_stop = parsedHouseData.flat.distance_stop;
        this.HouseInfo.flat_id = parsedHouseData.flat.flat_id;
        this.HouseInfo.flat_index = parsedHouseData.flat.flat_index;
        this.HouseInfo.houseNumber = parsedHouseData.flat.houseNumber;
        this.HouseInfo.owner_id = parsedHouseData.flat.owner_id;
        this.HouseInfo.region = parsedHouseData.flat.region;
        this.HouseInfo.street = parsedHouseData.flat.street;
        this.HouseInfo.rooms = parsedHouseData.param.rooms;
        this.HouseInfo.repair_status = parsedHouseData.param.repair_status;
        this.HouseInfo.area = parsedHouseData.param.area;
        this.HouseInfo.kitchen_area = parsedHouseData.param.kitchen_area;
        this.HouseInfo.balcony = parsedHouseData.param.balcony;
        this.HouseInfo.floor = parsedHouseData.param.floor;
        this.HouseInfo.option_flat = parsedHouseData.param.option_flat;
        this.HouseInfo.about = parsedHouseData.about.about;
        this.HouseInfo.animals = parsedHouseData.about.animals;
        this.HouseInfo.bunker = parsedHouseData.about.bunker;
        this.HouseInfo.family = parsedHouseData.about.family;
        this.HouseInfo.man = parsedHouseData.about.man;
        this.HouseInfo.option_pay = parsedHouseData.about.option_pay;
        this.HouseInfo.price_d = parsedHouseData.about.price_d;
        this.HouseInfo.price_m = parsedHouseData.about.price_m;
        this.HouseInfo.private = parsedHouseData.about.private;
        this.HouseInfo.rent = parsedHouseData.about.rent;
        this.HouseInfo.room = parsedHouseData.about.room;
        this.HouseInfo.students = parsedHouseData.about.students;
        this.HouseInfo.woman = parsedHouseData.about.woman;
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }
}
