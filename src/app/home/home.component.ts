import { Component, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../interface/animation';
import { SelectedFlatService } from '../services/selected-flat.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { CheckBackendService } from '../services/check-backend.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
    animations.bot,
    animations.top1,
  ],
})
export class HomeComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  loginCheck: boolean = false;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
  selectedFlatId: string | null = null;
  houseData: any;
  pathHouse: string = ''
  statusMessage: any;
  isMobile: boolean = false;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor(
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private checkBackendService: CheckBackendService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
    });
  }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectParam();
    } else {
      this.authorization = false;
    }
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        const houseData = localStorage.getItem('houseData');
        if (houseData) {
          this.authorizationHouse = true;
        }
      } else {
        this.authorizationHouse = false;
      }
    });
  }

  // Перегляд статистики комунальних
  goToHouse() {
    if (this.authorizationHouse) {
      setTimeout(() => {
        this.router.navigate(['/house/house-info']);
      }, 100);
    } else {
      this.sharedService.setStatusMessage('Переходимо до вибору оселі');
      setTimeout(() => {
        this.router.navigate(['/house/house-control/selection-house']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }

}
