import { Component, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
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

}
