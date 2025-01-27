import { Component, OnInit } from '@angular/core';
import { ChangeYearService } from '../../../../services/comun/change-year.service';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-select-year',
  templateUrl: './select-year.component.html',
  styleUrls: ['./select-year.component.scss'],
  animations: [
    animations.right1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
    animations.top1,
  ],
})
export class SelectYearComponent implements OnInit {

  loading = false;
  // years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  selectedMonth: any;
  selectedYear!: any;
  serviceYear: any;

  year1: boolean = true;
  year2: boolean = false;

  constructor(
    private changeYearService: ChangeYearService,
    private sharedService: SharedService,
  ) {  }

  ngOnInit(): void {
    this.changeYearService.selectedYear$.subscribe(year => {
      if (year) {
        this.selectedYear = year;
      } else {
        this.selectedYear = new Date().getFullYear();
      }
    });
    if (this.selectedYear === undefined || this.selectedYear === null || this.selectedYear === 0 || this.selectedYear === '0') {
      this.selectedYear = new Date().getFullYear();
    }
  }

  toogleYear() {
    this.year1 = !this.year1;
    this.year2 = !this.year2;
  }

  prevYear() {
    this.selectedYear--;
    this.onSelectionChangeYear(this.selectedYear.toString());
    this.toogleYear()
  }

  nextYear() {
    this.selectedYear++;
    this.onSelectionChangeYear(this.selectedYear.toString());
    this.toogleYear()
  }

  onSelectionChangeYear(selectedYear: string): void {
    localStorage.removeItem('comunal_inf');
    this.changeYearService.setSelectedYear(selectedYear);
  }
}

