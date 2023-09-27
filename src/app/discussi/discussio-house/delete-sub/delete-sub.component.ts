import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-sub',
  templateUrl: './delete-sub.component.html',
  styleUrls: ['./delete-sub.component.scss']
})
export class DeleteSubComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}




