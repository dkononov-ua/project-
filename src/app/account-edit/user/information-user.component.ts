import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/MM/YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

registerLocaleData(localeUk);
interface UserInfo {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  surName: string | undefined;
  dob: string | any;
  password: string | undefined;
}
interface UserCont {
  facebook: string | undefined;
  instagram: string | undefined;
  mail: string | undefined;
  telegram: string | undefined;
  user_id: string | undefined;
  viber: string | undefined;
  phone_alt: 0,
  tell: 0,
}
@Component({
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class InformationUserComponent implements OnInit {

  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    surName: '',
    dob: '',
    password: '',
  };

  userCont: UserCont = {
    facebook: '',
    instagram: '',
    mail: '',
    phone_alt: 0,
    telegram: '',
    tell: 0,
    user_id: '',
    viber: '',
  };

  loading = false;
  showPassword = false;
  isPasswordVisible = false;
  passwordType = 'password';

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  errorMessage$ = new Subject<string>();
  selectedFile!: File;
  selectedFlatId: any;
  userImg: any;
  disabled: boolean = true;
  disabledUser: boolean = true;

  phonePattern = '^[0-9]{10}$';

  constructor(private http: HttpClient, private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getInfo();
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          this.userImg = response.img[0].img;
          this.userInfo = response.inf;
          this.userCont = response.cont;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveInfoUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.disabledUser === false) {
      const data = { ...this.userInfo };

      if (this.userInfo.dob) {
        data.dob = moment(this.userInfo.dob._i).format('YYYY-MM-DD');
      }

      this.http.post('http://localhost:3000/add/user', { auth: JSON.parse(userJson), new: data })
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
        });
      this.disabledUser = true;

    } else {
      console.log('user not found, the form is blocked');
    }
  }
  saveInfoCont(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.disabled === false) {
      const data = this.userCont;
      this.http.post('http://localhost:3000/add/contacts', { auth: JSON.parse(userJson), new: data })
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
        });
      this.disabled = true;
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  editInfoUser(): void {
    this.disabledUser = false;
  }

  editInfoCont(): void {
    this.disabled = false;
  }

  clearInfoUser(): void {
    if (this.disabledUser === false)
    this.userInfo = {
      firstName: '',
      lastName: '',
      email: '',
      surName: '',
      dob: '',
      password: '',
    };
  }

  clearInfoCont(): void {
    if (this.disabled === false)
      this.userCont = {
        facebook: '',
        instagram: '',
        mail: '',
        phone_alt: 0,
        telegram: '',
        tell: 0,
        user_id: '',
        viber: '',
      };
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  };

  logout() {
    this.authService.logout();
    setTimeout(() => {
      this.reloadPageWithLoader();
    },);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    setTimeout(() => {
      this.onUpload();
      this.reloadPageWithLoader();
    },);
  }

  onUpload(): void {
    const userJson = localStorage.getItem('user');

    if (!this.selectedFile) {
      console.log('Файл не обраний. Завантаження не відбудеться.');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('auth', JSON.stringify(JSON.parse(userJson!)));

    const headers = { 'Accept': 'application/json' };
    this.http.post('http://localhost:3000/img/uploaduser', formData, { headers }).subscribe(
      (data: any) => {
        this.userImg = data.imgUrl;
        setTimeout(() => {
          this.reloadPageWithLoader();
        },);
      },
      error => console.log(error)
    );
  }

};
