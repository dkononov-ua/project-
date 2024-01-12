import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1400ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1800ms 600ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('2000ms 800ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation5', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('2200ms 1000ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],

})
export class InstructionComponent {

}
