import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class HouseComponent implements OnInit {
  housingExists: boolean = false
  selectedFlatId!: string | null;
  path_logo = path_logo;
  statusMessage: string | undefined;
  houseData: any;

  constructor(private selectedFlatService: SelectedFlatService, private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.getSelectParam();
    if (!this.selectedFlatId) {
      this.housingExists = false;
    } else { this.housingExists = true; }
    this.sharedService.getStatusMessage().subscribe((message: string) => {
      this.statusMessage = message;
    });
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
      } else {
        console.log('Немає інформації про оселю')
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      if (this.selectedFlatId) {
        this.loadDataFlat();
      }
    });
  }

}



