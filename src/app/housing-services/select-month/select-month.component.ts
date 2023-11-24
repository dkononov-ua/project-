import { Component, OnInit } from '@angular/core';
import { ChangeMonthService } from '../change-month.service';

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss']
})
export class SelectMonthComponent implements OnInit {

  months = [
    { id: '1', name: 'Січень' },
    { id: '2', name: 'Лютий' },
    { id: '3', name: 'Березень' },
    { id: '4', name: 'Квітень' },
    { id: '5', name: 'Травень' },
    { id: '6', name: 'Червень' },
    { id: '7', name: 'Липень' },
    { id: '8', name: 'Серпень' },
    { id: '9', name: 'Вересень' },
    { id: '10', name: 'Жовтень' },
    { id: '11', name: 'Листопад' },
    { id: '12', name: 'Грудень' }
  ];

  selectedMonth!: any;
  currentMonth: any;
  serviceMonth: any;

  constructor(private changeMonthService: ChangeMonthService) { }

  ngOnInit(): void {
    const storedMonth = localStorage.getItem('selectedMonth');
    if (storedMonth === 'undefined') {
      this.getMonthCurrent();
    } else {
      this.selectedMonth = storedMonth;
    }
  }

  getMonthCurrent() {
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth() + 1;
    this.selectedMonth = this.months.find(month => month.id === this.currentMonth.toString())?.name;
    this.changeMonthService.setSelectedMonth(this.selectedMonth);
  }

  onSelectionChangeMonth(selectedMonth: any): void {
    this.changeMonthService.setSelectedMonth(selectedMonth);
  }

}
