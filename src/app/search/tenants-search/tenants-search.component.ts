import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tenants-search',
  templateUrl: './tenants-search.component.html',
  styleUrls: ['./tenants-search.component.scss'],
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
  ]
})

export class TenantsSearchComponent {
  // @HostBinding('@cardAnimation') cardAnimation = true;
  cardState: string | undefined;

  toggleCard() {
    this.buttonText = this.cardState === 'out' ? 'Ухвалити' : 'Ухвалено!';
  }

  buttonText = 'Ухвалити';

  currentCardIndex = 0;
  currentCard: any;

  cards: any[] = [
    {
      title: 'Картка 1',
      description: 'Інформація про орендаря.',
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
      createDeal: 'agreement',
      createDealText: 'Створити угоду',
      numberRooms: '2-3',
      district: 'Поділ',
      city: 'Київ',
      typeHousing: 'Квартира',
      animals: 'Кіт',
      desiredPrice: '8 000грн - 10 000грн',
    },

    {
      title: 'Картка 2',
      description: 'Інформація про орендаря.',
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
      createDeal: 'agreement',
      createDealText: 'Створити угоду',
      subscriber: 'Підписаний на вашу оселю',
      numberRooms: '2',
      district: 'Святошинський',
      city: 'Київ',
      typeHousing: 'Квартира',
      animals: 'Кіт',
      desiredPrice: '9 000грн - 12 000грн',

    },
    {
      title: 'Картка 3',
      description: 'Інформація про орендаря.',
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
      createDeal: 'agreement',
      createDealText: 'Створити угоду',
      numberRooms: '1',
      district: 'Лопань',
      city: 'Харків',
      typeHousing: 'Квартира',
      animals: 'Пес',
      desiredPrice: '5 000грн - 6 000грн',

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
