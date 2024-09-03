import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SelectedFlatService } from '../../services/selected-flat.service';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { MenuService } from '../../services/menu.service';
import { Location } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { pageConfig } from 'src/app/data/page-config';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

interface MenuStatus {
  status: boolean;
  index: number;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  pageConfig = pageConfig;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  selectedFlatId!: number | null;
  houseData: any;
  userData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];
  metaTitleName: string = '';
  metaImage: any;

  goBack(): void {
    this.location.back();
  }
  page_title: string = 'discussio';
  page_description: string = 'все про оренду';
  isHomePage = false;
  currentLocation: string = '';

  menuStatus: boolean = false;
  menuIndex: number = 0;
  disabledBtn: boolean = false;
  user_router: boolean = false;
  private routerSubscription: Subscription | undefined;
  toggleAllMenu(index: number) {
    this.menuStatus = !this.menuStatus
    this.menuService.toogleMenu(this.menuStatus, index)
  }

  constructor(
    private el: ElementRef,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private menuService: MenuService,
    private location: Location,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getServerPath();
    this.checkRouter();
    this.getCheckDevice();
    this.checkUserAuthorization();
    this.getStatusMenu();
    this.checkUrl();
  }

  checkUrl() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribe$)
    ).subscribe((event: NavigationEnd) => {
      this.currentLocation = event.urlAfterRedirects;
      this.checkLocation();
    });
  }

  // Перевіряю роутер та підписуюсь на його оновлення якщо роутер міняється відписуюсь від попереднього роутера
  async checkRouter(): Promise<void> {
    this.currentLocation = this.router.url; // Отримуємо поточний URL
    this.checkLocation(); // Викликаємо метод для перевірки локації
    if (this.currentLocation === ('/user')) {
      this.user_router = true;
    } else {
      this.user_router = false;
    }
  }

  // Перевіряю шляхи в роутері та виводжу назву та опис меню з конфігу data/page-config
  async checkLocation(): Promise<void> {
    type PagePaths = keyof typeof pageConfig;
    const currentLocation = this.currentLocation as PagePaths;
    const config = pageConfig[currentLocation];
    if (config) {
      this.page_title = config.title;
      this.page_description = config.description;
      this.updateMetaTagsInService(config)
    } else {
      this.page_title = 'discussio';
      this.page_description = '';
    }
  }

  // Оновлюю метатеги в залежності від локації з конфігу data/page-config
  private updateMetaTagsInService(config: any): void {
    this.getUserData();
    // console.log(config)
    if (this.userData && this.currentLocation === '/user/info') {
      const data = {
        title: this.metaTitleName,
        description: config.metaDescription,
        keywords: config.metaKeywords,
        image: this.metaImage,
        robots: config.metaRobots,
        author: config.metaAuthor,
        canonical: config.metaCanonical,
        themeColor: config.metaThemeColor,
        url: 'https://discussio.site' + this.currentLocation,
      }
      this.updateMetaTagsService.updateMetaTags(data)
    } else {
      const data = {
        title: config.metaTitle,
        description: config.metaDescription,
        keywords: config.metaKeywords,
        image: config.metaImg,
        robots: config.metaRobots,
        author: config.metaAuthor,
        canonical: config.metaCanonical,
        themeColor: config.metaThemeColor,
        url: 'https://discussio.site' + this.currentLocation,
      }
      this.updateMetaTagsService.updateMetaTags(data)
    }
  }

  getUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userData = JSON.parse(userData);
      // console.log(this.userData)
      if (this.userData && this.userData.inf) {
        this.metaTitleName = `Профіль ${this.userData.inf.firstName} ${this.userData.inf.lastName}`;
        this.metaImage = this.serverPath + '/img/users/' + this.userData.img[0].img
      }
    }
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectedFlat();
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на пристрій
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

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (this.selectedFlatId) {
          this.authorizationHouse = true;
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  // Перехід до оселі
  goToHouse() {
    if (this.authorizationHouse) {
      setTimeout(() => {
        this.router.navigate(['/house']);
      }, 100);
    } else {
      this.sharedService.setStatusMessage('Переходимо до вибору оселі');
      setTimeout(() => {
        this.router.navigate(['/house/house-control/selection-house']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }

  // підписка на статус меню
  async getStatusMenu() {
    this.menuService.toogleMenu$.subscribe((menuStatus: MenuStatus) => {
      this.menuStatus = menuStatus.status;
      this.menuIndex = menuStatus.index;
    });
  }




  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
