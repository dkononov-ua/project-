import { Component } from '@angular/core';

@Component({
  selector: 'app-select-year',
  templateUrl: './select-year.component.html',
  styleUrls: ['./select-year.component.scss']
})
export class SelectYearComponent {

  loading = false;
  years = [2023, 2022, 2021, 2020];
  selectedMonth: any;
  selectedYear: any;

  constructor() {
  }

  ngOnInit(): void {
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');
    if (selectedYear) {
      this.selectedYear = JSON.parse(selectedYear);
    }
    if (selectedMonth) {
      this.selectedMonth = JSON.parse(selectedMonth);
    }
  }

  onSelectionChangeYear(): void {
    this.loading = true;
    localStorage.setItem('selectedYear', JSON.stringify(this.selectedYear));
    localStorage.removeItem('comunal_inf')
    localStorage.removeItem('selectedMonth')
    this.selectedMonth = null;
    location.reload();
  }
}

