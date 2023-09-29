import { Component, OnInit } from '@angular/core';
import { ChangeYearService } from '../change-year.service';

@Component({
  selector: 'app-select-year',
  templateUrl: './select-year.component.html',
  styleUrls: ['./select-year.component.scss']
})
export class SelectYearComponent implements OnInit {

  loading = false;
  years = ['2023', '2022', '2021', '2020'];
  selectedMonth: any;
  selectedYear!: any;
  serviceYear: any;

  constructor(private changeYearService: ChangeYearService) {  }

  ngOnInit(): void {
    this.getYearService();
    if (!this.selectedYear) {
      this.getYearCurrent();
      this.changeYearService.setSelectedYear(this.selectedYear);
    }
  }

  getYearService() {
    this.changeYearService.selectedYear$.subscribe(year => {
      this.serviceYear = year;
      this.selectedYear = this.years.find(item => item === this.serviceYear);
    });
  }

  getYearCurrent() {
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear();
  }

  onSelectionChangeYear(): void {
    localStorage.removeItem('comunal_inf');
    this.changeYearService.setSelectedYear(this.selectedYear);
  }
}

