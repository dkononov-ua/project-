import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userImg: any;

  public selectedFlatId: any | null;

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
    private: '',
    rent: '',
    live: '',
    who_live: '',
    subscribers: '',
  };

  param = {
    region: '',
    rooms: '',
    repair_status: '',
    area: '',
    kitchen_area: '',
    balcony: '',
    floor: '',
  };

  about = {
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
    price_y: '',
    about: '',
    bunker: '',
  };

  constructor(private dataService: DataService, private http: HttpClient) { }

  rating: number = 5;

  onClick(value: number) {
    this.rating = value;
  }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {

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
          this.about.bunker = response.houseData.about.bunker;
        });

        this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
          .subscribe((response: any) => {
            if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }});
      }
    }
  }
}
