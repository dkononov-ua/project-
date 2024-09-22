import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
import { StorageUserDataService } from 'src/app/services/storageUserData.service';
import { CounterService } from 'src/app/services/counter.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-host-user-page',
  templateUrl: './host-user-page.component.html',
  styleUrls: ['./../../myPage.scss'],
  animations: [
    animations.appearance,
    animations.top1,
    animations.bot,
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
  userFeaturesData: any;
  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;
  authorization: boolean = false;
  subscriptions: any[] = [];
  userData: any;
  titleName: string = 'Профіль користувача Діскусіо';
  counterUserNewMessage: any;

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private location: Location,
    private storageUserDataService: StorageUserDataService,
    private counterService: CounterService,
    private loaderService: LoaderService,
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
      this.getInfoFeaturesUser();
      this.userData = JSON.parse(userData);
      // console.log(this.userData)
    }
  }

  // Беру інформацію користувача
  async getInfoFeaturesUser() {
    const userFeaturesData = localStorage.getItem('searchInfoUserData');
    if (userFeaturesData) {
      const userObject = JSON.parse(userFeaturesData);
      this.userFeaturesData = userObject.inf;
      // console.log(this.userFeaturesData)
    }
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    this.loaderService.setLoading(true)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getUserNewMessage();
      this.loaderService.setLoading(false);
    } else {
      this.authorization = false;
      this.loaderService.setLoading(false);
      // setTimeout(() => {
      //   this.sharedService.logout();
      // }, 200);
    }
  }

  // перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    await this.counterService.getUserNewMessage();
    this.subscriptions.push(
      this.counterService.counterUserNewMessage$.subscribe(data => {
        const counterUserNewMessage: any = data
        if (counterUserNewMessage.status !== false) {
          this.counterUserNewMessage = Number(counterUserNewMessage.status)
          // console.log(data)
        } else {
          this.counterUserNewMessage = 0;
        }
      })
    );
  }

  activateTenantProfile() {
    this.storageUserDataService.activateTenantProfile(this.userFeaturesData);
  }

  deactivateTenantProfile() {
    this.storageUserDataService.deactivateTenantProfile();
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
