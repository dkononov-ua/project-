import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-project-navigation',
  templateUrl: './project-navigation.component.html',
  styleUrls: ['../../card/navigation.scss'],
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

export class ProjectNavigationComponent implements OnInit, OnDestroy {

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

  setToogleMenu(close: number, open: number) {
    this.menuService.toogleMenu(false, close);
    setTimeout(() => {
      this.menuService.toogleMenu(true, open);
    }, 100);
  }

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***


  isMobile: boolean = false;
  subscriptions: any[] = [];
  selectedFlatId!: string | null;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  section: boolean[] = [false, false, false, false, false, false, false, false, false];

  // відкриття меню через сервіс
  async closeToogleMenu(index: number) {
    this.menuService.indexMenu(index);
  }

  setSection(index: number) {
    this.section = this.section.map((_, i) => i === index);
  }

  constructor(
    private sharedService: SharedService,
    private menuService: MenuService,
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
    } else {
      this.authorization = false;
    }
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}


