import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
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

  constructor(
    private selectedFlatService: SelectedFlatService
    ) {  }

  ngOnInit(): void {
    this.loadDataFlat()
    this.getSelectParam();
    if (!this.selectedFlatId) {
      this.housingExists = false;
    } else {
      this.housingExists = true;
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  loadDataFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        this.housingExists = true;
      } else {
        this.housingExists = false;
      }
    } else {
      console.log('Авторизуйтесь')
    }
  }

}



