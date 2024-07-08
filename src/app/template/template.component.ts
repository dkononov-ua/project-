import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from '../services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  indexPage: number = 1;
  isMobile: boolean = false;
  authorization: boolean = false;

  goBack(): void {
    this.location.back();
  }

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor(
    private location: Location,
    private sharedService: SharedService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  ngOnInit() {

    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
    }



    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {

      }
    })

    // this.sharedService.setStatusMessage('Помилка на сервері, повторіть спробу');
    // this.sharedService.setStatusMessage('Дискусія видалена');
    // this.sharedService.setStatusMessage('');

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

}
