import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss'],

  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(5%)'
      })),
      state('out', style({
        transform: 'translateX(-90%)'
      })),
      transition('in => out', animate('1000ms ease-out')),
      transition('out => in', animate('1000ms ease-in'))
    ])
  ]
})

export class CleaningComponent {
  cardState = 'out';
  isCardLocked = true;
  buttonEnabled = false;


  toggleCard() {
    this.cardState = this.cardState === 'out' ? 'in' : 'out';
    this.buttonText = this.cardState === 'out' ? 'Перейти до оплати!' : 'Не хочу це бачити!';
    this.isCardLocked = !this.isCardLocked;
    this.buttonEnabled = true;
  }

  buttonText = 'Перейти до оплати!';
}
