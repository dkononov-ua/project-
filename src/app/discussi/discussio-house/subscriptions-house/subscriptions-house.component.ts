
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
@Component({
  selector: 'app-subscriptions-house',
  templateUrl: './subscriptions-house.component.html',
  styleUrls: ['./subscriptions-house.component.scss'],
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

export class SubscriptionsHouseComponent implements OnInit {
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
    this.getSelectedFlatID();
    await this.getCounterHouse();
  }

  async getCounterHouse() {
    await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    // кількість підписок
    this.counterService.counterHouseSubscriptions$.subscribe(async data => {
      this.counterHouseSubscriptions = data;
      this.counterFound = this.counterHouseSubscriptions.status;
      if (this.counterFound) {
        await this.getCurrentPageInfo();
      }
    });
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
      const allDiscussions = await this.http.post(serverPath + '/usersubs/get/ysubs', data).toPromise() as any[];
      if (allDiscussions) {
        localStorage.setItem('allHouseSubscriptions', JSON.stringify(allDiscussions));
        const getAllDiscussions = JSON.parse(localStorage.getItem('allHouseSubscriptions') || '[]');
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
  selectDiscussion(subscriber: UserInfo) {
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUserID = subscriber.user_id;
    if (this.selectedUserID) {
      const allHouseDiscussions = JSON.parse(localStorage.getItem('allHouseSubscriptions') || '[]');
      if (allHouseDiscussions) {
        this.indexPage = 1;
        this.indexMenuMobile = 0;
        const selectedUser = allHouseDiscussions.find((user: any) => user.user_id === this.selectedUserID);
        if (selectedUser) {
          this.selectedUser = selectedUser;
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
      data: { user_id: subscriber.user_id, firstName: subscriber.firstName, lastName: subscriber.lastName, component_id: 2, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriber.user_id && this.selectedFlatId) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: subscriber.user_id, };
        try {
          const response: any = await this.http.post(serverPath + '/usersubs/delete/subs', data).toPromise();
          if (response.status === true) {
            this.statusMessage = 'Підписка видалена';
            setTimeout(() => { this.statusMessage = ''; }, 2000);
            // this.updateComponent.triggerUpdate();
            this.selectedUser = undefined;
            this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
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

  // Перезавантаження сторінки з лоадером
  reloadPage() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
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
        this.statusMessage = 'Скаргу надіслано'; setTimeout(() => { this.statusMessage = ''; }, 2000);
      } else { this.statusMessage = 'Помилка'; setTimeout(() => { this.statusMessage = ''; }, 2000); }
    });
  }

}

