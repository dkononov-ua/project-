import { FormBuilder } from '@angular/forms';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { subway } from '../../../shared/subway';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { serverPath, path_logo } from 'src/app/shared/server-config';

interface UserInfo {
  price_of: number | undefined;
  price_to: number | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  area_of: string | undefined;
  area_to: string | undefined;
  repair_status: string | undefined;
  bunker: string | undefined;
  balcony: string | undefined;
  animals: string | undefined;
  distance_metro: string | undefined;
  distance_stop: string | undefined;
  distance_green: string | undefined;
  distance_shop: string | undefined;
  distance_parking: string | undefined;
  option_pay: number | undefined;
  day_counts: number | undefined;
  purpose_rent: string | undefined;
  house: boolean | undefined;
  flat: boolean | undefined;
  room: boolean | undefined;
  looking_woman: number | undefined;
  looking_man: number | undefined;
  agree_search: number | undefined;
  students: boolean | false;
  woman: boolean | false;
  man: boolean | false;
  family: boolean | false;
  days: number | undefined;
  weeks: number | undefined;
  mounths: number | undefined;
  years: number | undefined;
  about: string | undefined;
  metro: string | undefined;
}
@Component({
  selector: 'app-looking',
  templateUrl: './looking.component.html',
  styleUrls: ['./looking.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(200%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(200%)', opacity: 0 }))
      ]),
    ]),
  ],

})

export class LookingComponent implements OnInit {
  path_logo = path_logo;
  userInfo: UserInfo = {
    price_of: 0,
    price_to: 0,
    region: '',
    city: '',
    rooms_of: 0,
    rooms_to: 6,
    area_of: '0.00',
    area_to: '100000.00',
    repair_status: 'Неважливо',
    bunker: 'Неважливо',
    balcony: 'Неважливо',
    animals: '',
    distance_metro: '',
    distance_stop: '',
    distance_green: '',
    distance_shop: '',
    distance_parking: '',
    option_pay: 0,
    house: false,
    flat: false,
    room: false,
    day_counts: 0,
    purpose_rent: 'Неважливо',
    looking_woman: 0,
    looking_man: 0,
    agree_search: 0,
    students: false,
    woman: false,
    man: false,
    family: false,
    days: 0,
    weeks: 0,
    mounths: 0,
    years: 0,
    about: '',
    metro: '',
  };

  loading: boolean = true;
  filteredStations: any[] = [];
  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;
  subway = subway;
  minValue: number = 0;
  maxValue: number = 100000;

  minValueDays: number = 0;
  maxValueDays: number = 31;

  minValueWeeks: number = 0;
  maxValueWeeks: number = 4;

  minValueMounths: number = 0;
  maxValueMounths: number = 11;

  minValueYears: number = 0;
  maxValueYears: number = 3;

  disabled: boolean = true;

  currentStep: number = 1;
  statusMessage: string | undefined;

  changeStep(step: number): void {
    this.currentStep = step;
  }

  calculateTotalDays(): number {
    const days = this.userInfo.days || 0;
    const weeks = this.userInfo.weeks || 0;
    const mounths = this.userInfo.mounths || 0;
    const years = this.userInfo.years || 0;
    const totalDays = days + weeks * 7 + mounths * 30 + years * 365;
    return totalDays;
  }

  saveDayCounts(): void {
    const totalDays = this.calculateTotalDays();
    this.userInfo.day_counts = totalDays > 0 ? totalDays : 0;
  }

  onDayCountsChange(): void {
    this.saveDayCounts();
  }

  constructor(
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
    this.loading = false;
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/features/get', { auth: JSON.parse(userJson) })
        .subscribe((response: any) => {
          console.log(response)
          this.userInfo = response.inf;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveInfo(agree: any): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = {
        agree_search: agree,
        price_of: this.userInfo.price_of,
        price_to: this.userInfo.price_to,
        region: this.userInfo.region,
        city: this.userInfo.city,
        rooms_of: this.userInfo.rooms_of,
        rooms_to: this.userInfo.rooms_to,
        area_of: this.userInfo.area_of,
        area_to: this.userInfo.area_to,
        repair_status: this.userInfo.repair_status,
        bunker: this.userInfo.bunker,
        balcony: this.userInfo.balcony,
        animals: this.userInfo.animals,
        distance_metro: this.userInfo.distance_metro,
        distance_stop: this.userInfo.distance_stop,
        distance_green: this.userInfo.distance_green,
        distance_shop: this.userInfo.distance_shop,
        distance_parking: this.userInfo.distance_parking,
        option_pay: this.userInfo.option_pay,
        day_counts: this.userInfo.day_counts,
        purpose_rent: this.userInfo.purpose_rent,
        house: this.userInfo.house,
        flat: this.userInfo.flat,
        room: this.userInfo.room,
        looking_woman: this.userInfo.looking_woman,
        looking_man: this.userInfo.looking_man,
        students: this.userInfo.students,
        woman: this.userInfo.woman,
        man: this.userInfo.man,
        family: this.userInfo.family,
        days: this.userInfo.days,
        weeks: this.userInfo.weeks,
        mounths: this.userInfo.mounths,
        years: this.userInfo.years,
        about: this.userInfo.about,
        metro: this.userInfo.metro,
      };
      this.http.post(serverPath + '/features/add', { auth: JSON.parse(userJson), new: data })
        .subscribe(
          (response: any) => {
            this.loading = true;
            console.log(data)
            if (this.userInfo && this.userInfo.agree_search === 0) {
              setTimeout(() => {
                this.statusMessage = 'Дані збережено. Огололення НЕ опубліковується!';
                setTimeout(() => {
                  this.router.navigate(['/user/info']);
                }, 3000);
              }, 1000);
            } else if (this.userInfo && this.userInfo.agree_search === 1) {
              setTimeout(() => {
                this.statusMessage = 'Оголошення опубліковане!';
                setTimeout(() => {
                  this.router.navigate(['/user/info']);
                }, 3000);
              }, 1000);
            } else {
              setTimeout(() => {
                this.statusMessage = 'Помилка формування оголошення.';
                setTimeout(() => {
                  location.reload();
                }, 3000);
              }, 1000);
            }
          },
          (error: any) => {
            console.error(error);
            setTimeout(() => {
              this.statusMessage = 'Помилка формування угоди.';
              setTimeout(() => {
                location.reload();
              }, 3000);
            }, 1000);
          }
        );
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  clearInfoCard1(): void {
    this.userInfo.students = false;
    this.userInfo.woman = false;
    this.userInfo.man = false;
    this.userInfo.family = false;
    this.userInfo.region = '';
    this.userInfo.city = '';
    this.userInfo.house = false;
    this.userInfo.flat = false;
    this.userInfo.room = false;
    this.userInfo.looking_woman = 0;
    this.userInfo.looking_man = 0;
    this.userInfo.purpose_rent = 'Неважливо';
    this.userInfo.repair_status = 'Неважливо';
  }

  clearInfoCard2(): void {
    this.userInfo.area_of = '0.00';
    this.userInfo.area_to = '100000.00';
    this.userInfo.rooms_of = 0;
    this.userInfo.rooms_to = 6;
    this.userInfo.distance_metro = '';
    this.userInfo.distance_stop = '';
    this.userInfo.distance_green = '';
    this.userInfo.distance_shop = '';
    this.userInfo.distance_parking = '';
    this.userInfo.bunker = 'Неважливо';
    this.userInfo.balcony = 'Неважливо';
    this.userInfo.animals = 'Неважливо';
  }

  clearInfoCard3(): void {
    this.userInfo.option_pay = 0;
    this.userInfo.price_of = NaN;
    this.userInfo.price_to = NaN;
    this.userInfo.day_counts = 0;
    this.userInfo.days = NaN;
    this.userInfo.weeks = NaN;
    this.userInfo.mounths = NaN;
    this.userInfo.years = NaN;
    this.userInfo.about = '';
    this.userInfo.metro = '';
  }

  // завантаження бази міст
  loadCities() {
    const searchTerm = this.userInfo.region!.toLowerCase();
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );
    const selectedRegionObj = this.filteredRegions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.userInfo.city = '';
  }

  // завантаження бази областей
  loadRegions() {
    const searchTerm = this.userInfo.city!.toLowerCase();
    const selectedRegionObj = this.regions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj
      ? selectedRegionObj.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm)
      )
      : [];

    const selectedCityObj = this.filteredCities.find(city =>
      city.name === this.userInfo.city
    );
  }

  loadStations() {
    if (!this.userInfo) return;
    const searchTerm = this.userInfo.metro!.toLowerCase();
    const subwayStations = subway.find(city => city.name === this.userInfo.city)?.lines;

    this.filteredStations = subwayStations
      ? subwayStations.flatMap(line => line.stations.filter(station => station.name.toLowerCase().includes(searchTerm)))
      : [];
  }

}
