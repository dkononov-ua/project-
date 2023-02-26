import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('1500ms 800ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
            transition('* => void', [
        animate('800ms ease-in-out', style({ transform: 'translateX(-200%)' }))
      ])
    ])
  ]
})

export class SearchComponent {
  @HostBinding('@cardAnimation') cardAnimation = true;

  currentCardIndex = 0;
  currentCard: any;

  cards: any[] = [
    {
      title: 'Картка 1',
      description: 'Інформація про орендатора.',
      tell: '+380677727447',
      firstName: 'Олена',
      lastName: 'Кругляк',
      image: 'assets/photo3.JPG',
      passport: 'https://example.com',
      passportText: 'Документи',
      grantAccess: 'https://example.com',
      grantAccessText: 'Надати доступ',
      bankDetails: 'https://example.com',
      bankDetailsText: 'Реквізити',
      createDeal: 'payments',
      createDealText: 'Створити угоду',
    },

    {
      title: 'Картка 2',
      description: 'Інформація про орендатора.',
      tell: '+380677727447',
      firstName: 'Максим',
      lastName: 'Олійник',
      image: 'assets/photo2.jpg',
      passport: 'https://example.com',
      passportText: 'Документи',
      grantAccess: 'https://example.com',
      grantAccessText: 'Надати доступ',
      bankDetails: 'https://example.com',
      bankDetailsText: 'Реквізити',
      createDeal: 'payments',
      createDealText: 'Створити угоду',
    },
    {
      title: 'Картка 3',
      description: 'Інформація про орендатора.',
      tell: '+380677727447',
      firstName: 'Віталій',
      lastName: ' Селіверстов',
      image: 'assets/photo4.jpg',
      passport: 'https://example.com',
      passportText: 'Документи',
      grantAccess: 'https://example.com',
      grantAccessText: 'Надати доступ',
      bankDetails: 'https://example.com',
      bankDetailsText: 'Реквізити',
      createDeal: 'payments',
      createDealText: 'Створити угоду',
    }
  ];

  @Input() currentRating = 0;
  @Output() ratingUpdated = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  rate(rating: number) {
    this.currentRating = rating;
    this.ratingUpdated.emit(rating);
  }

  constructor() {
    this.currentCard = this.cards[this.currentCardIndex];
  }

  onNextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
    this.currentCard = this.cards[this.currentCardIndex];
  }

  onPrevCard() {
    this.currentCardIndex = (this.currentCardIndex - 1 + this.cards.length) % this.cards.length;
    this.currentCard = this.cards[this.currentCardIndex];
  }

  onSubscribe() {
    // Do something when subscribe button is clicked
  }
}
