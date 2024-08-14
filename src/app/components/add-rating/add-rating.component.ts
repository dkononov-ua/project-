import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { DatePipe } from '@angular/common';

export class Rating {
  constructor(
    public ratingComment: string = '',
    public ratingValue: string = '',
    public ratingDate: string = '',
  ) { }
}

interface Subscriber {
  acces_flat_chats: boolean;
  acces_flat_features: boolean;
  acces_agent: boolean;
  acces_comunal_indexes: boolean;
  acces_citizen: boolean;
  acces_agreement: boolean;
  acces_discuss: boolean;
  acces_subs: boolean;
  acces_filling: boolean;
  acces_services: boolean;
  acces_admin: boolean;
  acces_comunal: boolean;
  acces_added: boolean;
  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  tell: number;
  photo: string;
  img: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  mail: string;
}

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss']
})

export class AddRatingComponent implements OnInit {

  rating: Rating = new Rating();
  link: string = '';
  sendedData: any;
  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;
  houseData: any;

  loading = false;
  statusMessage: string | undefined;

  // імпорт шляхів
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  selectedSubscriber: Subscriber[] | any;
  subscribers: Subscriber[] = [];
  minDate!: string;
  maxDate!: string;
  helpMenu: boolean = false;
  helpInfo: number = 0;
  selectedFlatId: string | any;
  allResidents: any;

  openHelpMenu(helpInfoIndex: number) {
    this.helpInfo = helpInfoIndex;
    this.helpMenu = !this.helpMenu;
  }

  // Перевірка на можливість надіслати відгук
  setMinMaxDate(daysBeforeToday: number) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - daysBeforeToday);
    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // Логіка встановлення доступів для користувачів
  accesCheck() {
    if (this.selectedSubscriber) {
      if (!this.selectedSubscriber.acces_added) {
        this.selectedSubscriber.acces_admin = false;
      }
      if (!this.selectedSubscriber.acces_comunal_indexes) {
        this.selectedSubscriber.acces_comunal = false;
      }
      if (!this.selectedSubscriber.acces_agent) {
        this.selectedSubscriber.acces_agreement = false;
      }
    }
  }
  subscriptions: any[] = [];
  isMobile: boolean = false;
  authorization: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private sharedService: SharedService,
    private cardsDataHouseService: CardsDataHouseService,
    private datePipe: DatePipe,
  ) {
    if (data) {
      this.selectedSubscriber = data;
    } console.log(data)
  }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    this.getSelectedFlatId();
    this.checkUserAuthorization();
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        if (flatId) {
          this.selectedFlatId = flatId || this.selectedFlatId || null;
        } else {
          this.sharedService.logoutHouse();
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.checkHouseAuthorization();
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на авторизацію оселі
  async checkHouseAuthorization() {
    const houseData = localStorage.getItem('houseData');
    if (this.selectedFlatId && houseData) {
      this.authorizationHouse = true;
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      this.getHouseAcces();
    }
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      if (this.acces_added === 1) {
        // this.selectResidents();
      }
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
      this.acces_agreement = this.houseData.acces.acces_agreement;
    } else {
      // this.selectResidents();
    }
  }

  // Дії якщо я обрав мешканця
  // async selectResidents(): Promise<any> {

  //   this.subscriptions.push(
  //     this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
  //       if (data) {
  //         this.selectedSubscriber = data;
  //         console.log(this.selectedSubscriber)
  //       } else {
  //         this.selectedSubscriber = undefined;
  //       }
  //     })
  //   );
  // }

  // Надсилаю оцінку орендарю
  async sendRating(selectedSubscriber: any) {

    const formattedDate = this.datePipe.transform(this.rating.ratingDate, 'yyyy-MM-dd');
    const userJson = localStorage.getItem('user');
    console.log(selectedSubscriber)

    if (userJson && selectedSubscriber.type === 'tenant') {
      console.log('userRating')
      this.link = '/rating/add/userRating';
      this.sendedData = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedSubscriber.user.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue,
      };
    }
    if (userJson && selectedSubscriber.type === 'owner') {
      console.log('flatrating')
      this.link = '/rating/add/flatrating';
      this.sendedData = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedSubscriber.user.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue
      };
    }
    try {
      console.log(this.sendedData)
      console.log(this.link)
      const response: any = await this.http.post(this.serverPath + this.link, this.sendedData).toPromise() as any;
      console.log(response)
      let setMark = this.rating.ratingValue.toString();
      if (response.status === true && setMark === '5') {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Дякуємо за підтримку гарних людей');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відгук збережено!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 2000);
        }, 200);
      }

      else if (response.status === true && setMark === '4') {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Добрі стосунки це важливо');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відгук збережено, дякуємо!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 2000);
        }, 200);
      }

      else if (response.status === true && setMark === '3') {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Стабільність це добре');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відгук збережено, дякуємо!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 2000);
        }, 200);
      }

      else if (response.status === true && setMark === '2') {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Йой, сподіваємось все налагодиться');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відгук збережено!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 2000);
        }, 200);
      }

      else if (response.status === true && setMark === '1') {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Напевно є не закриті питання');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Відгук збережено!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 2000);
        }, 200);
      }

      else if (response.status === 'Нажаль данну оцінку не змінити') {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Відгук за обраною датою закритий');
          setTimeout(() => {
            this.sharedService.setStatusMessage('Оберіть іншу дату');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 2000);
          }, 2000);
        }, 200);
      }

      else {
        setTimeout(() => {
          this.sharedService.setStatusMessage('Помилка збереження');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
          }, 2000);
        }, 200);
      }

      setTimeout(() => {
      }, 4000);
      this.rating.ratingComment = '';
    } catch (error) {
      console.log(error)
    }
  }



}
