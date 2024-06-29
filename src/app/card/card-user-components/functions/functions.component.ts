import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { Chat } from '../../../interface/info';
import { animations } from '../../../interface/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DeleteSubComponent } from '../../../discussi/discussio-house/delete/delete-sub.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { CreateChatService } from 'src/app/chat/create-chat.service';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [animations.top4],
})

export class FunctionsComponent implements OnInit, OnDestroy {

  serverPath: string = '';
  subscribers: UserInfo[] = [];
  // рейтинг орендара
  ratingTenant: number | undefined;
  // статуси
  loading: boolean | undefined;
  chatExists: boolean = false;
  currentLocation: string = '';

  numberOfReviews: any;
  reviews: any;
  goBack(): void {
    this.location.back();
  }

  subscriptions: any[] = [];
  choseUser: any;
  user: any;
  selectedFlatId: any;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private statusDataService: StatusDataService,
    private cardsDataHouseService: CardsDataHouseService,
    private cardsDataService: CardsDataService,
    private createChatService: CreateChatService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
        this.selectedFlatId = selectedFlatId;
      })
    );
    this.checkLocation();
  }

  checkLocation() {
    // Якщо я в меню користувача
    if (
      this.currentLocation === '/subscribers-discuss' ||
      this.currentLocation === '/subscribers-user' ||
      this.currentLocation === '/subscriptions-user'
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
    // this.choseSubscribersService.removeChosenUserId(); // очищуємо вибір
    this.cardsDataHouseService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
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
    const chatExists = await this.createChatService.checkChatExistence();
    this.chatExists = chatExists;
    // console.log(chatExists)
  }

  openChat() {
    if (this.chatExists) {
      this.choseSubscribersService.setSelectedSubscriber(this.user.user_id);
      this.router.navigate(['/chat-house']);
    }
  }

  createChat() {
    this.createChatService.createChat();
  }

  // Відправка скарги на орендаря, через сервіс
  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000); }
    });
  }


  // Ухвалення до дискусії
  async approveSubscriber(subscriber: UserInfo): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, user_id: subscriber.user_id, };
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
      (error: any) => { this.sharedService.setStatusMessage('Помилка'), setTimeout(() => { location.reload(); }, 2000); console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

}


