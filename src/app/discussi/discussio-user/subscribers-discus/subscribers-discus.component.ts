import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewComunService } from 'src/app/services/view-comun.service';
import { Router } from '@angular/router';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { PaginationConfig } from 'src/app/config/paginator';
import { Subject } from 'rxjs';

interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}

interface Chat {
  user_id: string;
  chat_id: string;
  flat_id: string;
  flat_name: string;
  lastMessage: string;
  isSelected?: boolean;
  unread: number;

  infFlat: {
    imgs: any;
    flat: string;
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
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ]),
  ],
})

export class SubscribersDiscusComponent implements OnInit {

  private chatsUpdatesSubject = new Subject<number>();
  chatsUpdates$ = this.chatsUpdatesSubject.asObservable();

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
  // параметри оселі
  chosenFlat: chosenFlat | null = null;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  selectedView!: any;
  selectedViewName!: string;
  chatExists = false;
  currentPhotoIndex: number = 0;
  // статуси
  loading: boolean | undefined;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  ratingOwner: number = 0;
  chats: Chat[] = [];
  chatsUpdates: number | undefined;
  onClickMenu(indexMenu: number, indexPage: number, indexMenuMobile: number,) {
    this.indexMenu = indexMenu;
    this.indexPage = indexPage;
    this.indexMenuMobile = indexMenuMobile;
  }

  // пагінатор
  offs = PaginationConfig.offs;
  counterFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;

  card_info: number = 0;
  reviews: any;
  numberOfReviews: any;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private selectedViewComun: ViewComunService,
    private router: Router,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSubInfo(this.offs);
    await this.getAcceptSubsCount();
    await this.getCurrentPageInfo();
  }

  // Отримання та збереження даних всіх дискусій
  async getSubInfo(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), offs: offs, };
    try {
      const allDiscussions = await this.http.post(serverPath + '/acceptsubs/get/ysubs', data).toPromise() as any[];
      if (allDiscussions) {
        localStorage.setItem('allDiscussions', JSON.stringify(allDiscussions));
        const getAllDiscussions = JSON.parse(localStorage.getItem('allDiscussions') || '[]');
        if (getAllDiscussions) {
          this.subscriptions = getAllDiscussions;
        } else {
          this.subscriptions = []
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  selectDiscussion() {
    if (this.choseFlatId) {
      const allDiscussions = JSON.parse(localStorage.getItem('allDiscussions') || '[]');
      if (allDiscussions) {
        const chosenFlat = allDiscussions.find((flat: any) => flat.flat.flat_id === this.choseFlatId);
        if (chosenFlat) {
          this.chosenFlat = chosenFlat;
          this.getRatingOwner(this.chosenFlat?.owner.user_id);
          this.generateLocationUrl();
        } else {
          console.log('Немає інформації');
        }
      }
    }
  }

  // Перемикання оселі
  async onFlatSelect(choseFlatId: any) {
    this.choseFlatId = choseFlatId; // обираємо айді оселі
    this.ratingOwner = 0; // оновлюємо рейтинг власника
    this.currentPhotoIndex = 0; // встановлюємо перше фото оселі
    this.indexPage = 1; // встановлюємо основну картку оселі
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId); // передаємо всім компонентам айді оселі яке ми обрали
    this.selectDiscussion(); // Виводимо інформацію про обрану оселю
    this.checkChatExistence(this.choseFlatId); // Перевіряємо чи існує чат
  }

  // Перемикання Фото в каруселі
  prevPhoto() {
    this.currentPhotoIndex--;
  }

  nextPhoto() {
    this.currentPhotoIndex++;
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

  copyFlatId() {
    this.copyToClipboard(this.chosenFlat?.flat.flat_id, 'ID оселі скопійовано');
  }
  copyOwnerId() {
    this.copyToClipboard(this.chosenFlat?.owner.user_id, 'ID скопійовано');
  }
  copyTell() {
    this.copyToClipboard(this.chosenFlat?.owner.tell, 'Телефон скопійовано');
  }
  copyMail() {
    this.copyToClipboard(this.chosenFlat?.owner.mail, 'Пошту скопійовано');
  }

  // Перезавантаження сторінки з лоадером
  reloadPage() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  // Видалення дискусії
  async deleteSubscriber(flat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: { flatId: flat.flat.flat_id, flatName: flat.flat.flat_name, flatCity: flat.flat.city, flatSub: 'discussio', }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = { auth: JSON.parse(userJson), flat_id: flat.flat.flat_id, };
        try {
          const response: any = await this.http.post(serverPath + '/acceptsubs/delete/ysubs', data).toPromise();
          if (response.status === true) {
            this.statusMessage = 'Дискусія видалена';
            setTimeout(() => { this.statusMessage = ''; }, 2000);
            this.chosenFlat = null;
            this.getSubInfo(this.offs);
          } else {
            this.statusMessage = 'Щось пішло не так, повторіть спробу';
            setTimeout(() => { this.statusMessage = ''; this.reloadPage(); }, 2000);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  // Створюю чат
  async createChat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.choseFlatId) {
      const data = { auth: JSON.parse(userJson), flat_id: this.choseFlatId, };
      try {
        const response: any = await this.http.post(serverPath + '/chat/add/chatUser', data).toPromise();
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

  openOwner() {
    this.statusMessage = 'Представник оселі';
    setTimeout(() => { this.statusMessage = ''; this.onClickMenu(1, 2, 0) }, 1000);
  }

  async openChat() {
    try {
      this.statusMessage = 'Завантажуємо чат...';
      const result = await this.getFlatChats();
      if (result === 1) {
        this.statusMessage = 'Відкриваємо чат';
        setTimeout(() => { this.statusMessage = ''; this.indexPage = 3; }, 1000);
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

  async getFlatChats(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const data = { auth: JSON.parse(userJson), offs: 0 };
        this.http.post(serverPath + '/chat/get/userchats', data).subscribe(async (response: any) => {
          if (Array.isArray(response.status) && response.status) {
            let allChatsInfo = await Promise.all(response.status.map(async (value: any) => {
              let infUser = await this.http.post(serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
              let infFlat = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
              return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, flat_name: value.flat_name, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message };
            }));
            localStorage.setItem('userChats', JSON.stringify(allChatsInfo));
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

  // Генерую локацію оселі
  generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.chosenFlat?.flat.region || '';
    const city = this.chosenFlat?.flat.city || '';
    const street = this.chosenFlat?.flat.street || '';
    const houseNumber = this.chosenFlat?.flat.houseNumber || '';
    const flatIndex = this.chosenFlat?.flat.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;
    return this.locationLink;
  }

  // Відкриваю локацію на мапі
  openMap() {
    this.statusMessage = 'Відкриваємо локаці на мапі';
    setTimeout(() => { this.statusMessage = ''; window.open(this.locationLink, '_blank'); }, 2000);
  }

  // Перевірка на існування чату
  async checkChatExistence(choseFlatId: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && choseFlatId) {
      const data = { auth: JSON.parse(userJson), flat_id: choseFlatId, offs: 0 };
      try {
        const response = await this.http.post(serverPath + '/chat/get/userchats', data).toPromise() as any;
        if (choseFlatId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { flat_id: any }) => chat.flat_id === choseFlatId);
          this.chatExists = chatExists;
        }
        else { console.log('чат не існує'); }
      } catch (error) { console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

  // Перегляд статистики комунальних
  goToComun() {
    localStorage.removeItem('selectedName');
    localStorage.removeItem('house');
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('chosenFlatId');
    this.selectedView = this.chosenFlat?.flat.flat_id;
    this.selectedViewName = this.chosenFlat?.flat.flat_name;
    this.selectedViewComun.setSelectedView(this.selectedView);
    this.selectedViewComun.setSelectedName(this.selectedViewName);
    this.statusMessage = 'Переходимо до статистики оселі';
    if (this.selectedView) {
      setTimeout(() => { this.router.navigate(['/housing-services/host-comun/comun-stat-month']); }, 2000);
    }
  }

  // Отримую загальну кількість дискусій
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const response: any = await this.http.post(serverPath + '/acceptsubs/get/CountYsubs', data).toPromise() as any;
      this.counterFound = response.status;
    }
    catch (error) { console.error(error) }
  }

  // пагінатор наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfo(this.offs);
    }
    this.getCurrentPageInfo()
  }

  // пагінатор попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfo(this.offs);
    }
    this.getCurrentPageInfo()
  }

  // пагінатор перевіряю кількість сторінок
  async getCurrentPageInfo(): Promise<string> {
    const itemsPerPage = this.pageEvent.pageSize;
    const currentPage = this.pageEvent.pageIndex + 1;
    const totalPages = Math.ceil(this.counterFound / itemsPerPage);
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    return `Сторінка ${currentPage} із ${totalPages}. Загальна кількість карток: ${this.counterFound}`;
  }

  // отримую рейтинг власника оселі
  async getRatingOwner(user_id: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), user_id: user_id, };
    try {
      const response: any = await this.http.post(serverPath + '/rating/get/ownerMarks', data).toPromise() as any[];
      this.numberOfReviews = response.status.length;
      this.reviews = response.status;
      if (this.reviews && Array.isArray(this.reviews)) {
        let totalMarkOwner = 0;
        this.reviews.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkOwner += item.info.mark;
            this.ratingOwner = totalMarkOwner;
          }
        });
      } else {
        this.numberOfReviews = 0;
        this.ratingOwner = response.status.mark;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async reportHouse(flat: any): Promise<void> {
    this.sharedService.reportHouse(flat);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.statusMessage = 'Скаргу надіслано';
        setTimeout(() => { this.statusMessage = '' }, 2000);
      } else {
        this.statusMessage = 'Помилка';
        setTimeout(() => { this.statusMessage = '' }, 2000);
      }
    });
  }
}

