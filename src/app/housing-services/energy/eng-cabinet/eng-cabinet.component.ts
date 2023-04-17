import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-eng-cabinet',
  templateUrl: './eng-cabinet.component.html',
  styleUrls: ['./eng-cabinet.component.scss'],
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
export class EngCabinetComponent {

}
