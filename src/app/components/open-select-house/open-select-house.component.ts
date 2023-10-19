import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-open-select-house',
  templateUrl: './open-select-house.component.html',
  styleUrls: ['./open-select-house.component.scss']
})
export class OpenSelectHouseComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}




