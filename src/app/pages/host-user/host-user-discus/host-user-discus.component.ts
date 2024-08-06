import { CounterService } from 'src/app/services/counter.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-host-user-discus',
  templateUrl: './host-user-discus.component.html',
  styleUrls: ['./../../pages.scss'],
})
export class HostUserDiscusComponent implements OnInit {

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  counterUserNewAgree: any;
  // ***

  goBack(): void {
    this.location.back();
  }

  selectedFlatId!: string | null;
  authorization: boolean = false;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  currentLocation: string = '';

  constructor(
    private counterService: CounterService,
    private location: Location,
    private sharedService: SharedService,

  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.currentLocation = this.location.path();
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

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getUserDiscussioCount();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
    } else {
      this.authorization = false;
    }
  }

  // перевірка підписників оселі
  async getUserSubscribersCount() {
    // await this.counterService.getHouseSubscribersCount(0);
    this.subscriptions.push(
      this.counterService.counterUserSubscribers$.subscribe(data => {
        this.counterUserSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок оселі
  async getUserSubscriptionsCount() {
    // await this.counterService.getHouseSubscriptionsCount(0);
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        this.counterUserSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій оселі
  async getUserDiscussioCount() {
    // await this.counterService.getHouseDiscussioCount(0);
    this.subscriptions.push(
      this.counterService.counterUserDiscussio$.subscribe(data => {
        this.counterUserDiscussio = Number(data);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
