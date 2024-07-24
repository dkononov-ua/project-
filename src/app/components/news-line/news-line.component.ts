import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';

@Component({
  selector: 'app-news-line',
  templateUrl: './news-line.component.html',
  styleUrls: ['./news-line.component.scss'],
  animations: [
    animations.top4,
    animations.left4,
    animations.bot,
  ],
})
export class NewsLineComponent implements OnInit, OnDestroy {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  isMobile: boolean = false;
  statusServer: string = '';
  subscriptions: any[] = [];
  hideLine: boolean = false;

  constructor(
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
  }

  // перевірка на девайс
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
        if (!this.statusServer) {
          const savedStatusServer = localStorage.getItem('savedStatusServer');
          // console.log('Збережений статус:', savedStatusServer)
          if (savedStatusServer) {
            // якщо є збережений статус ми беремо його
            this.statusServer = savedStatusServer;
            setTimeout(() => {
              this.hideLine = true;
              setTimeout(() => {
                this.statusServer = '';
              }, 1000);
            }, 15000);
          }
        }
      })
    );
  }

  // Після закриття компоненту відписуюсь від всіх підписок
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
