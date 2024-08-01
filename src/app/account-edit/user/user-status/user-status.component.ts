import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

interface UserParam {
  add_in_flat: boolean | false;
  user_id: '',
};
@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
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

export class UserStatusComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  userParam: UserParam = {
    add_in_flat: false,
    user_id: '',
  };

  userInfo: any;

  helpAdd: boolean = false;
  openHelpAdd() {
    this.helpAdd = !this.helpAdd;
  }

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
          this.userParam = response.parametrs;
          this.userInfo = response.inf;
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
        const response: any = await this.http.post(this.serverPath + '/add/params', { auth: JSON.parse(userJson), add_in_flat: this.userParam.add_in_flat }).toPromise();
        if (response.status === true) {
          this.sharedService.setStatusMessage('Налаштування збережено');
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

};

