import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action-delete-sub',
  templateUrl: './action-delete-sub.component.html',
  styleUrls: ['./action-delete-sub.component.scss']
})

export class ActionDeleteSubComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data)
   }
}


