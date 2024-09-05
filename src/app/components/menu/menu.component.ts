import { Component, OnDestroy, OnInit } from '@angular/core';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { MenuService } from 'src/app/services/menu.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [animations.appearance,],
})

export class MenuComponent implements OnInit, OnDestroy {

  bgMenu: boolean = false;
  houseData: any;
  userData: any;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  menu: boolean = false;
  statusServiceMenu: boolean = false;
  isMobile: boolean = false;

  constructor(
    private sharedService: SharedService,
    private menuService: MenuService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.getStatusMenu();
    this.getCheckDevice();
    this.checkLocation();
    this.checkUserAuthorization();
  }

  // перевірка на девайс
  getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // Перевірка на авторизацію користувача
  checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getInfoUser();
      this.checkHouseAuthorization();
    } else {
      this.authorization = false;
    }
  }

  // Беру інформацію користувача
  getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.userData = userObject;
    }
  }

  // Перевірка на авторизацію оселі
  checkHouseAuthorization() {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
    } else {
      this.authorizationHouse = false;
      this.houseData = false;
      this.sharedService.clearCacheHouse();
    }
  }

  checkLocation() {
    this.currentLocation = this.location.path();
  }

  getStatusMenu() {
    // console.log('getStatusMenu')
    this.subscriptions.push(
      this.menuService.toogleMenu$.subscribe((status: boolean) => {
        this.statusServiceMenu = status;
        if (this.statusServiceMenu && !this.menu) {
          this.menu = this.statusServiceMenu;
          setTimeout(() => {
            this.bgMenu = true;
          }, 10);
        } else {
          if (this.menu) {
            this.closeToogleMenu();
          } else {
            this.menu = false;
            this.bgMenu = false;
          }
        }
        // console.log('menu status updated:', this.menu);
      })
    );
  }

  // відкриття меню через сервіс
  closeToogleMenu() {
    // console.log('closeToogleMenu')
    this.bgMenu = false;
    setTimeout(() => {
      this.menu = false;
      this.menuService.toogleMenu(false)
    }, 600);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

