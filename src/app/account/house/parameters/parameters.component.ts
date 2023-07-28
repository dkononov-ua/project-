import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

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

  addressHouse: any;
  images: string[] = [];
  flatImg: any = [{ img: "housing_default.svg" }];

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private dataService: DataService, private selectedFlatIdService: SelectedFlatService) { }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            console.log(response)
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

            this.house.agent_id = response.houseData.flat.agent_id;
            this.house.apartment = response.houseData.flat.apartment;
            this.house.city = response.houseData.flat.city;
            this.house.country = response.houseData.flat.country;
            this.about.distance_green = response.houseData.flat.distance_green;
            this.about.distance_metro = response.houseData.flat.distance_metro;
            this.about.distance_parking = response.houseData.flat.distance_parking;
            this.about.distance_shop = response.houseData.flat.distance_shop;
            this.about.distance_stop = response.houseData.flat.distance_stop;
            this.house.flat_id = response.houseData.flat.flat_id;
            this.house.flat_index = response.houseData.flat.flat_index;
            this.house.houseNumber = response.houseData.flat.houseNumber;
            this.house.owner_id = response.houseData.flat.owner_id;
            this.house.region = response.houseData.flat.region;
            this.house.street = response.houseData.flat.street;

            this.param.rooms = response.houseData.param.rooms;
            this.param.repair_status = response.houseData.param.repair_status;
            this.param.area = response.houseData.param.area;
            this.param.kitchen_area = response.houseData.param.kitchen_area;
            this.param.balcony = response.houseData.param.balcony;
            this.param.floor = response.houseData.param.floor;
            this.param.option_flat = response.houseData.param.option_flat;

            this.about.about = response.houseData.about.about;
            this.about.animals = response.houseData.about.animals;
            this.about.bunker = response.houseData.about.bunker;
            this.about.family = response.houseData.about.family;
            this.about.man = response.houseData.about.man;
            this.about.option_pay = response.houseData.about.option_pay;
            this.about.price_d = response.houseData.about.price_d;
            this.about.price_m = response.houseData.about.price_m;
            this.about.private = response.houseData.about.private;
            this.about.rent = response.houseData.about.rent;
            this.about.room = response.houseData.about.room;
            this.about.students = response.houseData.about.students;
            this.about.woman = response.houseData.about.woman;

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
