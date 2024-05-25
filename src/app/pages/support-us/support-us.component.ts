import { Component, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-support-us',
  templateUrl: './support-us.component.html',
  styleUrls: ['./support-us.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class SupportUsComponent implements OnInit {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
  }

  goBack(): void {
    this.sharedService.goBack();
  }
}
