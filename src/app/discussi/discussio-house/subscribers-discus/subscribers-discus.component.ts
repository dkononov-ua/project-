import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSubComponent } from '../delete-sub/delete-sub.component';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { Chat } from '../../../interface/info';

@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
  ],
})

export class SubscribersDiscusComponent implements OnInit {
  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;
  // шляхи до серверу
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
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
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  selectedUserID: any;
  counterHouseDiscussio: any;
  counterHouseSubscriptions: any;
  counterHouseSubscribers: any;
  counterHD: any;
  onClickMenu(indexMenu: number, indexPage: number, indexMenuMobile: number,) {
    this.indexMenu = indexMenu;
    this.indexPage = indexPage;
    this.indexMenuMobile = indexMenuMobile;
  }
  openInfoUser() { this.card_info = true; }
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

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCounterHouse();
    this.getSelectedFlatID();
  }

  // отримання, кількіст дискусій та запит на якій я сторінці
  async getCounterHouse() {
    this.counterService.counterHouseDiscussio$.subscribe(async data => {
      this.counterHouseDiscussio = data;
      this.counterFound = this.counterHouseDiscussio.status;
      if (this.counterFound) {
        await this.getCurrentPageInfo();
      }
    })
  }

  // Отримання айді обраної оселі
  getSelectedFlatID() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        this.getSubInfo(this.offs);
      } else { console.log('Оберіть оселю'); }
    });
  }

  // Отримання та збереження даних всіх дискусій
  async getSubInfo(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: offs, };
    try {
      const allDiscussions = await this.http.post(serverPath + '/acceptsubs/get/subs', data).toPromise() as any[];
      if (allDiscussions) {
        localStorage.setItem('allHouseDiscussions', JSON.stringify(allDiscussions));
        const getAllDiscussions = JSON.parse(localStorage.getItem('allHouseDiscussions') || '[]');
        if (getAllDiscussions) {
          this.subscribers = getAllDiscussions;
        } else {
          this.subscribers = []
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  async selectDiscussion(subscriber: UserInfo) {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUserID = subscriber.user_id;
    if (this.selectedUserID) {
      const allHouseDiscussions = JSON.parse(localStorage.getItem('allHouseDiscussions') || '[]');
      if (allHouseDiscussions) {
        this.indexPage = 1;
        this.indexMenuMobile = 0;
        const selectedUser = allHouseDiscussions.find((user: any) => user.user_id === this.selectedUserID);
        if (selectedUser) {
          this.selectedUser = selectedUser;
          this.checkChatExistence();
          this.getRating(this.selectedUser)
        } else {
          this.selectedUser = undefined;
          console.log('Немає інформації');
        }
      }
    }
  }

  // Видалення орендара
  async deleteUser(subscriber: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteSubComponent, {
      data: { user_id: subscriber.user_id, firstName: subscriber.firstName, lastName: subscriber.lastName, component_id: 3, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriber.user_id && this.selectedFlatId) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: subscriber.user_id, };
        try {
          const response: any = await this.http.post(serverPath + '/acceptsubs/delete/subs', data).toPromise();
          if (response.status === true) {
            this.statusMessage = 'Дискусія видалена';
            setTimeout(() => { this.statusMessage = ''; }, 2000);
            this.updateComponent.triggerUpdate();
            this.selectedUser = undefined;
            this.counterService.getHouseDiscussioCount(this.selectedFlatId);
            this.getSubInfo(this.offs);
          } else {
            this.statusMessage = 'Щось пішло не так, повторіть спробу';
            setTimeout(() => {
              this.statusMessage = ''; this.sharedService.reloadPage();
            }, 2000);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  // Відкриваю чат
  async openChat() {
    console.log(1111)
    try {
      this.statusMessage = 'Завантажуємо чат...';
      const result = await this.getFlatChats();
      if (result === 1) {
        this.statusMessage = 'Відкриваємо чат';
        setTimeout(() => { this.statusMessage = ''; this.indexPage = 2; }, 1000);
      } else if (result === 0) {
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 1000);
      }
    } catch (error) {
      console.error('Помилка при завантаженні чату:', error);
      this.statusMessage = 'Помилка на сервері, спробуйте пізніше';
      setTimeout(() => { this.statusMessage = ''; }, 2000);
    }
  }

  // Створюю чат
  async createChat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedUserID) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: this.selectedUserID, };
      try {
        const response: any = await this.http.post(serverPath + '/chat/add/chatFlat', data).toPromise();
        if (response.status === true) {
          this.statusMessage = 'Створюємо чат';
          const result = await this.getFlatChats();
          if (result === 1) {
            setTimeout(() => { this.openChat(); }, 2000);
          } else if (result === 0) {
            this.statusMessage = 'Щось пішло не так, повторіть спробу';
            setTimeout(() => { this.statusMessage = ''; }, 2000);
          }
        } else { this.statusMessageChat = true; }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
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
        this.http.post(serverPath + '/chat/get/flatchats', data).subscribe(async (response: any) => {
          if (Array.isArray(response.status) && response.status) {
            let allChatsInfo = await Promise.all(response.status.map(async (value: any) => {
              let infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
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
    if (userJson && this.selectedUserID) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, offs: this.offs };
      try {
        const response = await this.http.post(serverPath + '/chat/get/flatchats', data).toPromise() as any;
        if (this.selectedUserID && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { user_id: any }) => chat.user_id === this.selectedUserID);
          this.chatExists = chatExists;
        }
        else { console.log('чат не існує'); }
      } catch (error) { console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

  // Отримання рейтингу
  async getRating(selectedUser: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), user_id: selectedUser.user_id, };
    try {
      const response = await this.http.post(serverPath + '/rating/get/userMarks', data).toPromise() as any;
      this.reviews = response.status;
      if (response && Array.isArray(response.status)) {
        let totalMarkTenant = 0;
        this.numberOfReviews = response.status.length;
        response.status.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkTenant += item.info.mark;
            this.ratingTenant = totalMarkTenant;
          }
        });
      } else if (response.status === false) { this.ratingTenant = 0; }
    } catch (error) { console.error(error); }
  }

  // наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfo(this.offs);
    }
    this.getCurrentPageInfo()
  }

  // попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfo(this.offs);
    }
    this.getCurrentPageInfo()
  }

  // перевірка на якій ми сторінці і скільки їх
  async getCurrentPageInfo(): Promise<string> {
    const itemsPerPage = this.pageEvent.pageSize;
    const currentPage = this.pageEvent.pageIndex + 1;
    const totalPages = Math.ceil(this.counterFound / itemsPerPage);
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    return `Сторінка ${currentPage} із ${totalPages}. Загальна кількість карток: ${this.counterFound}`;
  }

  // Копіювання параметрів
  copyId() { this.copyToClipboard(this.selectedUser?.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.selectedUser?.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.selectedUser?.mail, 'Пошту скопійовано'); }
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
        this.statusMessage = 'Скаргу надіслано'; setTimeout(() => { this.statusMessage = ''; }, 2000);
      } else { this.statusMessage = 'Помилка'; setTimeout(() => { this.statusMessage = ''; }, 2000); }
    });
  }

}

