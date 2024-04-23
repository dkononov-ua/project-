import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';

@Component({
  selector: 'app-sharing-info',
  templateUrl: './sharing-info.component.html',
  styleUrls: ['./sharing-info.component.scss']
})
export class SharingInfoComponent implements OnInit {

  residents: any
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit(): Promise<void> {
    this.residents = this.data.residents;
  }

}
