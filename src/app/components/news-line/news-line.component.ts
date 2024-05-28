import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';

@Component({
  selector: 'app-news-line',
  templateUrl: './news-line.component.html',
  styleUrls: ['./news-line.component.scss']
})
export class NewsLineComponent implements OnInit {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  isMobile: boolean = false;
  statusServer: string = '';
  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {

    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
    });
    this.sharedService.statusServer$.subscribe((status: string) => {
      this.statusServer = status;
      if (!this.statusServer) {
        const savedStatusServer = localStorage.getItem('savedStatusServer');
        // console.log('Збережений статус:', savedStatusServer)
        if (savedStatusServer) {
          // якщо є збережений статус ми беремо його
          this.statusServer = savedStatusServer;
        }
      }
    });
  }

}
