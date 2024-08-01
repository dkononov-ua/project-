import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SelectedFlatService } from '../../services/selected-flat.service';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { MenuService } from '../../services/menu.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs';

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

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  authorization: boolean = false;
  authorizationHouse: boolean = false;
  selectedFlatId!: number | null;
  houseData: any;
  isMobile: boolean = false;
  subscriptions: any[] = [];

  goBack(): void {
    this.location.back();
  }
  page_title: string = 'Discussio';
  page_description: string = '';
  isHomePage = false;
  currentLocation: string = '';

  menuStatus: boolean = false;
  menuIndex: number = 0;
  disabledBtn: boolean = false;

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
  ) { }

  async ngOnInit(): Promise<void> {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isHomePage = this.location.path() === '';
      this.checkLocation();
    });
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.getStatusMenu();
  }

  async checkLocation(): Promise<void> {
    this.currentLocation = this.location.path();
    if (this.currentLocation.includes('/discussio-search')) {
      this.page_title = 'Пошук'
      this.page_description = 'Осель & Орендарів'
    } else if (this.currentLocation.includes('/user/info')) {
      this.page_title = 'Профіль'
      this.page_description = 'Користувача'
    } else if (this.currentLocation.includes('/home')) {
      this.page_title = 'Головна'
      this.page_description = 'Сторінка'
    } else if (this.currentLocation.includes('/house')) {
      this.page_title = 'Профіль'
      this.page_description = 'Оселі'
    } else if (this.currentLocation.includes('/user/edit/person')) {
      this.page_title = 'Редагування'
      this.page_description = 'Персона'
    } else if (this.currentLocation.includes('/user/edit/contacts')) {
      this.page_title = 'Редагування'
      this.page_description = 'Контакти'
    } else if (this.currentLocation.includes('/user/edit/status')) {
      this.page_title = 'Редагування'
      this.page_description = 'Статуси'
    } else if (this.currentLocation.includes('/user/edit/looking')) {
      this.page_title = 'Профіль'
      this.page_description = 'Орендаря'
    } else if (this.currentLocation.includes('/user/edit/delete')) {
      this.page_title = 'Видалення'
      this.page_description = 'Аккаунту'
    } else {
      this.page_title = 'Discussio'
      this.page_description = "Об'єднуємо орендарів та орендодавців"
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
  }

}
