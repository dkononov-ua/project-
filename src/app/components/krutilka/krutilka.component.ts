import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-krutilka',
  templateUrl: './krutilka.component.html',
  styleUrls: ['./krutilka.component.scss']
})
export class KrutilkaComponent {

    months: string[] = [];

  generateMonthList(): void {
    const currentDate = new Date();
    let prevYear = '';

    for (let i = 0; i < 60; i++) {
      const year = currentDate.getFullYear() - Math.floor(i / 12);
      const month = (currentDate.getMonth() - (i % 12) + 12) % 12;
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

      this.months.push(monthName);

      if (month === 0) {
        this.months.push(year.toString());
        prevYear = year.toString();
      }
    }
  }

  onMouseWheel(event: WheelEvent): void {
    const monthList = document.querySelector('.month-list');
    if (monthList) {
      monthList.scrollTop += event.deltaY;
      event.preventDefault();
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.generateMonthList();
  }
}
