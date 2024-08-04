import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { animations } from '../../interface/animation';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
import { MenuService } from 'src/app/services/menu.service';
import { Location } from '@angular/common';

interface MenuStatus {
  status: boolean;
  index: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(-30vh)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(-30vh)' }))
      ]),
    ]),
    trigger('cardAnimationLeft', [
      transition('void => *', [
        style({ transform: 'translateX(30vh)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateX(30vh)' }))
      ]),
    ]),
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.appearance,
  ],
})

export class MenuComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  disabledBtn: boolean = false;

  isLoadingImg: boolean = false;
  numConcludedAgree: number = 0;

  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  statusMessage: any;
  loginCheck: boolean = false;

  statusMenu: boolean = false;
  bgMenu: boolean = false;

  selectedFlatId: any;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  counterUserSubs: any;
  counterUserDiscuss: any;
  numSendAgree: number = 0;
  userInf: any;
  agreeNum: number = 0;
  loading: boolean = false;
  dataUpdated = false;
  houseData: any;
  userData: any;

  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;

  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  unreadHouseMessage: any;
  iReadHouseMessage: boolean = false;

  unreadUserMessage: any;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterHouseNewMessage: any;
  counterUserNewMessage: any;
  iReadUserMessage: boolean = false;
  counterUserNewAgree: any;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  page_title: string = '';

  servicsMenu: number = 0;

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];
  section: boolean[] = [false, false, false, false, false];

  toogleSection(index: number) {
    this.section[index] = !this.section[index];
  }

  toggleAllMenu(index: number) {
    this.linkOpen[index] = !this.linkOpen[index];
    this.disabledBtn = true;
    if (this.menu[index]) {
      setTimeout(() => {
        this.menu[index] = !this.menu[index];
        this.disabledBtn = false;
      }, 600);
    } else {
      this.menu[index] = !this.menu[index];
      this.disabledBtn = false;
    }
  }

  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
    private counterService: CounterService,
    private router: Router,
    private sharedService: SharedService,
    private menuService: MenuService,
    private location: Location,
    private selectedFlatIdService: SelectedFlatService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    this.getStatusMenu();
    this.checkLocation();
    this.checkUserAuthorization();
    this.getIndexMenu();
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
      this.loginCheck = true;
      this.authorization = true;
      this.getInfoUser();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserDiscussioCount();
      await this.getUserNewMessage();
      this.getCounterAgree();
      await this.getSelectedFlatId();
      this.checkHouseAuthorization();
    } else {
      this.authorization = false;
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

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
      })
    );
  }

  // Перевірка на авторизацію оселі
  async checkHouseAuthorization() {
    const houseData = localStorage.getItem('houseData');
    if (houseData && this.selectedFlatId) {
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
      await this.getHouseSubscribersCount();
      await this.getHouseSubscriptionsCount();
      await this.getHouseDiscussioCount();
      await this.getHouseNewMessage();
    } else {
      this.authorizationHouse = false;
      this.houseData = false;
      this.sharedService.clearCacheHouse();
    }
  }

  async checkLocation(): Promise<void> {
    this.currentLocation = this.location.path();
    if (this.currentLocation === '/discussio-search') {
      this.page_title = 'Пошук Осель & Орендарів'
    }
    if (this.currentLocation === '/user/info') {
      this.page_title = 'Профіль користувача'
    }
    if (this.currentLocation === '/home' || '') {
      this.page_title = 'Домашня сторінка'
    }
  }

  // підписка на статус меню
  async getStatusMenu() {
    this.subscriptions.push(
      this.menuService.toogleMenu$.subscribe((menuStatus: MenuStatus) => {
        this.servicsMenu = menuStatus.index;
        this.statusMenu = menuStatus.status;
        this.toggleAllMenu(this.servicsMenu);
        setTimeout(() => {
          this.bgMenu = true
        }, 10);
      })
    );
  }

  // підписка на статус меню
  async getIndexMenu() {
    this.subscriptions.push(
      this.menuService.indexMenu$.subscribe((index: number) => {
        if (index && !this.statusMenu) {
          this.closeToogleMenu(index);
        }
      })
    );
  }

  // відкриття меню через сервіс
  async closeToogleMenu(index: number) {
    this.bgMenu = false;
    this.toogleSection(0);
    if (this.menu) {
      setTimeout(() => {
        this.disabledBtn = false;
        this.menuService.toogleMenu(false, index)
      }, 600);
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
      if (this.acces_discuss === 1) {
        await this.getHouseDiscussioCount();
      }
      if (this.acces_subs === 1) {
        await this.getHouseSubscribersCount();
        await this.getHouseSubscriptionsCount();
      }
    } else {
      await this.getHouseDiscussioCount();
      await this.getHouseSubscribersCount();
      await this.getHouseSubscriptionsCount();
    }
  }

  getCounterAgree() {
    const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
    if (counterUserNewAgree) {
      this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
    } else {
      this.counterUserNewAgree = 0;
    }
  }

  // Отримую угоди для виведення інформації по ним для мешканців та власника
  async getConcludedAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    if (userData && userJson) {
      const userObject = JSON.parse(userData);
      const user_id = userObject.inf.user_id;
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: 0, };
      try {
        const response: any = (await this.http.post(this.serverPath + '/agreement/get/saveagreements', data).toPromise()) as any;
        console.log(response)
        if (response && response[0].status !== 'Немає доступу') {
          this.numConcludedAgree = 0;
        } else {
          this.numConcludedAgree = 0;
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('У вас немає доступу до оселі ID ' + this.selectedFlatId + 'Можливо її було забанено');
        setTimeout(() => {
          this.sharedService.logoutHouse();
        }, 2000);
      }
    }
  }

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    // this.subscriptions.push(
    //   this.counterService.counterHouseSubscribers$.subscribe(data => {
    //     this.counterHouseSubscribers = Number(data);
    //   })
    // );
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    // this.subscriptions.push(
    //   this.counterService.counterHouseSubscriptions$.subscribe(data => {
    //     this.counterHouseSubscriptions = Number(data);
    //   })
    // );
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    this.subscriptions.push(
      this.counterService.counterHouseDiscussio$.subscribe(data => {
        this.counterHouseDiscussio = Number(data);
      })
    );
  }

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    await this.counterService.getHouseNewMessage(this.selectedFlatId);
    this.subscriptions.push(
      this.counterService.counterHouseNewMessage$.subscribe(data => {
        const counterHouseNewMessage: any = data;
        this.counterHouseNewMessage = counterHouseNewMessage.status;
        // console.log('кількість повідомлень оселі', this.counterHouseNewMessage)
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

  logout() {
    this.closeToogleMenu(2)
    this.sharedService.logoutUser();
  }

  logoutHouse() {
    this.closeToogleMenu(3)
    this.sharedService.getlogoutHouse();
  }

  onClickedOutside(index: number) {
    this.statusMenu = !this.statusMenu
    if (this.statusMenu && index) {
      this.closeToogleMenu(index)
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

