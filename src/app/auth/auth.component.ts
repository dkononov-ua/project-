import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectedFlatService } from '../services/selected-flat.service';
import { SharedService } from '../services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

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

  constructor(
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,) { }

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

}
