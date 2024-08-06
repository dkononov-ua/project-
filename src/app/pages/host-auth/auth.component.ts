import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from '../../services/selected-flat.service';
import { SharedService } from '../../services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedFlatId: string | null = null;
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  subscriptions: any[] = [];
  isMobile: boolean = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
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

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectedFlatId();
    } else {
      this.authorization = false;
    }
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
        if (this.selectedFlatId) {
          const houseData = localStorage.getItem('houseData');
          if (houseData) {
            this.authorizationHouse = true;
          }
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}
