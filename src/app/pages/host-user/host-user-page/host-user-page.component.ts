import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-host-user-page',
  templateUrl: './host-user-page.component.html',
  styleUrls: ['./host-user-page.component.scss'],
  animations: [
    animations.appearance,
  ],
})
export class HostUserPageComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***

  loading: boolean = false;
  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];
  userData: any;
  titleName: string = 'Профіль користувача Діскусіо';

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private location: Location,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.getUserData();
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
        this.dataService.getInfoUser();
      })
    );
  }

  getUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userData = JSON.parse(userData);
      // console.log(this.userData)
    }
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

}
