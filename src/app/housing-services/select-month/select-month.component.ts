import { Component } from '@angular/core';

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss']
})
export class SelectMonthComponent {

  loading = false;

  months = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень'
  ];

  comunal_name: any;
  selectedMonth: any;

  constructor() {
  }

  ngOnInit(): void {
    const selectedMonth = localStorage.getItem('selectedMonth');
    if (selectedMonth) {
      this.selectedMonth = JSON.parse(selectedMonth);
    }
  }

  onSelectionChangeMonth(): void {
    this.loading = true;
    localStorage.removeItem('selectedMonth')
    localStorage.setItem('selectedMonth', JSON.stringify(this.selectedMonth));
    location.reload();
  }
}

