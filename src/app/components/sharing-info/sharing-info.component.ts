import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sharing-info',
  templateUrl: './sharing-info.component.html',
  styleUrls: ['./sharing-info.component.scss']
})
export class SharingInfoComponent implements OnInit {

  residents: any
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.residents = this.data.residents;
  }

}
