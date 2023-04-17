import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms 200ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class PaymentHistoryComponent {
showMonth(arg0: string) {
throw new Error('Method not implemented.');
}

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonth: string | undefined;

  showMonthInfo(month: string) {
    this.selectedMonth = month;
    // тут ми можемо викликати метод для відображення інформації про вибраний місяць
  }
}
