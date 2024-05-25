import { Component, OnInit } from '@angular/core';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-resident-menu',
  templateUrl: './resident-menu.component.html',
  styleUrls: ['./resident-menu.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class ResidentMenuComponent implements OnInit {
  isMobile = false;

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  constructor(
    private sharedService: SharedService
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  ngOnInit() {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

}
