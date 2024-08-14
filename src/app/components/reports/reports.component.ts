import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  selectedReport: number = 1;
  aboutReport: string | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
