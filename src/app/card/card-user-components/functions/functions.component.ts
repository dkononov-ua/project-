import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import { UserInfo } from 'src/app/interface/info';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { CreateChatService } from 'src/app/chat/create-chat.service';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(1220%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(1220%)' }))
      ]),
    ]),
    animations.top4,
    animations.left2,
  ],
})

export class FunctionsComponent implements OnInit, OnDestroy {

  disabledBtn: boolean = false;
  houseData: any;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

  toggleAllMenu(index: number) {
    this.linkOpen[index] = !this.linkOpen[index];
    this.disabledBtn = true;
    if (this.menu[index]) {
      setTimeout(() => {
        this.menu[index] = !this.menu[index];
        this.disabledBtn = false;
      }, 600);
    } else {
      this.menu[index] = !this.menu[index];
      this.disabledBtn = false;
    }
  }

  serverPath: string = '';
  subscribers: UserInfo[] = [];
  chatExists: boolean = false;
  currentLocation: string = '';
  subscriptions: any[] = [];
  choseUser: any;
  user: any;
  selectedFlatId: any;
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private router: Router,
    private location: Location,
    private cardsDataHouseService: CardsDataHouseService,
    private cardsDataService: CardsDataService,
    private createChatService: CreateChatService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
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

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getSelectedFlatId();
      this.checkLocation();
    } else {
      this.authorization = false;
    }
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
      })
    );
  }

  checkLocation() {
    // Якщо я в меню користувача
    if (
      this.currentLocation === '/user/discus/discussion' ||
      this.currentLocation === '/user/discus/subscribers-user' ||
      this.currentLocation === '/user/discus/subscriptions-user'
    ) {
      this.subscriptions.push(
        this.cardsDataService.cardData$.subscribe(async (data: any) => {
          // console.log(data)
          this.user = data.owner;
          this.checkChatExistence();
        })
      );
      // Якщо я в меню оселі
    } else if (
      this.currentLocation === '/subscribers-discus' ||
      this.currentLocation === '/subscribers-house' ||
      this.currentLocation === '/subscriptions-house'
    ) {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
          this.checkChatExistence();
          // console.log(this.user)
        })
      );
    } else if (this.currentLocation === '/user/info') {
      this.getInfoUser();
    } else if (this.currentLocation === '/search-tenants') {
      this.subscriptions.push(
        this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
          this.user = data;
          // console.log(this.user)
        })
      );
    }
  }

  getInfoUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userObject = JSON.parse(userData);
      this.user = userObject.inf;
      // console.log(this.user)
    }
  }

  ngOnDestroy() {
    this.cardsDataHouseService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Видалення карток
  async deleteUser(user: any): Promise<void> {
    if (this.currentLocation === '/subscribers-discus') {
      this.cardsDataHouseService.deleteUser(user, 'discussio');
    } else if (this.currentLocation === '/subscribers-house') {
      this.cardsDataHouseService.deleteUser(user, 'subscribers');
    } else if (this.currentLocation === '/subscriptions-house') {
      this.cardsDataHouseService.deleteUser(user, 'subscriptions');
    }
    this.cardsDataHouseService.getResultDeleteUserSubject().subscribe(result => {
      if (result.status === true) {
        if (this.currentLocation === '/subscribers-discuss') {
          this.sharedService.setStatusMessage('Дискусію видалено');
        } else if (this.currentLocation === '/subscribers-user') {
          this.sharedService.setStatusMessage('Підписника видалено');
        } else if (this.currentLocation === '/subscriptions-user') {
          this.sharedService.setStatusMessage('Підписку видалено');
        }
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }

  // Перевіряємо в сервісі існування чату оселі з обраним користувачем
  async checkChatExistence(): Promise<any> {
    if (this.currentLocation === '/subscribers-discus' || this.currentLocation === '/house/residents') {
      const chatExists = await this.createChatService.checkChatExistence();
      this.chatExists = chatExists;
    }
  }

  // Якщо чат є переходимо до чату
  openChat() {
    if (this.chatExists) {
      this.choseSubscribersService.setSelectedSubscriber(this.user.user_id);
      this.router.navigate(['/chat-house']);
    }
  }

  // Через сервіс створюємо чат
  createChat() {
    this.createChatService.createChat();
  }

  // Відправка скарги на користувача, через сервіс
  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000); }
    });
  }

  // Ухвалення користувача до дискусії
  async approveSubscriber(subscriber: UserInfo): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, user_id: subscriber.user_id, };
      try {
        const response: any = await this.http.post(this.serverPath + '/subs/accept', data).toPromise();
        if (response.status == true) {
          this.sharedService.setStatusMessage('Ухвалено')
          this.counterService.getHouseSubscribersCount(this.selectedFlatId);
          this.counterService.getHouseDiscussioCount(this.selectedFlatId);
          setTimeout(() => {
            this.sharedService.setStatusMessage('Переходимо до Дискусії');
            setTimeout(() => {
              this.router.navigate(['/subscribers-discus']);
              this.sharedService.setStatusMessage('');
            }, 1000);
          }, 2000);
        } else if (response.status === 'Ви в дискусії') {
          this.sharedService.setStatusMessage('З цим користувачем вже є дискусія'),
            setTimeout(() => {
              this.router.navigate(['/subscribers-discus']);
              this.sharedService.setStatusMessage('');
            }, 2000);
        }
        else {
          this.sharedService.setStatusMessage('Помилка'),
            setTimeout(() => {
              location.reload();
            }, 1000);
        }
      } catch (error) {
        (error: any) => { this.sharedService.setStatusMessage('Помилка'), setTimeout(() => { location.reload(); }, 2000); console.error(error); }
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }
}


