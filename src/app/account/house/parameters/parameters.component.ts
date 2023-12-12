import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { HouseInfo } from '../../../interface/info';
import { HouseConfig } from '../../../interface/param-config';
import { Options, Distance, Animals, CheckBox, OptionPay } from '../../../interface/name';
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
  HouseInfo: HouseInfo = HouseConfig;
  options: { [key: number]: string } = Options;
  aboutDistance: { [key: number]: string } = Distance;
  animals: { [key: number]: string } = Animals;
  checkBox: { [key: number]: string } = CheckBox;
  option_pay: { [key: number]: string } = OptionPay;
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
