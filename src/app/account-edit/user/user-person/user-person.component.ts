import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
import { ActivatedRoute, Router } from '@angular/router';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { LyDialog } from '@alyle/ui/dialog';
import { CropImgComponent } from 'src/app/components/crop-img/crop-img.component';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { StorageUserDataService } from 'src/app/services/storageUserData.service';
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

@Component({
  selector: 'app-user-person',
  templateUrl: './user-person.component.html',
  styleUrls: ['./../user-parameters.component.scss'],
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
    animations.top1,
  ],
})

export class UserPersonComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  isLoadingImg: boolean = false;

  goBack(): void {
    this.location.back();
  }

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

  selectedFile!: File;
  userImg: any;
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];
  registrationGoogleInfo: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private _dialog: LyDialog,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
    private storageUserDataService: StorageUserDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.storageUserDataService.getStorageTenantData();
  }

  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getInfo();
    } else {
      this.authorization = false;
    }
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(this.serverPath + '/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          this.userImg = response.img[0].img;
          if (!this.userImg || this.userImg === 'user_default.svg') {
            this.isLoadingImg = false
          }
          this.userInfo = response.inf;
          this.userCont = response.cont;
          const registrationGoogleInfo = localStorage.getItem('registrationGoogleInfo');
          if (registrationGoogleInfo) {
            this.registrationGoogleInfo = JSON.parse(registrationGoogleInfo);
            this.registrationGoogle();
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  async registrationGoogle(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && !this.userInfo.firstName && this.registrationGoogleInfo) {
      this.userInfo.firstName = this.registrationGoogleInfo.firstName || '';
      this.userInfo.lastName = this.registrationGoogleInfo.lastName || '';
      try {
        const data = { ...this.userInfo };
        const response: any = await this.http.post(this.serverPath + '/add/user', { auth: JSON.parse(userJson), new: data }).toPromise();
        if (response.status === true && !this.userCont.mail && this.registrationGoogleInfo.email) {
          this.userCont.mail = this.registrationGoogleInfo.email;
          const data = { ...this.userCont };
          try {
            const response: any = await this.http.post(this.serverPath + '/add/contacts', { auth: JSON.parse(userJson), new: data }).toPromise();
            if (response.status === true) {
              this.sharedService.setStatusMessage('Оновлюємо дані');
              localStorage.removeItem('registrationGoogleInfo');
              this.registrationGoogleInfo = undefined;
              setTimeout(() => {
                this.getInfo();
              }, 1500);
            }
          } catch (error) {
            console.log('Помилка збереження')
          }
        } else {
          localStorage.removeItem('registrationGoogleInfo');
          this.registrationGoogleInfo = undefined;
          this.sharedService.setStatusMessage('Оновлюємо дані');
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      localStorage.removeItem('registrationGoogleInfo');
      this.registrationGoogleInfo = undefined;
    }
  }

  async saveInfoUser(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const dob = moment(this.userInfo.dob).format('YYYY-MM-DD');
        this.userInfo.dob = dob;
        const data = { ...this.userInfo };
        // console.log(data)
        const response: any = await this.http.post(this.serverPath + '/add/user', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.sharedService.setStatusMessage('Персональні дані збережено');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.getInfo();
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка збереження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
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
      formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
      const headers = { 'Accept': 'application/json' };
      try {
        const response: any = await this.http.post(this.serverPath + '/img/uploaduser', formData, { headers }).toPromise();
        if (response.status === 'Збережено') {
          this.sharedService.setStatusMessage('Фото додано');
          this.getInfo();
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка завантаження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

};

