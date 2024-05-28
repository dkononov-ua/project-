import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { PaginationConfig } from 'src/app/config/paginator';
import { Subject } from 'rxjs';
import { CounterService } from 'src/app/services/counter.service';
import { PageEvent } from '@angular/material/paginator';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { ViewComunService } from './view-comun.service';
import { DeleteSubsComponent } from '../delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';


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
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class SubscribersDiscusComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  private chatsUpdatesSubject = new Subject<number>();
  chatsUpdates$ = this.chatsUpdatesSubject.asObservable();

  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;

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
  isLoadingImg: boolean = false;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  page: number = 0;
  indexPage: number = 1;
  ratingOwner: number = 0;
  chats: Chat[] = [];
  chatsUpdates: number | undefined;
  counterUserDiscussio: any;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
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
  startX = 0;
  startY = 0;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  photoViewing: boolean = false;
  panelHeight: string = '0px'; // Початкова висота панелі
  panelWidth: string = '0px'; // Початкова висота панелі
  iconRotation: number = 0;

  goBack(): void {
    this.location.back();
  }

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private selectedViewComun: ViewComunService,
    private router: Router,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private location: Location,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 1;
      this.indexPage = Number(this.page);
    });
    this.getSubInfo(this.offs);
    await this.getCounterUser();
    this.getChoseFlatId();
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
    this.startY = 0;
  }

  onPanMove(event: any): void {
    const maxDeltaY = 100;
    const minDeltaY = 30;
    const maxDeltaX = 100;
    const minDeltaX = 30;

    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);

    if (absDeltaY > absDeltaX) {
      if (absDeltaY > minDeltaY) {
        this.panelHeight = Math.min(event.deltaY, maxDeltaY) + 'px';
        this.iconRotation = event.deltaY;
      } else {
        this.panelHeight = '0px';
      }
    }

    if (absDeltaX > absDeltaY) {
      if (absDeltaX > minDeltaX) {
        this.panelWidth = Math.min(event.deltaX / 3, maxDeltaX) + 'px';
      } else {
        this.panelWidth = '0px';
      }
    }
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    const minDeltaY = 100;
    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);
    if (absDeltaX > minDeltaX && absDeltaX > absDeltaY) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
        this.panelHeight = '0px';
        this.panelWidth = '0px';
      } else {
        this.onSwiped('left');
        this.panelHeight = '0px';
        this.panelWidth = '0px';
      }
    } else if (absDeltaY > minDeltaY && absDeltaY > absDeltaX) {
      if (event.deltaY > 0) {
        this.onSwiped('down');
        this.panelWidth = '0px';

      } else {
        this.onSwiped('up');
        this.panelHeight = '0px';
        this.panelWidth = '0px';

      }
    } else {
      this.panelHeight = '0px';
    }
  }

  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    // console.log(direction)
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.goBack();
      }
    } else if (direction === 'left') {
      if (this.indexPage !== 1 && !this.chosenFlat) {
        this.indexPage++;
      } else if (this.chosenFlat && this.indexPage <= 3) {
        this.indexPage++;
      } else {
        this.goBack();
      }
    } else if (direction === 'down') {
      setTimeout(() => {
        location.reload();
      }, 200);
    } else if (direction === 'up') {

    }
  }

  // відправляю event початок свайпу
  onPanStartImg(event: any): void {
    this.startX = 0;
  }

  onPanEndImg(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwipedImg('right');
      } else {
        this.onSwipedImg('left');
      }
    }
  }

  // оброблюю свайп фото
  onSwipedImg(direction: string | undefined): void {
    if (direction === 'right') {
      this.prevPhoto();
    } else {
      this.nextPhoto();
    }
  }

  // Отримання айді обраної оселі
  getChoseFlatId() {
    this.choseSubscribeService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.choseFlatId = selectedFlatId;
      if (this.choseFlatId) {
        this.selectDiscussion();
        // this.indexPage = 2;
      } else { }
    });
  }

  // отримання, кількіст дискусій та запит на якій я сторінці
  async getCounterUser() {
    await this.counterService.getUserSubscribersCount();
    await this.counterService.getUserSubscriptionsCount();
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserDiscussio$.subscribe(async data => {
      this.counterUserDiscussio = data;
      this.counterFound = this.counterUserDiscussio;
      if (this.counterFound) {
        await this.getCurrentPageInfo();
      }
    })
  }

  // Отримання та збереження даних всіх дискусій
  async getSubInfo(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), offs: offs, };
    try {
      const allDiscussions: any = await this.http.post(this.serverPath + '/acceptsubs/get/ysubs', data).toPromise() as any[];
      // console.log(allDiscussions)
      if (allDiscussions && allDiscussions.status !== 'Авторизуйтесь') {
        localStorage.setItem('allDiscussions', JSON.stringify(allDiscussions));
        const getAllDiscussions = JSON.parse(localStorage.getItem('allDiscussions') || '[]');
        if (getAllDiscussions) {
          this.subscriptions = getAllDiscussions;
        } else {
          this.subscriptions = []
        }
      } else {
        console.log('Авторизуйтесь')
        this.sharedService.logout();
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
          // console.log(this.chosenFlat)
          this.statusDataService.setStatusDataFlat(this.chosenFlat?.flat);
          this.statusDataService.setStatusData(this.chosenFlat?.owner);
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
    this.indexPage = 2; // встановлюємо основну картку оселі
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId); // передаємо всім компонентам айді оселі яке ми обрали
    this.selectDiscussion(); // Виводимо інформацію про обрану оселю
    this.checkChatExistence(this.choseFlatId); // Перевіряємо чи існує чат
  }

  // Перемикання Фото в каруселі
  prevPhoto() {
    const length = this.chosenFlat?.img.length || 0;
    if (this.currentPhotoIndex !== 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    const length = this.chosenFlat?.img.length || 0;
    if (this.currentPhotoIndex < length) {
      this.currentPhotoIndex++;
    }
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
    this.copyToClipboard(this.chosenFlat?.flat.flat_id, 'ID оселі ' + this.chosenFlat?.flat.flat_id);
  }

  copyOwnerId() {
    this.copyToClipboard(this.chosenFlat?.owner.user_id, 'ID користувача ' + this.chosenFlat?.owner.user_id);
  }
  copyTell() {
    this.copyToClipboard(this.chosenFlat?.owner.tell, 'Номер ' + this.chosenFlat?.owner.tell);
  }
  copyMail() {
    this.copyToClipboard(this.chosenFlat?.owner.mail, 'Пошту ' + this.chosenFlat?.owner.mail);
  }

  copyViber() { this.copyToClipboard(this.chosenFlat?.owner.viber, 'Номер ' + this.chosenFlat?.owner.viber); }


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
          const response: any = await this.http.post(this.serverPath + '/acceptsubs/delete/ysubs', data).toPromise();
          if (response.status === true) {
            this.sharedService.setStatusMessage('Дискусія видалена');
            setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
            this.chosenFlat = null;
            this.counterService.getUserDiscussioCount();
            this.subscriptions = [];
            await this.getSubInfo(this.offs);
            if (this.subscriptions.length > 0) {
              this.indexPage = 1;
            } else {
              this.indexPage = 0;
            }
          } else {
            this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
            setTimeout(() => { this.sharedService.setStatusMessage(''); this.reloadPage(); }, 2000);
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
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatUser', data).toPromise();
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

  openOwner(index: number) {
    if (index === 0) {
      this.sharedService.setStatusMessage('Оселя');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(2) }, 1000);
    } else {
      this.sharedService.setStatusMessage('Представник оселі');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(4) }, 1000);
    }
  }

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

  async getFlatChats(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson), offs: 0 };
      const response: any = await this.http.post(this.serverPath + '/chat/get/userchats', data).toPromise();
      if (Array.isArray(response.status) && response.status) {
        let allChatsInfo = await Promise.all(response.status.map(async (value: any) => {
          let infUser = await this.http.post(this.serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
          let infFlat = await this.http.post(this.serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
          return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, flat_name: value.flat_name, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message };
        }));
        localStorage.setItem('userChats', JSON.stringify(allChatsInfo));
        this.chats = allChatsInfo;
        return 1;
      } else {
        return 0;
      }
    } else {
      console.log('Нічого не знайдено');
    };
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
    this.sharedService.setStatusMessage('Відкриваємо локаці на мапі');
    setTimeout(() => { this.sharedService.setStatusMessage(''); window.open(this.locationLink, '_blank'); }, 2000);
  }

  // Перевірка на існування чату
  async checkChatExistence(choseFlatId: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && choseFlatId) {
      const data = { auth: JSON.parse(userJson), flat_id: choseFlatId, offs: 0 };
      try {
        const response = await this.http.post(this.serverPath + '/chat/get/userchats', data).toPromise() as any;
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
    // localStorage.removeItem('selectedName');
    // localStorage.removeItem('house');
    // localStorage.removeItem('selectedComun');
    this.selectedView = this.chosenFlat?.flat.flat_id;
    this.selectedViewName = this.chosenFlat?.flat.flat_name;
    this.selectedViewComun.setSelectedView(this.selectedView);
    this.selectedViewComun.setSelectedName(this.selectedViewName);
    if (this.selectedView) {
      this.sharedService.setStatusMessage('Переходимо до статистики оселі');
      setTimeout(() => {
        this.router.navigate(['/communal'], { queryParams: { indexPage: 0 } });
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }

  // пагінатор наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.getSubInfo(offs);
    }
    this.getCurrentPageInfo()
  }

  // пагінатор попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.getSubInfo(offs);
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
      const response: any = await this.http.post(this.serverPath + '/rating/get/ownerMarks', data).toPromise() as any[];
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
        if (this.numberOfReviews > 0) {
          this.ratingOwner = totalMarkOwner / this.numberOfReviews;
        } else {
          this.ratingOwner = 0;
        }
      } else {
        this.numberOfReviews = 0;
        this.ratingOwner = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async reportHouse(flat: any): Promise<void> {
    this.sharedService.reportHouse(flat);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.sharedService.setStatusMessage('Скаргу надіслано');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }

}

