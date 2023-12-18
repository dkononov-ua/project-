import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-subs',
  templateUrl: './delete-subs.component.html',
  styleUrls: ['./delete-subs.component.scss']
})

export class DeleteSubsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}



