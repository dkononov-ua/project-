import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { ActivatedRoute, Router } from '@angular/router';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { animations } from '../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
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

interface UserInfo {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  surName: string | undefined;
  dob: string | any;
  password: string | undefined;
  agreeAdd: boolean | false;
  user_mail: string | undefined;
  data_create: string | undefined;
  banned: number;
  checked: number;
  data_unban: string | undefined;
  owner: string | undefined;
}
interface UserCont {
  facebook: string | undefined;
  instagram: string | undefined;
  mail: string | undefined;
  email: string | undefined;
  telegram: string | undefined;
  user_id: string | undefined;
  viber: string | undefined;
  phone_alt: 0,
  tell: 0,
}
interface UserParam {
  add_in_flat: boolean | false;
  user_id: '',
};
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
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})

export class InformationUserComponent implements OnInit {
  page: any;
  emailCheckCode: any;
  agreeToDel: boolean = false;
  sentCode: boolean = false;
  isLoadingImg: boolean = false;
  registrationGoogleInfo: any;

  extractUsernameFromUrl(url: string): string {
    // Ваш регулярний вираз для витягування імені користувача
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|instagram\.com|telegram\.me)\/([a-zA-Z0-9._]+)/;

    // Витягнути ім'я користувача з посилання
    const match = url.match(regex);

    // Повернути ім'я користувача, якщо знайдено, або пустий рядок
    return match ? match[1] : '';
  }

  goBack(): void {
    this.location.back();
  }
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }
  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  userInfo: UserInfo = {
    agreeAdd: false,
    firstName: '',
    lastName: '',
    email: '',
    surName: '',
    dob: '',
    password: '',
    user_mail: '',
    data_create: '',
    banned: 0,
    checked: 0,
    data_unban: '',
    owner: '',
  };

  userCont: UserCont = {
    facebook: '',
    instagram: '',
    email: '',
    mail: '',
    phone_alt: 0,
    telegram: '',
    tell: 0,
    user_id: '',
    viber: '',
  };

  userParam: UserParam = {
    add_in_flat: false,
    user_id: '',
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

  selectedFile!: File;
  selectedFlatId: any;
  userImg: any;
  disabledPassword: boolean = true;
  disabledEmail: boolean = true;
  emailCheck: number = 0;
  passwordCheck: number = 0;
  checkCode: any;
  statusMessage: string | undefined;
  indexPage: number = 0;

  sendCodeEmail() {
    this.emailCheck = 1;
    // відправити код для підтвердження
  }

  confirmCodeEmail() {
    this.emailCheck = 2;
    this.userInfo.email = '';
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodeNewEmail() {
    this.emailCheck = 3;
    // перевірити та підтвердити код, переписуємо пошту
  }

  confirmCodeNewEmail() {
    this.emailCheck = 0;
    this.getInfo();
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodePassword() {
    this.passwordCheck = 1;
    // відправити код для підтвердження
  }

  confirmCodePassword() {
    this.passwordCheck = 2;
    this.userInfo.password = '';
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodeNewPassword() {
    this.passwordCheck = 0;
    this.getInfo();
  }

  isAccountOpenStatus: boolean = true;
  helpAdd: boolean = false;
  openHelpAdd() {
    this.helpAdd = !this.helpAdd;
  }
  phonePattern = '^[0-9]{10}$';
  startX = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _dialog: LyDialog,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
    await this.getInfo();
  }

  async registrationGoogle(): Promise<any> {
    const registrationGoogleInfo = localStorage.getItem('registrationGoogleInfo');
    const userJson = localStorage.getItem('user');
    if (userJson) {
      if (!this.userInfo.firstName && registrationGoogleInfo) {
        this.registrationGoogleInfo = JSON.parse(registrationGoogleInfo);
        this.userInfo.firstName = this.registrationGoogleInfo.firstName || '';
        this.userInfo.lastName = this.registrationGoogleInfo.lastName || '';
        this.userInfo.user_mail = this.registrationGoogleInfo.email || '';
        try {
          const data = { ...this.userInfo };
          console.log(data)
          const response: any = await this.http.post(serverPath + '/add/user', { auth: JSON.parse(userJson), new: data }).toPromise();
          console.log(response)
          if (response.status === true) {

          } else {

          }
        } catch (error) {

        }
      } else {
        localStorage.removeItem('registrationGoogleInfo');
        this.registrationGoogleInfo = undefined;
      }
      if (!this.userCont.mail && registrationGoogleInfo) {
        this.registrationGoogleInfo = JSON.parse(registrationGoogleInfo);
        this.userCont.mail = this.registrationGoogleInfo.email;
        try {
          const data = { ...this.userInfo };
          console.log(data)
          const response: any = await this.http.post(serverPath + '/add/contacts', { auth: JSON.parse(userJson), new: data }).toPromise();
          console.log(response)
          if (response.status === true) {

          } else {
            localStorage.removeItem('registrationGoogleInfo');
            this.registrationGoogleInfo = undefined;

          }
        } catch (error) {

        }
      } else {
        localStorage.removeItem('registrationGoogleInfo');
        this.registrationGoogleInfo = undefined;
      }
      // console.log(this.registrationGoogleInfo)
      // console.log(localStorage.getItem('registrationGoogleInfo'))
    } else {
      localStorage.removeItem('registrationGoogleInfo');
      this.registrationGoogleInfo = undefined;
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

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          // console.log(response)
          this.userImg = response.img[0].img;
          if (!this.userImg || this.userImg === 'user_default.svg') {
            this.isLoadingImg = false
          }
          this.userInfo = response.inf;
          this.userCont = response.cont;
          this.userParam = response.parametrs;
          this.registrationGoogle();
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  async saveParamsUser(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        // const data = { ...this.userInfo };
        const response: any = await this.http.post(serverPath + '/add/params', { auth: JSON.parse(userJson), add_in_flat: this.userParam.add_in_flat }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.sharedService.setStatusMessage('Налаштування збережено');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка збереження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
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

  async saveInfoUser(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        const dob = moment(this.userInfo.dob).format('YYYY-MM-DD');
        this.userInfo.dob = dob;
        const data = { ...this.userInfo };
        // console.log(data)
        const response: any = await this.http.post(serverPath + '/add/user', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.sharedService.setStatusMessage('Персональні дані збережено');
          setTimeout(() => {
            this.indexPage = 1;
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка збереження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
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

  async saveInfoCont(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        const data = this.userCont;
        console.log(data)
        const response: any = await this.http.post(serverPath + '/add/contacts', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.sharedService.setStatusMessage('Контактні дані збережено');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
            this.router.navigate(['/looking']);
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка збереження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
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

  descriptionVisibility: { [key: string]: boolean } = {};
  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }

  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  clearInfoCont(): void {
    this.userCont = {
      facebook: '',
      instagram: '',
      email: '',
      mail: '',
      phone_alt: 0,
      telegram: '',
      tell: 0,
      user_id: '',
      viber: '',
    };
  }

  logout() {
    this.sharedService.clearCache();
    this.sharedService.setStatusMessage('Виходимо з аккаунту');
    setTimeout(() => {
      this.sharedService.setStatusMessage('');
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);
    }, 1500);
  }

  openCropperDialog(event: Event) {
    this._dialog.open<CropImgComponent, Event>(CropImgComponent, {
      data: event,
      width: 400,
      disableClose: true
    }).afterClosed.subscribe((result?: ImgCropperEvent) => {
      if (result) {
        const blob = this.dataURItoBlob(result.dataURL!);
        const formData = new FormData();
        formData.append('file', blob, result.name!);
        // console.log(formData)
        this.setPhoto(formData);
      }
    });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  async setPhoto(formData: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && formData) {
      this.loading = true;
      formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
      const headers = { 'Accept': 'application/json' };
      try {
        const response: any = await this.http.post(serverPath + '/img/uploaduser', formData, { headers }).toPromise();
        if (response.status === 'Збережено') {
          this.sharedService.setStatusMessage('Фото додано');
          this.getInfo();
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка завантаження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
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

  async deleteAcc(): Promise<void> {
    const userJson = localStorage.getItem('user');
    this.loading = true;
    if (userJson) {
      try {
        const response: any = await this.http.post(serverPath + '/userinfo/delete/finaly', { auth: JSON.parse(userJson), code: this.emailCheckCode }).toPromise();
        // console.log(response)
        if (response.status === 'Видалено') {
          this.sharedService.setStatusMessage('Аккаунт видалено');
          this.sharedService.clearCache();
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
            this.router.navigate(['/auth/registration']);
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка видалення');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
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

  sendCodeForDelAcc() {
    const userJson = localStorage.getItem('user');
    // this.loading = true;
    const data = {
      email: this.userInfo.user_mail,
    };
    this.sentCode = true;
    if (userJson) {
      try {
        // console.log(data);
        this.http.post(serverPath + '/userinfo/delete/first', { auth: JSON.parse(userJson) })
          .subscribe((response: any) => {
            // console.log(response)
            if (response.status === 'На вашу пошту було надіслано код безпеки') {
              this.sentCode = true;
              this.sharedService.setStatusMessage('На вашу пошту було надіслано код безпеки');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
                this.loading = false;
              }, 2000);
            } else {
              this.sentCode = false;
              this.sharedService.setStatusMessage('Помилка надсилання коду безпеки');
              setTimeout(() => {
                location.reload();
              }, 2000);
            }
          });
      } catch (error) {
        this.sentCode = false;
        this.sharedService.setStatusMessage('Сталася помилка на сервері');
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    }

  }


};
