import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChangeComunService } from '../change-comun.service';
import { ChangeMonthService } from '../change-month.service';
import { ChangeYearService } from '../change-year.service';

@Component({
  selector: 'app-delete-comun',
  templateUrl: './delete-comun.component.html',
  styleUrls: ['./delete-comun.component.scss']
})
export class DeleteComunComponent implements OnInit {

  selectedFlatId!: string | null;
  selectedComun!: string | null;
  selectedYear!: string | null;
  selectedMonth!: string | null;

  constructor(
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService
  ) { }

  ngOnInit(): void {
    this.getSelectParam()
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.changeComunService.selectedComun$.subscribe((selectedComun: string | null) => {
      this.selectedComun = selectedComun || this.selectedComun;
    });

    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
    });

    this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
      this.selectedMonth = selectedMonth || this.selectedMonth;
    });
  }

}
