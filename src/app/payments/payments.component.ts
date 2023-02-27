import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(140%)' }),
        animate('2000ms 1000ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
            transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-200%)' }))
      ])
    ])
  ]
})

export class PaymentsComponent {

}
