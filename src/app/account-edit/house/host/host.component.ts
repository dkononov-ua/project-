import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { animations } from '../../../interface/animation';
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
  animations: [animations.left, animations.left1, animations.left2,],

})

export class HostComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  addHouse: boolean = false;
  selectedFlatId!: string | null;
  indexPage: number = 1;

  constructor(private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.getSelectParam();
  }

  getSelectParam(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
    });
  }
}
