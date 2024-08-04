import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})

export class ActionComponent {
  serverPath: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {  }
}



