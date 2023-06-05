import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../chose-subscribe.service';

@Component({
  selector: 'app-house-discussio',
  templateUrl: './house-discussio.component.html',
  styleUrls: ['./house-discussio.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
})
export class HouseDiscussioComponent implements OnInit {

  isOpen = true;
  isOnline = true;
  isOffline = false;
  idleTimeout: any;
  isCopied = false;

  user = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    tell: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  house = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: '',
    flat_index: '',
    private: Number(''),
    rent: Number(''),
    live: Number(''),
    who_live: Number(''),
    subscribers: '',
  };

  param = {
    region: '',
    rooms: '',
    area: '',
    kitchen_area: '',
    repair_status: Number(''),
    floor: '',
    balcony: Number(''),
  };

  options: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Новий',
    2: 'Добрий',
    3: 'Задовільний',
    4: 'Поганий',
    5: 'Класичний балкон',
    6: 'Французький балкон',
    7: 'Лоджія',
    8: 'Тераса',
    9: 'Веранда',
    10: 'Підземний паркінг',
    11: 'Є повноцінне укриття в будинку',
    12: 'Є укриття поряд з будинком',
    13: 'Немає',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    1: 'до 100м',
    2: 'до 300м',
    3: 'до 500м',
    4: 'до 1км',
    5: 'на території',
  }

  checkBox: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Так',
    2: 'Ні',
  }

  checkBoxAnimals: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Без тварин',
    2: 'За попередньою домовленістю',
    3: 'Можна з тваринами',
  }

  about = {
    distance_metro: Number(''),
    distance_stop: Number(''),
    distance_shop: Number(''),
    distance_green: Number(''),
    distance_parking: Number(''),
    woman: Number(''),
    man: Number(''),
    family: Number(''),
    students: Number(''),
    animals: Number(''),
    price_m: Number(''),
    price_y: '',
    about: '',
    bunker: Number(''),
  };
  subscriptions: { flat_id: any; flatImg: any; price_m: any; }[] | undefined;

  copyFlatId() {
    const flatId = this.house.flat_id;

    navigator.clipboard.writeText(flatId)
      .then(() => {
        console.log('ID оселі скопійовано!');
        this.isCopied = true;

        setTimeout(() => {
          this.isCopied = false;
        }, 2000);
      })
      .catch((error) => {
        console.log('Помилка при копіюванні ID оселі.');
        this.isCopied = false;
      });
  }

  addressHouse: any;
  images: string[] = [];
  flatImg: any = [{ img: "housing_default.svg" }];

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private dataService: DataService,
    private choseSubscribeService: ChoseSubscribeService,
    ) { }

    ngOnInit(): void {
      this.getSubscribedFlats();
      const selectedFlatId = this.choseSubscribeService.chosenFlatId;
      if (selectedFlatId !== undefined) {
        // Тут ви можете використовувати значення selectedFlatId
      }

      this.startIdleTimer();
      document.addEventListener('click', () => {
        if (this.isOnline) {
          clearTimeout(this.idleTimeout);
          this.startIdleTimer();
        }
      });

      this.getData(); // Доданий виклик методу getData()
    }


  async getSubscribedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscriptions = response.map((flat: any) => {
        return {
          flat_id: flat.flat.flat_id,
          flatImg: flat.img,
          price_m: flat.flat.price_m,
        };
      });

      this.subscriptions = newSubscriptions;

      // Збереження обраної оселі
      const selectedFlatId = this.choseSubscribeService.chosenFlatId;
      if (selectedFlatId !== undefined) {
        const selectedFlat = this.subscriptions.find((subscription) => subscription.flat_id === selectedFlatId);
        if (selectedFlat) {
          this.choseSubscribeService.selectedFlat = selectedFlat;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getData() {
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          if (response.houseData) {
            const selectedFlat = this.choseSubscribeService.selectedFlat;
            if (selectedFlat) {
            }

            this.user.firstName = response.userData.inf.firstName;
            this.user.lastName = response.userData.inf.lastName;
            // ...

            this.house.region = response.houseData.flat.region;
            this.house.flat_id = response.houseData.flat.flat_id;
            // ...

            this.param.rooms = response.houseData.param.rooms;
            this.param.repair_status = response.houseData.param.repair_status;
            // ...

            this.about.distance_metro = response.houseData.about.distance_metro;
            this.about.distance_stop = response.houseData.about.distance_stop;
            // ...

            if (response.houseData.imgs !== 'Картинок нема') {
              this.flatImg = response.houseData.imgs;
            }

            // ...
          } else {
            console.error('houseData field is missing from server response');
          }
        });
      }
    }
  }

  resetOnlineStatus(): void {
    clearTimeout(this.idleTimeout);
    this.startIdleTimer();
  }

  startIdleTimer(): void {
    this.idleTimeout = setTimeout(() => {
      this.isOnline = false;
      this.isOffline = true;
    }, 5 * 60 * 1000); // 5 хвилин * 60 секунд * 1000 мілісекунд
  }


}


