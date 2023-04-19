import { Component, HostListener, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(200%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
})
export class PaymentHistoryComponent implements OnInit {
  months: string[] = [];

  constructor() {
    this.generateMonthList();
  }
  ngOnInit(): void {  }

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



}
