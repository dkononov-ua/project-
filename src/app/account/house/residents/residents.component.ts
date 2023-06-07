import { Component, OnInit } from '@angular/core';

interface Subscriber {
  id: number;
  name: string;
  photoUrl: string;
  bio: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}

@Component({
  selector: 'app-residents',
  templateUrl: './residents.component.html',
  styleUrls: ['./residents.component.scss']
})
export class ResidentsComponent implements OnInit {
// Компонент
isChatClosed: boolean = true;
isAccessClosed: boolean = true;

  // Компонент
  toggleChat() {
    this.isChatClosed = !this.isChatClosed;
  }

  toggleAccess() {
    this.isAccessClosed = !this.isAccessClosed;
  }


  public showInput = false;
  public userId: string | undefined;
  searchQuery: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  public addUserToHouse(): void {
    // Додати код для додавання користувача до оселі за допомогою userId
    console.log(`Користувач з ID ${this.userId} доданий до оселі.`);
    this.userId = '';
    this.showInput = false;
  }
  subscribers: Subscriber[] = [
    {
      id: 1,
      name: 'Віталій Селіверстов',
      photoUrl: 'assets/photo4.jpg',
      bio: 'Lorem ipsum dolor sit amet',
      instagram: 'https://www.instagram.com/',
      telegram: 'https://telegram.org/',
      viber: 'https://www.viber.com/',
      facebook: 'https://www.facebook.com/'
    },
    {
      id: 2,
      name: 'Максим Олійник',
      photoUrl: 'assets/photo2.jpg',
      bio: 'Consectetur adipiscing elit',
      instagram: 'https://www.instagram.com/',
      telegram: 'https://telegram.org/',
      viber: 'https://www.viber.com/',
      facebook: 'https://www.facebook.com/'
    },

  ];

  approveSubscriber(subscriber: Subscriber): void {
    // Code to approve subscriber
  }

  removeSubscriber(subscriber: Subscriber): void {
    // Code to remove subscriber
  }
}
