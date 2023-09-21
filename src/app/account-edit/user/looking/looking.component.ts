import { Subscription, debounceTime } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { subway } from '../../../shared/subway';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

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
  distance_metro: number | undefined;
  distance_stop: number | undefined;
  distance_green: number | undefined;
  distance_shop: number | undefined;
  distance_parking: number | undefined;
  option_pay: number | undefined;
  day_counts: number | undefined;
  purpose_rent: string | undefined;
  house: boolean | undefined;
  flat: boolean | undefined;
  room: boolean | undefined;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
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
        style({ transform: 'translateX(100%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ]),
  ],
})

export class LookingComponent implements OnInit {

  userInfo: UserInfo = {
    price_of: 0,
    price_to: 0,
    region: '',
    city: '',
    rooms_of: 0,
    rooms_to: 0,
    area_of: '',
    area_to: '',
    repair_status: '',
    bunker: '',
    balcony: '',
    animals: '',
    distance_metro: 0,
    distance_stop: 0,
    distance_green: 0,
    distance_shop: 0,
    distance_parking: 0,
    option_pay: 0,
    house: false,
    flat: false,
    room: false,
    day_counts: 0,
    purpose_rent: '',
    looking_woman: false,
    looking_man: false,
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

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
    this.loading = false;
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/features/get', { auth: JSON.parse(userJson) })
        .subscribe((response: any) => {
          this.userInfo = response.inf;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveInfo(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { ...this.userInfo };
      console.log(data);
      console.log(this.userInfo.agree_search)

      this.http.post('http://localhost:3000/features/add', { auth: JSON.parse(userJson), new: data })
        .subscribe(
          (response: any) => {
            this.loading = true;

            if (this.userInfo && this.userInfo.agree_search === 0) {
              setTimeout(() => {
                this.statusMessage = 'Дані збережено. Огололення НЕ опубліковується!';
                setTimeout(() => {
                  this.router.navigate(['/user/info']);
                }, 2000);
              }, 2000);
            } else if (this.userInfo && this.userInfo.agree_search === 1) {
              setTimeout(() => {
                this.statusMessage = 'Оголошення опубліковане!';
                setTimeout(() => {
                  this.router.navigate(['/user/info']);
                }, 3000);
              }, 2000);
            } else {
              setTimeout(() => {
                this.statusMessage = 'Помилка формування оголошення.';
                setTimeout(() => {
                  location.reload();
                }, 2000);
              }, 2000);
            }
          },
          (error: any) => {
            console.error(error);
            setTimeout(() => {
              this.statusMessage = 'Помилка формування угоди.';
              setTimeout(() => {
                location.reload();
              }, 2000);
            }, 2000);
          }
        );
    } else {
      console.log('user not found, the form is blocked');
    }
  }


  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    if (this.disabled === false)
      this.userInfo = {
        price_of: 0,
        price_to: 0,
        region: '',
        city: '',
        rooms_of: 0,
        rooms_to: 0,
        area_of: '',
        area_to: '',
        repair_status: '',
        bunker: '',
        balcony: '',
        animals: '',
        distance_metro: 0,
        distance_stop: 0,
        distance_green: 0,
        distance_shop: 0,
        distance_parking: 0,
        option_pay: 0,
        house: false,
        flat: false,
        room: false,
        day_counts: 0,
        purpose_rent: '',
        looking_woman: false,
        looking_man: false,
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
  }

  loadCities() {
    if (!this.userInfo) return;
    const searchTerm = this.userInfo.region?.toLowerCase() || '';
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );
    const selectedRegionObj = this.filteredRegions.find(region =>
      region.name === this.userInfo.region
    );
    this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.userInfo.city = '';
  }

  loadDistricts() {
    if (!this.userInfo) return;
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
