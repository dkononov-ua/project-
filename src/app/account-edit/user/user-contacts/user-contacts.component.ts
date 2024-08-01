import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-user-contacts',
  templateUrl: './user-contacts.component.html',
  styleUrls: ['./../user-parameters.component.scss'],
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

export class UserContactsComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  goBack(): void {
    this.location.back();
  }

  userCont: any;
  userInfo: any;

  phonePattern = '^[0-9]{10}$';
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];

  constructor(
    private http: HttpClient,
    private location: Location,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
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
          this.userInfo = response.inf;
          this.userCont = response.cont;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  async saveInfoCont(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const data = this.userCont;
        const response: any = await this.http.post(this.serverPath + '/add/contacts', { auth: JSON.parse(userJson), new: data }).toPromise();
        if (response.status === true) {
          this.sharedService.setStatusMessage('Контактні дані збережено');
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

};

