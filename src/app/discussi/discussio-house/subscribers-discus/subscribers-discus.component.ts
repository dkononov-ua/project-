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

interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  isSelected?: boolean;
  lastMessage: string;
  unread: number;
  infFlat: {
    imgs: string;
  }
  infUser: {
    img: any;
    inf: {
      firstName: string;
      lastName: string;
      surName: string;
    }
  }
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
}
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
  statusMessage: any;
  statusMessageChat: any;
  chatExists = false;
  isCopiedMessage!: string;
  // показ карток
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  onClickMenu(indexMenu: number, indexPage: number, indexMenuMobile: number,) {
    this.indexMenu = indexMenu;
    this.indexPage = indexPage;
    this.indexMenuMobile = indexMenuMobile;
  }
  openInfoUser() {
    this.card_info = true;
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


  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSelectedFlatID();
    await this.getAcceptSubsCount();
    await this.getCurrentPageInfo();
  }

  getSelectedFlatID() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        this.getSubs(this.selectedFlatId, this.offs);
      } else {
        console.log('Оберіть оселю');
      }
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.subscribers = response;
    } catch (error) {
      console.error(error);
    }
  }

  async onSubscriberSelect(subscriber: UserInfo): Promise<void> {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUser = subscriber;
    this.checkChatExistence(this.selectedUser.user_id);
    this.indexPage = 1;
    this.indexMenuMobile = 0;
    this.getRating(subscriber)
  }

  async openDialog(subscriber: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/acceptsubs/delete/subs';
    const dialogRef = this.dialog.open(DeleteSubComponent, {
      data: {
        user_id: subscriber.user_id,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        component_id: 3,
      }

    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriber.user_id && this.selectedFlatId) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
          user_id: subscriber.user_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscribers = this.subscribers.filter(item => item.user_id !== subscriber.user_id);
          this.indexPage = 1;
          this.selectedUser = undefined;
          this.updateComponent.triggerUpdate();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  openChat() {
    this.getFlatChats();
    this.statusMessage = 'Відкриваєм чат';
    setTimeout(() => {
      this.statusMessage = '';
      this.indexPage = 2;
    }, 1000);
  }

  async createChat(selectedUser: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && selectedUser) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedUser.user_id,
      };
      this.http.post(serverPath + '/chat/add/chatFlat', data)
        .subscribe(async (response: any) => {
          console.log(response)
          if (response.status === true) {
            this.statusMessage = 'Чат створено';
            await this.getFlatChats();
            setTimeout(() => {
              this.statusMessage = '';
              this.indexPage = 2;
            }, 1000);
          } else {
            this.statusMessageChat = true;
            console.log('чат вже створено')
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('Авторизуйтесь');
    }
  }

  async getFlatChats(): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    const offs = 0;

    if (userJson && this.selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: offs,
      };

      try {
        this.http.post(url, data)
          .subscribe(async (response: any) => {
            if (Array.isArray(response.status) && response.status) {
              let chat = await Promise.all(response.status.map(async (value: any) => {
                let infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
                let infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
                return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message }
              }))
              this.chats = chat;
              localStorage.setItem('flatChats', JSON.stringify(this.chats));
            } else {
              console.log('chat not found');
            }
          }, (error: any) => {
            console.error(error);
          });
      } catch (error) {

      }
    } else {
      console.log('chat not found');
    }
  }

  async checkChatExistence(selectedUser: any): Promise<any> {
    const url = serverPath + '/chat/get/flatchats';
    const userJson = localStorage.getItem('user');
    if (userJson && selectedUser) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: this.offs
      };
      try {
        const response = await this.http.post(url, data).toPromise() as any;
        if (this.selectedFlatId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { user_id: any }) => chat.user_id === selectedUser);
          this.chatExists = chatExists;
        }
        else {
          console.log('чат не існує');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found');
    }
  }

  async getRating(selectedUser: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any;
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
      } else if (response.status === false) {
        this.ratingTenant = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Дискусії
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountSubs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };

    try {
      const response: any = await this.http.post(url, data).toPromise() as any;
      this.counterFound = response.status;
    }
    catch (error) {
      console.error(error)
    }
  }

  // наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubs(this.selectedFlatId, this.offs);
    }
    this.getCurrentPageInfo()
  }

  // попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubs(this.selectedFlatId, this.offs);
    }
    this.getCurrentPageInfo()
  }

  async getCurrentPageInfo(): Promise<string> {
    const itemsPerPage = this.pageEvent.pageSize;
    const currentPage = this.pageEvent.pageIndex + 1;
    const totalPages = Math.ceil(this.counterFound / itemsPerPage);
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    return `Сторінка ${currentPage} із ${totalPages}. Загальна кількість карток: ${this.counterFound}`;
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.isCopiedMessage = message;
          setTimeout(() => {
            this.isCopiedMessage = '';
          }, 2000);
        })
        .catch((error) => {
          this.isCopiedMessage = '';
        });
    }
  }

  copyId() {
    this.copyToClipboard(this.selectedUser?.user_id, 'ID скопійовано');
  }
  copyTell() {
    this.copyToClipboard(this.selectedUser?.tell, 'Телефон скопійовано');
  }
  copyMail() {
    this.copyToClipboard(this.selectedUser?.mail, 'Пошту скопійовано');
  }

  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      // Обробка результату в компоненті
      if (result.status === true) {
        this.statusMessage = 'Скаргу надіслано';
        setTimeout(() => {
          this.statusMessage = '';
        }, 2000);
      } else {
        this.statusMessage = 'Помилка';
        setTimeout(() => {
          this.statusMessage = '';
        }, 2000);
      }
    });
  }

}

