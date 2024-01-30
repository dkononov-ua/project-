import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
})

export class HouseComponent implements OnInit {

  selectedFlatId!: string | null;
  path_logo = path_logo;
  statusMessage: string | undefined;
  houseData: boolean = false;

  constructor(
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
  ) {
    this.sharedService.getStatusMessage().subscribe((message: string) => {
      this.statusMessage = message;
    });
  }

  ngOnInit(): void {
    this.getSelectParam();
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      if (this.selectedFlatId) {
        this.loadDataFlat();
      }
    });
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        this.houseData = true;
      } else {
        this.houseData = false; }
    } else {
      console.log('Авторизуйтесь')
    }
  }
}



