import { regions } from '../../../data/data-city';
import { cities } from '../../../data/data-city';
import { subway } from '../../../data/subway';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { animations } from '../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { Location } from '@angular/common';
interface UserInfo {
  price_of: number | undefined;
  price_to: number | undefined;
  region: string | undefined;
  city: string | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  area_of: string;
  area_to: string;
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
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
  ],
})

export class LookingComponent implements OnInit {
  @ViewChild('cityInput') cityInput: ElementRef | undefined;
  @ViewChild('regionInput') regionInput: ElementRef | undefined;
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
  selectedCity!: string | undefined;
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
  errorMessage: string | undefined;
  activationUserSearch: boolean = false;
  deactivation: boolean = false;

  changeStep(step: number): void {
    this.indexPage = step;
  }

  // показ карток
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  numConcludedAgree: any;
  selectedAgree: any;
  page: any;
  startX = 0;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  onKeyPress(event: KeyboardEvent, maxLength: number) {
    // Отримайте введене значення
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    // Перевірте, чи введене значення більше заданої довжини
    if (inputValue.length >= maxLength) {
      // Скасуйте подію, якщо введено більше символів, ніж дозволено
      event.preventDefault();
    }
  }

  goBack(): void {
    this.location.back();
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

  help: number = 0;
  toggleHelp(index: number) {
    this.help = index;
  }
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
    private location: Location,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getInfo();
    this.loading = false;
    if (this.isMobile) {
      this.indexPage = 0;
    } else {
      this.indexPage = 1;
    }
  }

  checkRooms() {
    if (this.userInfo.room) {
      this.userInfo.looking_woman = 0;
      this.userInfo.looking_man = 0;
    }
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }
  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.router.navigate(['/user/info']);
      }
    } else {
      if (this.indexPage <= 2) {
        this.indexPage++;
      }
    }
  }

  // отримуємо інформацію про наш профіль орендаря
  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      try {
        const response: any = await this.http.post(serverPath + '/features/get', { auth: JSON.parse(userJson) }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.userInfo = response.inf;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // console.log('Авторизуйтесь')
      this.sharedService.logout();
    }
  }

  async saveInfo(agree: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        if (this.userInfo.option_pay === 2) {
          this.userInfo.price_of = 0.01;
          this.userInfo.price_to = 0.01;
        }
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
        // console.log(data)
        const response: any = await this.http.post(serverPath + '/features/add', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          // результат якщо я натискаю деактивувати оголошення
          if (this.userInfo.agree_search === 0 && this.deactivation) {
            setTimeout(() => {
              this.sharedService.setStatusMessage('Деактивовано!');
              this.deactivation = false;
              setTimeout(() => {
                // this.router.navigate(['/user/info']);
                this.sharedService.setStatusMessage('');
                location.reload();
              }, 3000);
            }, 1000);
          }
          // результат якщо я натискаю зберегти
          if (this.userInfo.agree_search === 0 && !this.deactivation) {
            this.sharedService.setStatusMessage('Збережено!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оголошення не активовано');
              setTimeout(() => {
                // this.router.navigate(['/user/info']);
                this.sharedService.setStatusMessage('');
                location.reload();
              }, 2000);
            }, 2000);
          }
          // результат якщо я натискаю активувати оголошення
          if (this.userInfo.agree_search === 1) {
            setTimeout(() => {
              this.sharedService.setStatusMessage('Активовано!');
              setTimeout(() => {
                // this.router.navigate(['/user/info']);
                this.sharedService.setStatusMessage('');
                location.reload();
              }, 3000);
            }, 1000);
          }
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка формування');
            setTimeout(() => {
              location.reload();
            }, 3000);
          }, 1000);
        }

      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка на сервері, повторіть спробу');
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
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
    this.userInfo.distance_metro = undefined;
    this.userInfo.distance_stop = undefined;
    this.userInfo.distance_green = undefined;
    this.userInfo.distance_shop = undefined;
    this.userInfo.distance_parking = undefined;
    this.userInfo.bunker = 'Неважливо';
    this.userInfo.balcony = 'Неважливо';
    this.userInfo.animals = 'Неважливо';
  }

  clearInfoCard3(): void {
    this.userInfo.option_pay = 0;
    this.userInfo.price_of = undefined;
    this.userInfo.price_to = undefined;
    this.userInfo.day_counts = 0;
    this.userInfo.days = undefined;
    this.userInfo.weeks = undefined;
    this.userInfo.mounths = undefined;
    this.userInfo.years = undefined;
    this.userInfo.about = '';
    this.userInfo.metro = '';
  }

  // завантаження бази областей
  loadRegions() {
    if (this.userInfo.region) {
      const searchTerm = this.userInfo.region!.toLowerCase();
      this.filteredRegions = this.regions.filter(region =>
        region.name.toLowerCase().includes(searchTerm)
      );
      const selectedRegionObj = this.filteredRegions.find(region =>
        region.name === this.userInfo.region
      );
      this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
      this.userInfo.city = '';
      if (this.userInfo.region) {
        this.loadCities();
      }
    }
  }

  // завантаження бази міст
  loadCities() {
    const searchTerm = this.userInfo.city!.toLowerCase();
    const selectedRegionObj = this.regions.find(region =>
      region.name === this.userInfo.region
    );
    if (selectedRegionObj) {
      this.filteredCities = selectedRegionObj.cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm)
      );
      this.errorMessage = 'Оберіть місто';
      // console.log(this.errorMessage)
    } else {
      // Якщо область не знайдена, показати повідомлення про помилку
      this.errorMessage = 'Оберіть правильну область';
      return;
    }
    const selectedCityObj = this.filteredCities.find(city =>
      city.name === this.userInfo.city
    );
    if (!selectedCityObj) {
      // Якщо місто не знайдено у вибраній області, показати повідомлення про помилку
      this.errorMessage = 'Оберіть місто';
      return;
    }
  }

  // підвантажую станції метро з бази даних
  // loadStations() {
  //   if (!this.userInfo) return;
  //   const searchTerm = this.userInfo.metro!.toLowerCase();
  //   const subwayStations = subway.find(city => city.name === this.userInfo.city)?.lines;
  //   this.filteredStations = subwayStations
  //     ? subwayStations.flatMap(line => line.stations.filter(station => station.name.toLowerCase().includes(searchTerm)))
  //     : [];
  // }

  // активую оголошення
  async ativationBtn(): Promise<void> {
    // чекаю перевірки на те чи внесли ми всі важливі поля
    const isUserSearchActivated = await this.checkAtivationUserSearch();
    if (isUserSearchActivated) {
      // console.log('Активую оголошення')
      this.activationUserSearch = true;
      this.sharedService.setStatusMessage('Активую оголошення');
      this.saveInfo(this.userInfo.agree_search = 1);
    }
  }

  // деактивуємо оголошення
  deactivationBtn() {
    this.sharedService.setStatusMessage('Деактивую...');
    this.deactivation = true;
    this.saveInfo(this.userInfo.agree_search = 0)
  }

  // робимо клік на поле там де треба вносити інформацію
  triggerInputClick(input: string): void {
    if (input === 'region' && this.regionInput) {
      this.regionInput.nativeElement.click();
    } else if (input === 'city' && this.cityInput) {
      this.cityInput.nativeElement.click();
    }
  }

  // перевіряємо поля без яких оголошення не буде відображатись в пошуку
  async checkAtivationUserSearch(): Promise<boolean> {
    this.errorMessage = '';
    if (!this.userInfo.region || this.userInfo.region === '') {
      this.activationUserSearch = false;
      this.sharedService.setStatusMessage('Треба вказати область');
      this.indexPage = 2;
      setTimeout(() => {
        this.errorMessage = 'Оберіть правильну область';
        this.sharedService.setStatusMessage('');
        this.triggerInputClick('region');
      }, 1500);
    } else if (!this.userInfo.city || this.userInfo.city === '') {
      this.indexPage = 2;
      this.activationUserSearch = false;
      this.sharedService.setStatusMessage('Треба вказати місто');
      setTimeout(() => {
        this.errorMessage = 'Оберіть місто';
        this.triggerInputClick('city');
        this.sharedService.setStatusMessage('');
      }, 1500);
    } else if (this.userInfo.option_pay === undefined || this.userInfo.option_pay === null) {
      this.activationUserSearch = false;
      this.sharedService.setStatusMessage('Треба вказати варіант оплати');
      setTimeout(() => {
        this.errorMessage = 'Оберіть варіант оплати';
        this.sharedService.setStatusMessage('');
      }, 1500);
    } else if (this.userInfo.region && this.userInfo.city && this.userInfo.option_pay !== undefined && this.userInfo.option_pay !== null) {
      this.activationUserSearch = true;
    }
    return this.activationUserSearch;
  }

}
