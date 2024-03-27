import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-actions',
  templateUrl: './confirm-actions.component.html',
  styleUrls: ['./confirm-actions.component.scss']
})
export class ConfirmActionsComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data)
  }
}





