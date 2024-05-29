import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { IsAccountOpenService } from './services/is-account-open.service';
import * as ServerConfig from 'src/app/config/path-config';
import { NavigationEnd, Router } from '@angular/router';
import { CloseMenuService } from './services/close-menu.service';
import { SharedService } from './services/shared.service';
import { Subscription } from 'rxjs';
import { CheckBackendService } from './services/check-backend.service';
import { StatusMessageService } from './services/status-message.service';
import { animations } from '../app/interface/animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.top1,
    animations.bot,
    animations.right2,
    animations.swichCard,
    animations.fadeIn,
  ],
})

export class AppComponent implements OnInit {

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
  @ViewChild('locationElement') locationElement!: ElementRef;
  loginForm: any;
  loggedInAccount: boolean = true;
  closeMenuStatus: boolean = true;
  isMenuOpen = true;
  hideMenu = false;
  indexPage: number = 0;
  shouldBeVisible: boolean = true;
  waitingUpdate: boolean = false;

  onToggleMenu() {
    if (this.isMenuOpen) {
      this.openMenu();
      setTimeout(() => {
        this.hideMenu = true;
      }, 310);
    } else {
      this.hideMenu = false;
      setTimeout(() => {
        this.openMenu();
      }, 0);
    }
  }

  loading: boolean = true;
  statusServer: string = '';

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    setTimeout(() => {
      this.hideMenu = true;
    }, 500);
  }
  private routerSubscription: Subscription | undefined;

  images = [
    // '../assets/bg-img/bg1.svg',
    // '../assets/bg-img/bg2.svg',
    '../assets/bg-img/1.svg',
    '../assets/bg-img/2.svg',
    '../assets/bg-img/3.svg',
    '../assets/bg-img/4.svg',
    // Додайте сюди інші шляхи до зображень
  ];
  currentImageIndex = 0;
  nextBG = true;

  changeBG() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.nextBG = !this.nextBG;
    }, 2000);
  }

  get currentImage() {
    return this.images[this.currentImageIndex];
  }
  isMobile: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private isAccountOpenService: IsAccountOpenService,
    private location: Location,
    private router: Router,
    private el: ElementRef,
    private isCloseMenu: CloseMenuService,
    private sharedService: SharedService,
    private checkBackendService: CheckBackendService,
    private statusMessageService: StatusMessageService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      if (!this.isMobile) {
        this.changeBG();
      }
    });
    this.checkBackendService.startCheckServer();
    this.sharedService.statusServer$.subscribe((status: string) => {
      this.statusServer = status;
      // console.log(this.statusServer);
      this.sharedService.setStatusMessage('');
      if (this.statusServer === 'Перемикаємось на резервний інтернет') {
        this.sharedService.setStatusMessage('Зачекайте');
        this.waitingUpdate = true;
        setTimeout(() => {
          this.sharedService.setStatusMessage('Перемикаємось на резервний інтернет');
        }, 1000);
      } else if (this.statusServer === 'Перемикаємось на основний інтернет') {
        this.waitingUpdate = true;
        this.sharedService.setStatusMessage('Зачекайте');
        setTimeout(() => {
          this.sharedService.setStatusMessage('Перемикаємось на основний інтернет');
        }, 1000);
      } else {
        this.waitingUpdate = false;
        this.sharedService.setStatusMessage('');
      }
    });
    this.statusMessageService.statusMessage$.subscribe((message: string) => {
      // console.log(message);
      this.statusMessage = message;
    });
    // підписуюсь на зміну шляху до серверу
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      // console.log(this.serverPath)
      if (this.serverPath) {
        await this.getUserInfo();
      }
    })
    // підписуюсь на зміну шляху до серверу
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange(this.router.url);
      }
    });

    const currentLocation = this.location.path();
    await this.compareLocationWithCondition(currentLocation);
    if (this.loggedInAccount === false) {
      await this.getAccountIsOpen()
      this.loading = false;
    } else {
      this.loggedInAccount = true;
      await this.getMenuIsOpen();
      this.loading = false;
    }
  }

  // перевірка локації де я знаходжусь, тоді показую що мені треба
  handleRouteChange(currentRoute: string): void {
    if (currentRoute.includes('/home/about-project')) {
      this.shouldBeVisible = true;
    } else {
      this.shouldBeVisible = false;
    }
  }

  // перевірка користувача на авторизацію, виконується кожен раз при перезавантаженні сторінки
  async getUserInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/auth', JSON.parse(userJson)).toPromise();
        // console.log(response)
      } catch (error) {
        // console.log('Помилка авторизації')
        // this.router.navigate(['/registration']);
      }
    }
  }

  // перевіряю локацію якщо я знаходжусь на сторінці реєстрації то this.loggedInAccount = false;
  async compareLocationWithCondition(currentLocation: string): Promise<void> {
    const location = '/registration';
    if (location === currentLocation) {
      this.loggedInAccount = false;
    } else {
      this.loggedInAccount = true;
    }
  }

  async getAccountIsOpen() {
    this.isAccountOpenService.isAccountOpen$.subscribe(async isAccountOpen => {
      this.loggedInAccount = isAccountOpen;
      this.cdr.detectChanges();
    });
  }

  async getMenuIsOpen() {
    this.isCloseMenu.closeMenu$.subscribe(async closeMenu => {
      this.closeMenuStatus = closeMenu;
      if (this.closeMenuStatus === false) {
        this.onToggleMenu();
      }
    });
  }
}
