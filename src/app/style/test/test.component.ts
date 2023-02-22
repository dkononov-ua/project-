import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  cardState = 'out';

  buttonEnabled = false;

  toggleCard() {
    const currentIndex = this.cards.indexOf(this.currentCard);
    const nextIndex = (currentIndex + 1) % this.cards.length;
    this.currentCard = this.cards[nextIndex];

    if (this.cardState === 'out') {
      this.cardState = 'in';
      this.buttonText = 'Не хочу це бачити!';
      this.isCardLocked = !this.isCardLocked;
      this.buttonEnabled = true;
    } else {
      this.cardState = 'void';
      this.buttonText = 'Перейти до оплати!';
      this.isCardLocked = !this.isCardLocked;
      this.buttonEnabled = false;
    }
  }

  buttonText = 'Перейти до оплати!';

  isCardLocked = true;

  toggleCardLock() {
    this.isCardLocked = !this.isCardLocked;
  }

  currentCard: any;
  cards: any[] = [
    {
      title: 'Картка 1',
      description: 'Опис першої картки.'
    },
    {
      title: 'Картка 2',
      description: 'Опис другої картки.'
    },
    {
      title: 'Картка 3',
      description: 'Опис третьої картки.'
    }
  ];

  constructor() {
    this.currentCard = this.cards[0];
  }
}
