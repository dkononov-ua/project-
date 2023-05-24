import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';


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
    100: 'до 100м',
    300: 'до 300м',
    500: 'до 500м',
    1000: 'до 1км',
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
    price_y: Number(''),
    about: '',
    bunker: Number(''),
  };

  addressHouse: any;
  images: string[] = [];
  flatImg: any = [{ img: "housing_default.svg" }];

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private dataService: DataService) { }

  ngOnInit(): void {
    console.log('Пройшла перевірка користувача');
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            this.user.firstName = response.userData.inf.firstName;
            this.user.lastName = response.userData.inf.lastName;
            this.user.surName = response.userData.inf.surName;
            this.user.email = response.userData.inf.email;
            this.user.password = response.userData.inf.password;
            this.user.dob = response.userData.inf.dob;

            this.user.tell = response.userData.cont.tell;
            this.user.telegram = response.userData.cont.telegram;
            this.user.facebook = response.userData.cont.facebook;
            this.user.instagram = response.userData.cont.instagram;
            this.user.mail = response.userData.cont.mail;
            this.user.viber = response.userData.cont.viber;

            this.house.region = response.houseData.flat.region;
            this.house.flat_id = response.houseData.flat.flat_id;
            this.house.country = response.houseData.flat.country;
            this.house.city = response.houseData.flat.city;
            this.house.street = response.houseData.flat.street;
            this.house.houseNumber = response.houseData.flat.houseNumber;
            this.house.apartment = response.houseData.flat.apartment;
            this.house.flat_index = response.houseData.flat.flat_index;
            this.house.private = response.houseData.flat.private;
            this.house.rent = response.houseData.flat.rent;
            this.house.live = response.houseData.flat.live;
            this.house.who_live = response.houseData.flat.who_live;
            this.house.subscribers = response.houseData.flat.subscribers;

            this.param.rooms = response.houseData.param.rooms;
            this.param.repair_status = response.houseData.param.repair_status;
            this.param.area = response.houseData.param.area;
            this.param.kitchen_area = response.houseData.param.kitchen_area;
            this.param.balcony = response.houseData.param.balcony;
            this.param.floor = response.houseData.param.floor;

            this.about.distance_metro = response.houseData.about.distance_metro;
            this.about.distance_stop = response.houseData.about.distance_stop;
            this.about.distance_shop = response.houseData.about.distance_shop;
            this.about.distance_green = response.houseData.about.distance_green;
            this.about.distance_parking = response.houseData.about.distance_parking;
            this.about.woman = response.houseData.about.woman;
            this.about.man = response.houseData.about.man;
            this.about.family = response.houseData.about.family;
            this.about.students = response.houseData.about.students;
            this.about.animals = response.houseData.about.animals;
            this.about.price_m = response.houseData.about.price_m;
            this.about.price_y = response.houseData.about.price_y;
            this.about.about = response.houseData.about.about;
            this.about.bunker = response.houseData.about.bunker;

            if (response.houseData.imgs !== 'Картинок нема') {
              this.flatImg = response.houseData.imgs;
            }

            if (this.flatImg !== undefined && Array.isArray(this.flatImg) && this.flatImg.length > 0 && response.houseData.imgs !== 'Картинок нема') {
              for (const img of this.flatImg) {
                this.images.push('http://localhost:3000/img/flat/' + img.img);
              }
            } else {
              this.images.push('http://localhost:3000/housing_default.svg');
            }

          } else {
            console.error('houseData field is missing from server response');
          }
        });
      }
    }
  }

}
