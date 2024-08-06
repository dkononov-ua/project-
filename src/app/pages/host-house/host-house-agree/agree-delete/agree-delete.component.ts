import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-agree-delete',
  templateUrl: './agree-delete.component.html',
  styleUrls: ['./agree-delete.component.scss']
})
export class AgreeDeleteComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}



