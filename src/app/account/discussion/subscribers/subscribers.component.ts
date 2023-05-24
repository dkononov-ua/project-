import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';


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
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ]
})
export class SubscribersComponent implements OnInit {
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
    {
      id: 3,
      name: 'Віктор Яковець',
      photoUrl: 'assets/photo5.jpg',
      bio: 'Sed do eiusmod tempor',
      instagram: 'https://www.instagram.com/',
      telegram: 'https://telegram.org/',
      viber: 'https://www.viber.com/',
      facebook: 'https://www.facebook.com/'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  approveSubscriber(subscriber: Subscriber): void {
    // Code to approve subscriber
  }

  removeSubscriber(subscriber: Subscriber): void {
    // Code to remove subscriber
  }
}
