
import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { DeleteSubComponent } from '../delete/delete-sub.component';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-subscribers-house',
  templateUrl: './subscribers-house.component.html',
  styleUrls: ['./subscribers-house.component.scss'],
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

export class SubscribersHouseComponent implements OnInit {
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
  card_info: boolean = false;
  indexPage: number = 1;
  selectedUserID: any;
  counterHouseDiscussio: any;
  counterHouseSubscriptions: any;
  counterHouseSubscribers: any;
  counterHD: any;
  isLoadingImg: boolean = false;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
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
  startX = 0;

  goBack(): void {
    this.location.back();
  }

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
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectedFlatID();
    await this.getCounterHouse();
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
      if (this.indexPage !== 1 && !this.selectedUser && this.counterFound !== 0) {
        this.indexPage++;
      } else if (this.selectedUser && this.indexPage <= 2) {
        this.indexPage++;
      }
    }
  }

  async getCounterHouse() {
    await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    // кількість підписників
    this.counterService.counterHouseSubscribers$.subscribe(async data => {
      this.counterHouseSubscribers = data;
      this.counterFound = this.counterHouseSubscribers.status;
      if (this.counterFound) {
        await this.getCurrentPageInfo();
      }
    });
  };

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
      const allDiscussions: any = await this.http.post(this.serverPath + '/subs/get/subs', data).toPromise() as any[];
      // console.log(allDiscussions)
      if (allDiscussions && allDiscussions.status !== 'Немає доступу' && allDiscussions.status !== false) {
        localStorage.setItem('allHouseDiscussions', JSON.stringify(allDiscussions));
        const getAllDiscussions = JSON.parse(localStorage.getItem('allHouseDiscussions') || '[]');
        if (getAllDiscussions) {
          this.subscribers = getAllDiscussions;
        } else {
          this.subscribers = []
        }
      } else {
        this.sharedService.setStatusMessage('Немає доступу');
        setTimeout(() => {
          this.router.navigate(['/house/house-info']);
          this.sharedService.setStatusMessage('');
        }, 1500);
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
      const allHouseDiscussions = JSON.parse(localStorage.getItem('allHouseDiscussions') || '[]');
      if (allHouseDiscussions) {
        this.indexPage = 2;
        const selectedUser = allHouseDiscussions.find((user: any) => user.user_id === this.selectedUserID);
        if (selectedUser) {
          this.selectedUser = selectedUser;
          this.statusDataService.setStatusData(this.selectedUser);
          this.statusDataService.setUserData(this.selectedUser, 2);
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
      data: { user_id: subscriber.user_id, firstName: subscriber.firstName, lastName: subscriber.lastName, component_id: 1, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && subscriber.user_id && this.selectedFlatId) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: subscriber.user_id, };
        try {
          const response: any = await this.http.post(this.serverPath + '/subs/delete/subs', data).toPromise();
          if (response.status === true) {
            this.sharedService.setStatusMessage('Підписник видалений');
            setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
            this.updateComponent.triggerUpdate();
            this.selectedUser = undefined;
            this.counterService.getHouseSubscribersCount(this.selectedFlatId);
            await this.getSubInfo(this.offs);
            if (this.subscribers.length > 0) {
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

