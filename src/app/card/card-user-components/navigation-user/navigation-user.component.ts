import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navigation-user',
  templateUrl: './navigation-user.component.html',
  styleUrls: ['./navigation-user.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(1220%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(1220%)' }))
      ]),
    ]),
  ],
})

export class NavigationUserComponent implements OnInit, OnDestroy {

  disabledBtn: boolean = false;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

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

  constructor(
    private counterService: CounterService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getUserDiscussioCount();
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserNewMessage();
    } else {
      this.authorization = false;
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}



