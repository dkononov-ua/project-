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
  styleUrls: ['./../../navigation.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateX(-100%)' }))
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
  currentSectionIndex: number = -1;


  closeToogleMenu() {
    // console.log('closeToogleMenu')
    this.menuService.toogleMenu(false);
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
    const sectionMap = [
      { path: '/user/info', section: 1 },
      { path: '/user/agree', section: 2 },
      { path: '/user/tenant', section: 3 },
      { path: '/user/discus', section: 4 },
      { path: '/chat-user', section: 5 },
      { path: '/user/edit', section: 6 },
      { path: '/user/search', section: 7 }
    ];
    this.currentLocation = this.location.path();
    const matchedSection = sectionMap.find(entry => this.currentLocation.includes(entry.path));
    this.setSection(matchedSection ? matchedSection.section : -1);
  }

  setSectionFromBtn(index: number) {
    this.section = this.section.map((isOpen, i) => {
      if (i === index) {
        return !isOpen;
      }
      return false;
    });
  }

  setSection(index: number) {
    if (this.currentSectionIndex !== index) {
      this.section = this.section.map((isOpen, i) => {
        this.currentSectionIndex = index;
        if (i === index) {
          return !isOpen;
        }
        return false;
      });
    }
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
    const userFeaturesData = localStorage.getItem('searchInfoUserData');
    if (userFeaturesData) {
      const userObject = JSON.parse(userFeaturesData);
      this.userFeaturesData = userObject.inf;
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
        // console.log(data)
        const counterUserNewMessage: any = data
        if (counterUserNewMessage) {
          // console.log('Тип значення:', typeof counterUserNewMessage.status);
          this.counterUserNewMessage = Number(counterUserNewMessage.status)
          // console.log(this.counterUserNewMessage)
        } else {
          this.counterUserNewMessage = 0;
        }
      })
    );
  }



  activateTenantProfile() {
    this.storageUserDataService.activateTenantProfile(this.userFeaturesData);
    this.closeToogleMenu()
  }

  deactivateTenantProfile() {
    this.storageUserDataService.deactivateTenantProfile();
    this.closeToogleMenu()
  }

  logout() {
    this.sharedService.logoutUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}



