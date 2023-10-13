import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/shared/server-config';
import { CloseMenuService } from 'src/app/services/close-menu.service';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-selection-account',
  templateUrl: './selection-account.component.html',
  styleUrls: ['./selection-account.component.scss']
})
export class SelectionAccountComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  public selectedFlatId: any | null;
  houseInfo: any;
  userInfo: any;

  // user
  openUserMenu: boolean = true;
  hideUserMenu: boolean = false;
  // flat
  openFlatMenu: boolean = false;
  hideFlatMenu: boolean = true;
  isMenuOpen = false;
  sendCloseMenu = false;

  openMenuUser(): void {
    this.openUserMenu = true;
    this.openFlatMenu = false;
  }

  // menuBtn () {
  //   if (!this.openUserMenu) {
  //     this.openMenuUser()
  //   } else {
  //     this.closeMenuUser()
  //   }
  // }

  openMenuFlat(): void {
    this.openUserMenu = false;
    this.openFlatMenu = true;
  }

  closeMenuUser(): void {
    this.openUserMenu = false;
    this.hideUserMenu = true;
  }

  closeMenuFlat(): void {
    this.openFlatMenu = false;
    this.hideFlatMenu = true;
  }

  goBack(): void {
    this.location.back();
  }

  houseData: any
  userData: any

  constructor(
    private location: Location,
    private isCloseMenu: CloseMenuService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    if (!this.userData) {
      this.onLoginCheckUser()
    } else {
      this.loadDataUser();
    }
    if (!this.houseData) {
      this.onLoginCheckFlat()
    } else {
      this.loadDataFlat();
    }
  }

  loadDataUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.userData = localStorage.getItem('userData');
      if (this.userData) {
        const parsedUserData = JSON.parse(this.userData);
        this.userInfo = parsedUserData;
      } else {
        console.log('Авторизуйтесь')
      }
    }
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.houseInfo = parsedHouseData;
      } else {
        console.log('Авторизуйтесь')
      }
    }
  }

  onLoginCheckUser(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('userData', JSON.stringify(response));
          this.loadDataUser()
        } else {
          console.log('Немає інформації')
        }
      });
    }
  }

  onLoginCheckFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('houseData', JSON.stringify(response));
          this.loadDataFlat()
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  sendMenuClose() {
    this.sendCloseMenu = false;
    this.isCloseMenu.setCloseMenu(this.isMenuOpen);
  }
}

