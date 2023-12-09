import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { CloseMenuService } from 'src/app/services/close-menu.service';
import { UserInfo } from '../../../interface/info';
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
    country: undefined,
    firstName: undefined,
    img: undefined,
    lastName: undefined,
    user_id: '',
    surName: '',
    instagram: '',
    telegram: '',
    viber: '',
    facebook: '',
    mail: '',
    tell: undefined,
    dob: undefined
  };

  userImg: any;
  loading: boolean = false;
  public selectedFlatId: any | null;
  searchInfoUserData: any;
  ratingTenant: number | undefined;
  ratingOwner: number | undefined;
  isCopiedMessage!: string;

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

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private closeMenuService: CloseMenuService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.getInfoUser()
    this.getInfo(),
      this.loading = false;
  }

  sendMenuOpen(closeMenu: boolean) {
    this.closeMenuService.setCloseMenu(closeMenu);
  }

  getInfoUser() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe(
        (response: any) => {
          this.userInfo.user_id = response.inf?.user_id || '';
          this.userInfo.firstName = response.inf?.firstName || '';
          this.userInfo.lastName = response.inf?.lastName || '';
          this.userInfo.surName = response.inf?.surName || '';
          this.userInfo.mail = response.cont.mail || '';
          this.userInfo.dob = response.inf?.dob || '';
          this.userInfo.tell = response.cont?.tell || '';
          this.userInfo.telegram = response.cont?.telegram || '';
          this.userInfo.facebook = response.cont?.facebook || '';
          this.userInfo.instagram = response.cont?.instagram || '';
          this.userInfo.viber = response.cont?.viber || '';
          if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }
          this.getRating();
          this.getRatingOwner();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // пошукові параметри орендара
  async getInfo(): Promise<any> {
    this.loading = true;

    localStorage.removeItem('searchInfoUserData')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/features/get', { auth: JSON.parse(userJson) })
        .subscribe((response: any) => {
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
      user_id: this.userInfo.user_id,
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
        this.ratingTenant = 0;
        // console.log('Орендар не містить оцінок.');
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
      user_id: this.userInfo.user_id,
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
        this.ratingOwner = 0;
        // console.log('Власник не містить оцінок.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Копіювання параметрів
  copyId() { this.copyToClipboard(this.userInfo.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.userInfo.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.userInfo.mail, 'Пошту скопійовано'); }
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => { this.isCopiedMessage = message; setTimeout(() => { this.isCopiedMessage = ''; }, 2000); })
        .catch((error) => { this.isCopiedMessage = ''; });
    }
  }

}
