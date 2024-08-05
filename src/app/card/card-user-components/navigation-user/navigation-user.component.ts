import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StorageUserDataService } from 'src/app/services/storageUserData.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-navigation-user',
  templateUrl: './navigation-user.component.html',
  styleUrls: ['./navigation-user.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ]),
    trigger('cardAnimationUp', [
      transition('void => *', [
        style({ transform: 'translateY(-30vh)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(-30vh)' }))
      ]),
    ]),
    animations.appearance,

  ],
})

export class NavigationUserComponent implements OnInit, OnDestroy {

  disabledBtn: boolean = false;
  userData: any;
  userFeaturesData: any;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  authorization: boolean = false;
  section: boolean[] = [false, false, false, false, false, false, false, false, false];
  currentLocation: string = '';

  // відкриття меню через сервіс
  async closeToogleMenu(index: number) {
    this.menuService.indexMenu(index);
  }

  constructor(
    private counterService: CounterService,
    private sharedService: SharedService,
    private location: Location,
    private router: Router,
    private menuService: MenuService,
    private storageUserDataService: StorageUserDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentLocation = event.urlAfterRedirects;
      this.checkLocation();
    });
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.checkLocation();
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getInfoUser();
      this.getInfoFeaturesUser();
      await this.getUserDiscussioCount();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserNewMessage();
    } else {
      this.authorization = false;
    }
  }

  checkLocation() {
    this.currentLocation = this.location.path();
    if (this.currentLocation.includes('/user/info')) {
      this.setSection(1);
    } else if (this.currentLocation.includes('/user/agree')) {
      this.setSection(2);
    } else if (this.currentLocation.includes('/user/tenant')) {
      this.setSection(3);
    } else if (this.currentLocation.includes('/user/discus')) {
      this.setSection(4);
    } else if (this.currentLocation.includes('/chat-user')) {
      this.setSection(5);
    } else if (this.currentLocation.includes('/user/edit')) {
      this.setSection(6);
    } else if (this.currentLocation.includes('/user/search')) {
      this.setSection(7);
    } else {
      this.setSection(-1); // вимикає всі секції, якщо шлях не відповідає жодному з умов
    }
  }

  setSection(index: number) {
    this.section = this.section.map((_, i) => i === index);
  }

  // Беру інформацію користувача
  async getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.userData = userObject;
    } else if (!userData) {
      setTimeout(() => {
        this.getInfoUser();
      }, 100);
    }
  }

  // Беру інформацію користувача
  async getInfoFeaturesUser() {
    const userFeaturesData = localStorage.getItem('userFeaturesData');
    if (userFeaturesData) {
      const userObject = JSON.parse(userFeaturesData);
      this.userFeaturesData = userObject;
    }
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

  // перевірка підписників користувача
  async getUserSubscribersCount() {
    await this.counterService.getUserSubscribersCount();
    this.subscriptions.push(
      this.counterService.counterUserSubscribers$.subscribe(data => {
        this.counterUserSubscribers = Number(data);
      })
    );
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    await this.counterService.getUserSubscriptionsCount();
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        this.counterUserSubscriptions = Number(data);
      })
    );
  }

  // перевірка дискусій користувача
  async getUserDiscussioCount() {
    await this.counterService.getUserDiscussioCount();
    this.subscriptions.push(
      this.counterService.counterUserDiscussio$.subscribe(data => {
        this.counterUserDiscussio = Number(data);
      })
    );
  }

  // перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    await this.counterService.getUserNewMessage();
    this.subscriptions.push(
      this.counterService.counterUserNewMessage$.subscribe(data => {
        this.counterUserNewMessage = Number(data)
      })
    );
  }

  deactivateTenantProfile() {
    this.storageUserDataService.deactivateTenantProfile();
    this.closeToogleMenu(3)
  }

  logout() {
    this.sharedService.logoutUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}



