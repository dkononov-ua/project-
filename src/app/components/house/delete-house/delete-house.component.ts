import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-house',
  templateUrl: './delete-house.component.html',
  styleUrls: ['./delete-house.component.scss']
})
export class DeleteHouseComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
