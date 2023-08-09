import { Component, OnInit } from '@angular/core';
import { ChangeMonthService } from '../change-month.service';

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss']
})
export class SelectMonthComponent implements OnInit {

  months = [
    { id: 0, name: 'Січень' },
    { id: 1, name: 'Лютий' },
    { id: 2, name: 'Березень' },
    { id: 3, name: 'Квітень' },
    { id: 4, name: 'Травень' },
    { id: 5, name: 'Червень' },
    { id: 6, name: 'Липень' },
    { id: 7, name: 'Серпень' },
    { id: 8, name: 'Вересень' },
    { id: 9, name: 'Жовтень' },
    { id: 10, name: 'Листопад' },
    { id: 11, name: 'Грудень' }
  ];

  comunal_name: any;
  selectedMonth: any;

  constructor(private changeMonthService: ChangeMonthService) { }

  ngOnInit(): void {
    this.changeMonthService.selectedMonth$.subscribe(month => {
      if (month !== null && month !== undefined) {
        this.selectedMonth = month;
      } else {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        this.selectedMonth = this.months.find(month => month.id === currentMonth)?.name;
      }
    });
  }

  onSelectionChangeMonth(): void {
    this.changeMonthService.setSelectedMonth(this.selectedMonth);
  }

}
