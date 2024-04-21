import { Component, OnInit } from '@angular/core';
import { ChangeMonthService } from '../change-month.service';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../interface/animation';
import { ChangeYearService } from '../change-year.service';

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss'],
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
export class SelectMonthComponent implements OnInit {

  months: { id: number, name: string }[] = [
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

  selectedMonth!: any;
  currentMonth: any;
  serviceMonth: any;
  selectedMonthID: { id: number, name: string } = { id: 0, name: '' };
  currentIndex: number = 0;
  selectedYear: any;

  month1: boolean = true;
  month2: boolean = false;

  constructor(
    private sharedService: SharedService,
    private changeMonthService: ChangeMonthService,
    private changeYearService: ChangeYearService,
  ) {
    this.changeMonthService.selectedMonth$.subscribe((selectedMonth: string | null) => {
      this.selectedMonth = selectedMonth || this.selectedMonth;
    });
    this.changeYearService.selectedYear$.subscribe((selectedYear: string | null) => {
      this.selectedYear = selectedYear || this.selectedYear;
    });
  }

  ngOnInit(): void {
    const storedMonth = localStorage.getItem('selectedMonth');
    if (storedMonth === 'undefined' || !storedMonth) {
      this.getMonthCurrent();
    } else {
      this.selectedMonth = storedMonth;
    }
  }

  toogleMonth() {
    this.month1 = !this.month1;
    this.month2 = !this.month2;
  }

  nextMonth() {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    this.toogleMonth();
    if (this.currentIndex < 11) {
      const previousMonth = this.months[this.currentIndex + 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
    } else if (this.currentIndex === 11) {
      this.currentIndex = 0;
      this.changeMonthService.setSelectedMonth('Січень');
      const yearChange = Number(this.selectedYear) + 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }

  prevMonth(): void {
    this.selectedMonthID = this.months.find(month => month.name === this.selectedMonth) || { id: 0, name: '' };
    this.currentIndex = this.selectedMonthID.id;
    this.toogleMonth();
    if (this.currentIndex > 0) {
      const previousMonth = this.months[this.currentIndex - 1].name;
      this.changeMonthService.setSelectedMonth(previousMonth);
    } else if (this.currentIndex === 0) {
      this.currentIndex = 11;
      this.changeMonthService.setSelectedMonth('Грудень');
      const yearChange = Number(this.selectedYear) - 1;
      this.changeYearService.setSelectedYear((yearChange).toString());
    }
  }

  getMonthCurrent() {
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth();
    const selectedMonth = this.months.find(month => month.id === this.currentMonth) || { id: 0, name: '' };
    this.changeMonthService.setSelectedMonth(selectedMonth.name);
  }

  onSelectionChangeMonth(selectedMonth: any): void {
    this.changeMonthService.setSelectedMonth(selectedMonth);
  }

}
