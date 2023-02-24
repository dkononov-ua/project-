import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-housing-search',
  templateUrl: './housing-search.component.html',
  styleUrls: ['./housing-search.component.scss']
})
export class HousingSearchComponent {
  currentCardIndex = 0;
  currentCard: any;

  cards: any[] = [
    {
      title: 'Картка 1',
      description: 'Інформація про власника.',
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
      createDeal: 'https://example.com',
      createDealText: 'Створити угоду',
      descriptionHouse: 'Інформація про оселю.',
      address: 'Київ, вул Чорнобильська №19. кв №24.',
      homeAccount: '/home-account',
      homeAccountText: 'Аккаунт оселі',
      imageCarousel: 'assets/badroom.jpg',
      imageCarousel1: 'assets/kitchwn.jpeg',
      price: '9 000 ₴/міс',
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
      createDeal: 'https://example.com',
      createDealText: 'Створити угоду',
      descriptionHouse: 'Інформація про оселю.',
      address: 'Херсон, вул Степана Бандери №3. кв №24.',
      homeAccount: '/home-account',
      homeAccountText: 'Аккаунт оселі',
      imageCarousel: 'assets/cd5dc32d8c2c7963e7b0f3bf82f5e0a4.jpg',
      imageCarousel1: 'assets/image.jpg',
      price: '10 500 ₴/міс',


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
      createDeal: 'https://example.com',
      createDealText: 'Створити угоду',
      descriptionHouse: 'Інформація про оселю.',
      address: 'Львів, вул Варшавська №11. кв №24.',
      homeAccount: '/home-account',
      homeAccountText: 'Аккаунт оселі',
      imageCarousel: 'assets/pjegjb8bq1036v0be3ums2o3o1iqrdsd.jpg',
      imageCarousel1: 'assets/stat-hitech-01.jpg',
      price: '12 000 ₴/міс',
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
