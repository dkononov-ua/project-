import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-about-rating',
  templateUrl: './about-rating.component.html',
  styleUrls: ['./about-rating.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2500ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2000ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('3000ms 600ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2500ms 500ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ]
})
export class AboutRatingComponent {

}
