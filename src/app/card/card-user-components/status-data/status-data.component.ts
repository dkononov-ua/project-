import { Component, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { UserInfo } from '../../../interface/info';
import { UsereSearchConfig } from '../../../interface/param-config';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';

@Component({
  selector: 'app-status-data',
  templateUrl: './status-data.component.html',
  styleUrls: ['./status-data.component.scss'],
  animations: [animations.fadeIn, animations.top4,
  ],
})
export class StatusDataComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***
  userInfo: UserInfo = UsereSearchConfig;
  userSearchInfo: UserInfo = UsereSearchConfig;
  statusUserData: any;

  openStatus: boolean = false;
  toogleOpenStatus() {
    this.openStatus = !this.openStatus;
  }

  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];
  currentLocation: string = '';

  constructor(
    private sharedService: SharedService,
    private statusDataService: StatusDataService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    this.checkUserAuthorization();
  }

  // перевірка на девайс
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
      this.getStatusData();
    } else {
      this.authorization = false;
    }
  }

  async getStatusData() {
    this.subscriptions.push(
      this.statusDataService.statusData$.subscribe((data: any) => {
        if (data) { this.userInfo = data; }
      })
    );
  }

}
