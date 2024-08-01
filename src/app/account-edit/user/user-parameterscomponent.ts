import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
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
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
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
  selector: 'app-user-parameters',
  templateUrl: './user-parameters.component.html',
  styleUrls: ['./user-parameters.component.scss'],
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
    animations.bot,
  ],
})

export class UserParametersComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  page: any;
  emailCheckCode: any;
  agreeToDel: boolean = false;
  sentCode: boolean = false;
  isLoadingImg: boolean = false;
  registrationGoogleInfo: any;

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

  userParam: UserParam = {
    add_in_flat: false,
    user_id: '',
  };

  userData: any;
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private http: HttpClient,
    private location: Location,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
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
    } else {
      this.authorization = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

};
