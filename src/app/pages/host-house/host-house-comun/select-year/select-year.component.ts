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
  selectedMonth: any;
  selectedYear!: number; // Чітке оголошення як число
  serviceYear: any;

  year1: boolean = true;
  year2: boolean = false;

  constructor(
    private changeYearService: ChangeYearService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    // Підписка на зміну року через сервіс
    this.changeYearService.selectedYear$.subscribe(year => {
      const parsedYear = Number(year);
      if (parsedYear && parsedYear >= 1900 && parsedYear <= 2100) {
        this.selectedYear = parsedYear;
      } else {
        this.selectedYear = new Date().getFullYear(); // Резервне значення
      }
    });

    // Перевірка при першому завантаженні
    if (!this.selectedYear || this.selectedYear < 1900 || this.selectedYear > 2100) {
      this.selectedYear = new Date().getFullYear();
    }
  }

  toogleYear() {
    this.year1 = !this.year1;
    this.year2 = !this.year2;
  }

  prevYear() {
    this.selectedYear = this.ensureYearValidity(this.selectedYear - 1); // Перевірка валідності
    this.onSelectionChangeYear(this.selectedYear.toString());
    this.toogleYear();
  }

  nextYear() {
    this.selectedYear = this.ensureYearValidity(this.selectedYear + 1); // Перевірка валідності
    this.onSelectionChangeYear(this.selectedYear.toString());
    this.toogleYear();
  }

  onSelectionChangeYear(selectedYear: string): void {
    const parsedYear = Number(selectedYear);
    if (parsedYear && parsedYear >= 1900 && parsedYear <= 2100) {
      localStorage.removeItem('comunal_inf');
      this.changeYearService.setSelectedYear(parsedYear.toString());
    } else {
      console.error('Некоректний рік:', selectedYear);
    }
  }

  // Додаткова функція для перевірки валідності року
  private ensureYearValidity(year: number): number {
    if (year < 1900) {
      console.warn('Рік не може бути меншим за 1900. Встановлено 1900.');
      return 1900;
    }
    if (year > 2100) {
      console.warn('Рік не може бути більшим за 2100. Встановлено 2100.');
      return 2100;
    }
    return year;
  }
}
