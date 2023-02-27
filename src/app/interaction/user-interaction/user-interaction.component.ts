import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-interaction',
  templateUrl: './user-interaction.component.html',
  styleUrls: ['./user-interaction.component.scss'],
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
export class UserInteractionComponent {

}
