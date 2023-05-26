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
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
})

export class AccessComponent implements OnInit{

  isChatClosed: boolean = true;

  toggleChat(): void {
    this.isChatClosed = !this.isChatClosed;
  }

  public showInput = false;
  public userId: string | undefined;
  searchQuery: string | undefined;

  constructor() { }

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


  ngOnInit(): void {
  //   console.log('Пройшла перевірка користувача');
  //   const userJson = localStorage.getItem('user');
  //   const houseJson = localStorage.getItem('house');
  //   if (userJson !== null) {
  //     if (houseJson !== null) {
  //       this.dataService.getData().subscribe((response: any) => {
  //         if (response.houseData) {
  //           this.user.firstName = response.userData.inf.firstName;
  //           this.about.bunker = response.houseData.about.bunker;

  //           if (response.houseData.imgs !== 'Картинок нема') {
  //             this.flatImg = response.houseData.imgs;
  //           }

  //           if (this.flatImg !== undefined && Array.isArray(this.flatImg) && this.flatImg.length > 0 && response.houseData.imgs !== 'Картинок нема') {
  //             for (const img of this.flatImg) {
  //               this.images.push('http://localhost:3000/img/flat/' + img.img);
  //             }
  //           } else {
  //             this.images.push('http://localhost:3000/housing_default.svg');
  //           }

  //         } else {
  //           console.error('houseData field is missing from server response');
  //         }
  //       });
  //     }
  //   }
  // }

}
}
