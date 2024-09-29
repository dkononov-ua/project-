import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from './services/shared.service';
import { CheckBackendService } from './services/check-backend.service';
import { StatusMessageService } from './services/status-message.service';
import { animations } from '../app/interface/animation';
import { NavigationEnd, Router } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { MenuService } from './services/menu.service';
import { AuthService } from './services/auth.service';

interface MenuStatus {
  status: boolean;
  index: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    animations.bot,
    animations.bot3,
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.bot5,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.appearance,
    animations.fadeIn,
  ],
})

export class AppComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  firstPath: string = ServerConfig.firstPath;
  secondPath: string = ServerConfig.secondPath;
  // ***

  statusMessage: string = '';
  currentLocation: string = '';
  loading: boolean = true;
  statusServer: string = '';

  images = [
    '../assets/bg-img/1.svg',
    '../assets/bg-img/2.svg',
    '../assets/bg-img/3.svg',
    '../assets/bg-img/4.svg',
  ];

  currentImageIndex = 0;
  nextBG: boolean = true;
  authorization: boolean = false;

  changeBG() {
    setInterval(() => {
      this.nextBG = false;
      setTimeout(() => {
        this.nextBG = true;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      }, 100);
    }, 20000);
  }

  get currentImage() {
    return this.images[this.currentImageIndex];
  }

  isMobile: boolean = false;
  subscriptions: any[] = [];
  menu: boolean = false;
  isHomePage = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private location: Location,
    private sharedService: SharedService,
    private checkBackendService: CheckBackendService,
    private statusMessageService: StatusMessageService,
    private loaderService: LoaderService,
    private menuService: MenuService,
    private router: Router,
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.checkBackendService.startCheckServer();
    this.setSubscriptions();
  }

  setSubscriptions() {
    this.getCheckDevice();
    if (!this.isMobile) {
      this.checkUrl();
    }
    this.getServerPath();
    this.getStatusMessage();
    this.getStatusMenu();
    this.getStatusLoader();
    this.getStatusServer();
    this.authService.checkAuth();
  }

  checkUrl() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribe$)
    ).subscribe((event: NavigationEnd) => {
      this.currentLocation = event.urlAfterRedirects;
      if (this.currentLocation === '/home' || this.currentLocation === '/') {
        this.isHomePage = true;
      } else {
        this.isHomePage = false;
      }
    });
  }

  // підписка на оновлення шляху серверу
  async getStatusServer() {
    this.subscriptions.push(
      this.sharedService.statusServer$.subscribe((status: string) => {
        this.statusServer = status;
        if (this.statusServer) {
          this.statusMessageService.setStatusMessage(this.statusServer);
        }
      }))
  }

  // підписка на шлях до серверу
  async getCheckDevice() {
    // console.log('getCheckDevice')
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        // console.log(status)
        this.isMobile = status;
        if (!this.isMobile) {
          this.changeBG();
        }
      })
    );
  }

  // підписка на статус для показу користувачу
  async getStatusMessage() {
    // console.log('getStatusMessage')
    this.subscriptions.push(
      this.statusMessageService.statusMessage$.subscribe((message: string) => {
        // console.log(message);
        this.statusMessage = message;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    // console.log('getServerPath')
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        if (this.serverPath !== serverPath) {
          this.serverPath = serverPath;
          // console.log(serverPath)
        }
      })
    );
  }

  // Отримання статусу лоадера
  async getStatusLoader() {
    // console.log('getStatusLoader')
    this.subscriptions.push(
      this.loaderService.loading$.subscribe((status: boolean) => {
        // console.log(status)
        setTimeout(() => {
          if (status) {
            this.loading = status;
          } else {
            this.loading = false;
          }
        }, 100);
      })
    );
  }

  // підписка на статус меню
  async getStatusMenu() {
    // console.log('getStatusMenu')
    this.menuService.toogleMenu$.subscribe((status: boolean) => {
      this.menu = status;
      // console.log(this.menu)
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
