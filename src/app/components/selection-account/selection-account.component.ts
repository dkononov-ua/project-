import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as ServerConfig from 'src/app/config/path-config';
import { CloseMenuService } from 'src/app/services/close-menu.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-selection-account',
  templateUrl: './selection-account.component.html',
  styleUrls: ['./selection-account.component.scss']
})
export class SelectionAccountComponent implements OnInit {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  selectedFlatId: any | null;
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
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    if (!this.userData) {
      // this.onLoginCheckUser()
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

  // async onLoginCheckUser(): Promise<void> {
  //   const userJson = localStorage.getItem('user');
  //   if (userJson) {
  //     await this.dataService.getInfoUser().subscribe((response: any) => {
  //       if (response) {
  //         localStorage.setItem('userData', JSON.stringify(response));
  //         this.loadDataUser()
  //       } else {
  //         console.log('Немає інформації')
  //       }
  //     });
  //   }
  // }

  async getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  onLoginCheckFlat(): void {
    const userJson = localStorage.getItem('user');
    this.getSelectParam()
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        localStorage.setItem('houseData', JSON.stringify(response));
        this.loadDataFlat()
      });
    } else {
      console.log('Оберіть оселю')
    }
  }

  sendMenuClose() {
    this.sendCloseMenu = false;
    this.isCloseMenu.setCloseMenu(this.isMenuOpen);
  }
}

