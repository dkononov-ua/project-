import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-user-parameters',
  templateUrl: './user-parameters.component.html',
  styleUrls: ['./../../pages.scss'],
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
