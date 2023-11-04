import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/shared/server-config';
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
    agent_id: '',
    owner_id: '',
  };

  param = {
    region: '',
    rooms: '',
    area: '',
    kitchen_area: '',
    repair_status: '',
    floor: Number(''),
    balcony: '',
    option_flat: Number(''),
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
  }

  aboutDistance: { [key: number]: string } = {
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
    price_y: Number(''),
    about: '',
    bunker: '',
    option_pay: Number(''),
    price_d: '',
    private: '',
    rent: '',
    room: Number(''),
  };

  houseData: any;
  houseInfo: any;

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
        this.house.agent_id = parsedHouseData.flat.agent_id;
        this.house.apartment = parsedHouseData.flat.apartment;
        this.house.city = parsedHouseData.flat.city;
        this.house.country = parsedHouseData.flat.country;
        this.about.distance_green = parsedHouseData.flat.distance_green;
        this.about.distance_metro = parsedHouseData.flat.distance_metro;
        this.about.distance_parking = parsedHouseData.flat.distance_parking;
        this.about.distance_shop = parsedHouseData.flat.distance_shop;
        this.about.distance_stop = parsedHouseData.flat.distance_stop;
        this.house.flat_id = parsedHouseData.flat.flat_id;
        this.house.flat_index = parsedHouseData.flat.flat_index;
        this.house.houseNumber = parsedHouseData.flat.houseNumber;
        this.house.owner_id = parsedHouseData.flat.owner_id;
        this.house.region = parsedHouseData.flat.region;
        this.house.street = parsedHouseData.flat.street;

        this.param.rooms = parsedHouseData.param.rooms;
        this.param.repair_status = parsedHouseData.param.repair_status;
        this.param.area = parsedHouseData.param.area;
        this.param.kitchen_area = parsedHouseData.param.kitchen_area;
        this.param.balcony = parsedHouseData.param.balcony;
        this.param.floor = parsedHouseData.param.floor;
        this.param.option_flat = parsedHouseData.param.option_flat;

        this.about.about = parsedHouseData.about.about;
        this.about.animals = parsedHouseData.about.animals;
        this.about.bunker = parsedHouseData.about.bunker;
        this.about.family = parsedHouseData.about.family;
        this.about.man = parsedHouseData.about.man;
        this.about.option_pay = parsedHouseData.about.option_pay;
        this.about.price_d = parsedHouseData.about.price_d;
        this.about.price_m = parsedHouseData.about.price_m;
        this.about.private = parsedHouseData.about.private;
        this.about.rent = parsedHouseData.about.rent;
        this.about.room = parsedHouseData.about.room;
        this.about.students = parsedHouseData.about.students;
        this.about.woman = parsedHouseData.about.woman;
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }
}
