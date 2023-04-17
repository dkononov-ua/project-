import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ],
})
export class EnergyComponent {

}
