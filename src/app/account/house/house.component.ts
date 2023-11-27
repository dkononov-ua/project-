import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { Router } from '@angular/router';
import { serverPath, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { SharedService } from 'src/app/services/shared.service';
import { DataService } from 'src/app/services/data.service';
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
  houseData: any;
  statusMessage: string | undefined;

  constructor(
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
    if (!this.selectedFlatId) {
      this.housingExists = false;
    } else {
      this.housingExists = true;
    }
    this.sharedService.getStatusMessage().subscribe((message: string) => {
      this.statusMessage = message;
    });
  }

  getSelectParam() {
    const userJson = localStorage.getItem('user');
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      // if (userJson && this.selectedFlatId) {
      //   this.dataService.getInfoFlat().subscribe((response: any) => {
      //     if (response) {
      //       localStorage.setItem('houseData', JSON.stringify(response));
      //     } else {
      //       console.log('Немає оселі')
      //     }
      //   });
      // }
    });
  }

  // loadDataFlat(): void {
  //   const userJson = localStorage.getItem('user');
  //   if (userJson) {
  //     const houseData = localStorage.getItem('houseData');
  //     this.houseData = houseData;
  //     const parsedHouseData = JSON.parse(this.houseData);
  //     if (parsedHouseData) {
  //       this.housingExists = true;
  //       if (parsedHouseData.imgs === 'Картинок нема') {
  //         this.statusMessage = 'Додайте фото оселі';
  //         setTimeout(() => {
  //           this.router.navigate(['/housing-parameters/host/']);
  //         }, 2000);
  //       } else {
  //       }
  //     } else {
  //       this.housingExists = false;
  //     }
  //   } else {
  //     console.log('Авторизуйтесь')
  //   }
  // }

}



