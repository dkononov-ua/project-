import { Component, OnInit } from '@angular/core';
import { ChangeYearService } from '../change-year.service';

@Component({
  selector: 'app-select-year',
  templateUrl: './select-year.component.html',
  styleUrls: ['./select-year.component.scss']
})
export class SelectYearComponent implements OnInit {

  loading = false;
  years = [2024, 2023, 2022, 2021, 2020];
  selectedMonth: any;
  selectedYear!: number;

  constructor(private changeYearService: ChangeYearService) {
  }

  ngOnInit(): void {
    this.changeYearService.selectedYear$.subscribe(year => {
      if (year !== null && year !== undefined) {
        this.selectedYear = year;
      } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        this.selectedYear = currentYear;
      }
    });
  }

  onSelectionChangeYear(): void {
    localStorage.removeItem('comunal_inf');
    localStorage.removeItem('selectedYear');
    this.changeYearService.setSelectedYear(this.selectedYear);
    localStorage.setItem('selectedYear', this.selectedYear.toString());
  }
}
