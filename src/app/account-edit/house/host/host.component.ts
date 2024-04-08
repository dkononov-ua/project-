import { Component, ElementRef, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})

export class HostComponent implements OnInit {
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  addHouse: boolean = false;
  selectedFlatId!: string | null;
  indexPage: number = 1;

  onAddHouse() {
    this.addHouse = !this.addHouse;
  }

  constructor(
    private el: ElementRef,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
  ) { }
  ngOnInit(): void {
    this.getSelectParam();
  }

  getSelectParam(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
    });
  }
}
