import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sharing-info',
  templateUrl: './sharing-info.component.html',
  styleUrls: ['./sharing-info.component.scss']
})
export class SharingInfoComponent implements OnInit, OnDestroy {

  residents: any
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  subscriptions: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getServerPath();
    this.residents = this.data.residents;
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
