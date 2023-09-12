import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';

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
  animals: number;
  distance_metro: number;
  distance_stop: number;
  distance_green: number;
  distance_shop: number;
  distance_parking: number;
  option_pay: number | undefined;
  day_counts: string | undefined;
  purpose_rent: any;
  house: boolean | undefined;
  flat: boolean | undefined;
  room: boolean | undefined;
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
    animals: 0,
    distance_metro: 0,
    distance_stop: 0,
    distance_green: 0,
    distance_shop: 0,
    distance_parking: 0,
    option_pay: 0,
    house: false,
    flat: false,
    room: false,
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
  };

  userImg: any;
  loading: boolean = true;
  public selectedFlatId: any | null;

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

  animals: { [key: number]: string } = {
    0: 'Без тварин',
    1: 'З котячими',
    2: 'З собачими',
    3: 'З собачими/котячими',
    4: 'Є багато різного',
    5: 'Щось цікавіше',
  }

  constructor(private dataService: DataService, private http: HttpClient) { }

  ngOnInit(): void {
    // Об'єднуємо обидва Observable, і вони будуть виконані паралельно
    forkJoin([
      this.getInfo(),
      this.getInfoUser()
    ]).subscribe(() => {
      // Ця функція виконується, коли обидва Observable завершили свою роботу
      this.loading = false;
    });
  }

  async getInfoUser(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          if (response) {
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
          }

          if (userJson !== null) {
            const user = JSON.parse(userJson);
            user.user_id = this.user.user_id.toString();
            const updatedUserJson = JSON.stringify(user);
            localStorage.setItem('user', updatedUserJson);
          }

        });
    }
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    console.log(userJson)
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

  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/user_default.svg';
  }

}
