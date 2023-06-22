import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-agree-house',
  templateUrl: './agree-house.component.html',
  styleUrls: ['./agree-house.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ]
})

export class AgreeHouseComponent {
  files = [
    { name: 'Сформувати угоду', url: 'agreement' },
    { name: 'Надіслані угоди', url: 'agreements-h' },
    { name: 'Заключені угоди', url: 'assets/files/lease_agreement.pdf' },
    { name: 'документи на оселю', url: 'assets/files/documents.pdf' },
  ];
}

