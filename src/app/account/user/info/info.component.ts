import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { CloseMenuService } from 'src/app/services/close-menu.service';

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
  distance_metro: number;
  distance_stop: number;
  distance_green: number;
  distance_shop: number;
  distance_parking: number;
  option_pay: number | undefined;
  day_counts: string | undefined;
  purpose_rent: any;
  house: number | undefined;
  flat: number | undefined;
  room: number | undefined;
  looking_woman: boolean | undefined;
  looking_man: boolean | undefined;
  agree_search: number | undefined;
  students: number | undefined;
  woman: number | undefined;
  man: number | undefined;
  family: number | undefined;
  days: number | undefined;
  weeks: number | undefined;
  mounths: number | undefined;
  years: number | undefined;
  about: string | undefined;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
})
export class InfoComponent implements OnInit {
  indexPage: number = 1;

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;

  userInfo: UserInfo = {
    price_of: 0,
    price_to: 0,
    region: '',
    city: '',
    rooms_of: 0,
    rooms_to: 0,
    area_of: '0',
    area_to: '0',
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
    house: 0,
    flat: 0,
    room: 0,
    day_counts: '',
    purpose_rent: '',
    looking_woman: false,
    looking_man: false,
    agree_search: 0,
    students: 0,
    woman: 0,
    man: 0,
    family: 0,
    days: 0,
    weeks: 0,
    mounths: 0,
    years: 0,

    about: '',
  };

  userImg: any;
  loading: boolean = true;
  public selectedFlatId: any | null;
  searchInfoUserData: any;
  ratingTenant: number | undefined;
  ratingOwner: number | undefined;


  user = {
    user_id: '',
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

  purpose: { [key: number]: string } = {
    0: 'Переїзд',
    1: 'Відряджання',
    2: 'Подорож',
    3: 'Навчання',
    4: 'Особисті причини',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    5: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
  }

  animals: { [key: string]: string } = {
    '0': 'Без тварин',
    '1': 'З тваринами',
    '2': 'Тільки котики',
    '3': 'Тільки песики',
  }

  showMenu: boolean = false;
  userData: any;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private closeMenuService: CloseMenuService,
  ) { }

  ngOnInit(): void {
    this.getInfoUser()
    this.getInfo(),
    this.loading = false;
  }

  sendMenuOpen(closeMenu: boolean) {
    this.closeMenuService.setCloseMenu(closeMenu);
  }

  getInfoUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe(
        (response: any) => {
          this.user.user_id = response.inf?.user_id || '';
          this.user.firstName = response.inf?.firstName || '';
          this.user.lastName = response.inf?.lastName || '';
          this.user.surName = response.inf?.surName || '';
          this.user.email = response.inf?.email || '';
          this.user.password = response.inf?.password || '';
          this.user.dob = response.inf?.dob || '';
          this.user.tell = response.cont?.tell || '';
          this.user.telegram = response.cont?.telegram || '';
          this.user.facebook = response.cont?.facebook || '';
          this.user.instagram = response.cont?.instagram || '';
          this.user.mail = response.cont?.mail || '';
          this.user.viber = response.cont?.viber || '';
          if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }
          this.getRating();
          this.getRatingOwner()
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // інформація про орендара
  // async getInfoUser(): Promise<any> {
  //   const userJson = localStorage.getItem('user');
  //   if (userJson !== null) {
  //     this.http.post(serverPath + '/userinfo', JSON.parse(userJson))
  //       .subscribe((response: any) => {
  //         if (response) {
  //           console.log(response)
  //           this.user.user_id = response.inf?.user_id || '';
  //           this.user.firstName = response.inf?.firstName || '';
  //           this.user.lastName = response.inf?.lastName || '';
  //           this.user.surName = response.inf?.surName || '';
  //           this.user.email = response.inf?.email || '';
  //           this.user.password = response.inf?.password || '';
  //           this.user.dob = response.inf?.dob || '';
  //           this.user.tell = response.cont?.tell || '';
  //           this.user.telegram = response.cont?.telegram || '';
  //           this.user.facebook = response.cont?.facebook || '';
  //           this.user.instagram = response.cont?.instagram || '';
  //           this.user.mail = response.cont?.mail || '';
  //           this.user.viber = response.cont?.viber || '';
  //           if (response.img && response.img.length > 0) {
  //             this.userImg = response.img[0].img;
  //           }

  //           this.getRating();
  //           this.getRatingOwner()
  //         }

  //         if (userJson !== null) {
  //           const user = JSON.parse(userJson);
  //           user.user_id = this.user.user_id.toString();
  //           const updatedUserJson = JSON.stringify(user);
  //           localStorage.setItem('user', updatedUserJson);
  //         }

  //       });
  //   }
  // }
  // пошукові параметри орендара
  async getInfo(): Promise<any> {
    localStorage.removeItem('searchInfoUserData')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/features/get', { auth: JSON.parse(userJson) })
        .subscribe((response: any) => {
          console.log(response)
          localStorage.setItem('searchInfoUserData', JSON.stringify(response.inf));
          const searchInfoUserData = localStorage.getItem('searchInfoUserData');
          if (searchInfoUserData !== null) {
            this.searchInfoUserData = JSON.parse(searchInfoUserData);
            this.userInfo.price_of = this.searchInfoUserData.price_of;
            this.userInfo.price_to = this.searchInfoUserData.price_to;
            this.userInfo.region = this.searchInfoUserData.region;
            this.userInfo.city = this.searchInfoUserData.city;
            this.userInfo.rooms_of = this.searchInfoUserData.rooms_of;
            this.userInfo.rooms_to = this.searchInfoUserData.rooms_to;
            this.userInfo.area_of = this.searchInfoUserData.area_of === "0.00" ? '' : this.searchInfoUserData.area_of;
            this.userInfo.area_to = this.searchInfoUserData.area_to === "100000.00" ? '' : this.searchInfoUserData.area_to;
            this.userInfo.repair_status = this.searchInfoUserData.repair_status;
            this.userInfo.bunker = this.searchInfoUserData.bunker;
            this.userInfo.balcony = this.searchInfoUserData.balcony;
            this.userInfo.animals = this.searchInfoUserData.animals;
            this.userInfo.distance_metro = this.searchInfoUserData.distance_metro;
            this.userInfo.distance_stop = this.searchInfoUserData.distance_stop;
            this.userInfo.distance_green = this.searchInfoUserData.distance_green;
            this.userInfo.distance_shop = this.searchInfoUserData.distance_shop;
            this.userInfo.distance_parking = this.searchInfoUserData.distance_parking;
            this.userInfo.option_pay = this.searchInfoUserData.option_pay;
            this.userInfo.day_counts = this.searchInfoUserData.day_counts;
            this.userInfo.purpose_rent = this.searchInfoUserData.purpose_rent;
            this.userInfo.house = this.searchInfoUserData.house;
            this.userInfo.flat = this.searchInfoUserData.flat;
            this.userInfo.room = this.searchInfoUserData.room;
            this.userInfo.looking_woman = this.searchInfoUserData.looking_woman;
            this.userInfo.looking_man = this.searchInfoUserData.looking_man;
            this.userInfo.agree_search = this.searchInfoUserData.agree_search;
            this.userInfo.students = this.searchInfoUserData.students;
            this.userInfo.woman = this.searchInfoUserData.woman;
            this.userInfo.man = this.searchInfoUserData.man;
            this.userInfo.family = this.searchInfoUserData.family;
            this.userInfo.days = this.searchInfoUserData.days;
            this.userInfo.weeks = this.searchInfoUserData.weeks;
            this.userInfo.mounths = this.searchInfoUserData.mounths;
            this.userInfo.years = this.searchInfoUserData.years;
            this.userInfo.about = this.searchInfoUserData.about;
          } else {
            this.searchInfoUserData = {};
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }
  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/user_default.svg';
  }
  // рейтинг орендара
  async getRating(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: this.user.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      if (response && Array.isArray(response.status)) {
        let totalMarkTenant = 0;
        response.status.forEach((item: { mark: number; }) => {
          if (item.mark) {
            totalMarkTenant += item.mark;
            this.ratingTenant = totalMarkTenant;
          }
        });
      } else {
        console.log('Орендар не містить оцінок.');
      }
    } catch (error) {
      console.error(error);
    }
  }
  // рейтинг власника
  async getRatingOwner(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/ownerMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: this.user.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      if (response && Array.isArray(response.status)) {
        let totalMarkOwner = 0;
        response.status.forEach((item: { mark: number; }) => {
          if (item.mark) {
            totalMarkOwner += item.mark;
            this.ratingOwner = totalMarkOwner;
          }
        });
      } else {
        console.log('Власник не містить оцінок.');
      }
    } catch (error) {
      console.error(error);
    }
  }

}
