import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { HouseInfo } from '../../../../interface/info';
import { HouseConfig } from '../../../../interface/param-config';
import { Options, Distance, Animals, CheckBox, OptionPay } from '../../../../interface/name';
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
  rent: any;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;
  authorization: boolean = false;
  houseData: any;

  constructor() { }

  ngOnInit(): void { this.loadDataFlat(); }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        const parsedHouseData = JSON.parse(houseData);
        this.houseData = parsedHouseData;
        if (this.houseData) {
          this.getHouseAcces();
        }
        this.rent = parsedHouseData.about.rent;
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

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      console.log(this.houseData.acces)
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    }
  }
}
