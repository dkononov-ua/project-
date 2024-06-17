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
import { DeleteSubComponent } from '../delete/delete-sub.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class SubscribersDiscusComponent implements OnInit, OnDestroy {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;
  // параметри користувача
  subscribers: UserInfo[] = [];
  selectedUser: UserInfo | any;
  // параметри оселі
  selectedFlatId: string | any;
  // рейтинг орендара
  ratingTenant: number | undefined;
  // статуси
  loading: boolean | undefined;
  statusMessage: any;
  statusMessageChat: any;
  chatExists = false;
  isCopiedMessage!: string;
  // показ карток
  indexPage: number = 1;
  selectedUserId: any;
  counterHouseDiscussio: any;
  counterHouseSubscriptions: any;
  counterHouseSubscribers: any;
  counterHD: any;
  page: any;
  isLoadingImg: boolean = false;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  // пагінатор
  offs = PaginationConfig.offs;
  counterFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;
  numberOfReviews: any;
  totalDays: any;
  reviews: any;
  chats: Chat[] = [];
  startX = 0;
  goBack(): void {
    this.location.back();
  }

  subscriptions: any[] = [];
  choseUser: any;

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
  ) { }

  async ngOnInit(): Promise<void> {
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );

    // Підписка на отримання обраної оселі
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
        this.selectedFlatId = selectedFlatId;
      })
    );

    // Підписка на отримання айді обраного юзера
    this.subscriptions.push(
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.selectedUserId = selectedSubscriber;
      })
    );

    // Підписка на отримання даних обраного юзера
    this.subscriptions.push(
      this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
        this.selectedUser = data;
        // Якщо є обрана оселя
        if (this.selectedUser) {
          this.indexPage = 2;
          // Запитую рейтинг власника
          await this.getRating(this.selectedUser);
          // Перевіряю чи створений чат
          await this.checkChatExistence();
        }
      })
    );

    // Підписка на отримання кількості карток
    this.subscriptions.push(
      this.counterService.counterHouseDiscussio$.subscribe(data => {
        this.counterFound = Number(data);
      })
    );

    // Підписка на зміну параметрів маршруту
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.page = params['indexPage'] || 1;
        this.indexPage = Number(this.page);
      })
    );
    // console.log(this.subscriptions)
  }

  ngOnDestroy() {
    this.choseSubscribersService.removeChosenUserId(); // очищуємо вибрану оселю
    this.cardsDataHouseService.removeCardData(); // очищуємо дані про оселю
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    // console.log(this.subscriptions)
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }
  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.router.navigate(['/house/house-info']);
      }
    } else {
      if (this.indexPage !== 1 && !this.selectedUser) {
        this.indexPage++;
      } else if (this.selectedUser && this.indexPage <= 2) {
        this.indexPage++;
      }
    }
  }

  // Отримання айді обраної оселі
  getSelectedFlatID() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
    });
  }

  // Видалення дискусії
  async deleteUser(user: any): Promise<void> {
    this.cardsDataHouseService.deleteUser(user, 'discussio');
    this.cardsDataHouseService.getResultDeleteUserSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Дискусію видалено');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }

  // Відкриваю чат
  async openChat() {
    try {
      this.sharedService.setStatusMessage('Завантажуємо чат...');
      const result = await this.getFlatChats();
      if (result === 1) {
        this.sharedService.setStatusMessage('Відкриваємо чат');
        setTimeout(() => { this.sharedService.setStatusMessage(''); this.indexPage = 4; }, 1000);
      } else if (result === 0) {
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 1000);
      }
    } catch (error) {
      console.error('Помилка при завантаженні чату:', error);
      this.sharedService.setStatusMessage('Помилка на сервері, спробуйте пізніше');
      setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
    }
  }

  // Створюю чат
  async createChat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedUserId) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: this.selectedUserId, };
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatFlat', data).toPromise();
        if (response.status === true) {
          this.sharedService.setStatusMessage('Створюємо чат');
          const result = await this.getFlatChats();
          if (result === 1) {
            setTimeout(() => { this.openChat(); }, 2000);
          } else if (result === 0) {
            this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
            setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
          }
        } else { this.statusMessageChat = true; }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Запитую та записую інформацію для виведання чату
  async getFlatChats(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, offs: 0 };
        this.http.post(this.serverPath + '/chat/get/flatchats', data).subscribe(async (response: any) => {
          if (Array.isArray(response.status) && response.status) {
            let allChatsInfo = await Promise.all(response.status.map(async (value: any) => {
              let infUser = await this.http.post(this.serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
              return { user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, unread: value.unread, lastMessage: value.last_message };
            }));
            localStorage.setItem('flatChats', JSON.stringify(allChatsInfo));
            this.chats = allChatsInfo;
            resolve(1);
          } else {
            resolve(0);
          }
        }, (error: any) => {
          console.error(error);
          reject(error);
        });
      } else {
        reject('Нічого не знайдено');
      }
    });
  }

  // Перевірка на існування чату
  async checkChatExistence(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedUserId) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, offs: this.offs };
      console.log(data)
      try {
        const response = await this.http.post(this.serverPath + '/chat/get/flatchats', data).toPromise() as any;
        console.log(response)
        if (this.selectedUserId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { user_id: any }) => chat.user_id === this.selectedUserId);
          this.chatExists = chatExists;
        }
        else { console.log('чат не існує'); }
      } catch (error) { console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

  // Отримання рейтингу
  async getRating(selectedUser: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = this.serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;

      if (response && Array.isArray(response.status)) {
        this.reviews = response.status;
        let totalMarkTenant = 0;
        this.numberOfReviews = response.status.length;

        response.status.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkTenant += item.info.mark;
          }
        });

        // Після того як всі оцінки додані, ділимо загальну суму на кількість оцінок
        if (this.numberOfReviews > 0) {
          this.ratingTenant = totalMarkTenant / this.numberOfReviews;
        } else {
          this.ratingTenant = 0;
        }

        // console.log('Кількість відгуків:', this.numberOfReviews);
      } else {
        this.reviews = undefined;
        this.ratingTenant = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Копіювання параметрів
  copyId() { this.copyToClipboard(this.selectedUser?.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.selectedUser?.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.selectedUser?.mail, 'Пошту скопійовано'); }
  copyViber() { this.copyToClipboard(this.selectedUser?.viber, 'Viber номер скопійовано'); }

  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => { this.isCopiedMessage = message; setTimeout(() => { this.isCopiedMessage = ''; }, 2000); })
        .catch((error) => { this.isCopiedMessage = ''; });
    }
  }

  // Відправка скарги на орендара, через сервіс
  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'); setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000); }
    });
  }

}

