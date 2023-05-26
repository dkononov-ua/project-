import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { SubsCountService } from 'src/app/services/subs-count.service';


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
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  public showInput = false;
  public userId: string | undefined;
  searchQuery: string | undefined;
  subscribersCount: number = 0;

  constructor( private SubsCountService: SubsCountService ) { }

  ngOnInit(): void {
    this.SubsCountService.subscribersCount$.subscribe(count => {
      this.subscribersCount = count;
    });
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
