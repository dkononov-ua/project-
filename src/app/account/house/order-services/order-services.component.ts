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
  selector: 'app-order-services',
  templateUrl: './order-services.component.html',
  styleUrls: ['./order-services.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ]
})
export class OrderServicesComponent implements OnInit {
  subscribers: Subscriber[] = [
    {
      id: 1,
      name: 'Сантехнік',
      photoUrl: 'assets/photo4.jpg',
      bio: 'Lorem ipsum dolor sit amet',
      instagram: 'https://www.instagram.com/',
      telegram: 'https://telegram.org/',
      viber: 'https://www.viber.com/',
      facebook: 'https://www.facebook.com/'
    },
    {
      id: 2,
      name: 'Служба доставки',
      photoUrl: 'assets/photo2.jpg',
      bio: 'Consectetur adipiscing elit',
      instagram: 'https://www.instagram.com/',
      telegram: 'https://telegram.org/',
      viber: 'https://www.viber.com/',
      facebook: 'https://www.facebook.com/'
    },
    {
      id: 3,
      name: 'Інтернет провайдер',
      photoUrl: 'assets/photo5.jpg',
      bio: 'Sed do eiusmod tempor',
      instagram: 'https://www.instagram.com/',
      telegram: 'https://telegram.org/',
      viber: 'https://www.viber.com/',
      facebook: 'https://www.facebook.com/'
    },
    {
      id: 4,
      name: 'Електрик',
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
