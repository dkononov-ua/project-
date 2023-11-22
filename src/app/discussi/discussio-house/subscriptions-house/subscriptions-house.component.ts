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

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private dialog: MatDialog,
    private choseSubscribersService: ChoseSubscribersService,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      this.getSubs(this.selectedFlatId, this.offs);
      await this.getSubscriptionsCount();
      await this.getCurrentPageInfo();
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/usersubs/get/ysubs';
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

  onSubscriberSelect(subscriber: UserInfo): void {
    this.indexPage = 1;
    this.indexMenuMobile = 0;
    this.choseSubscribersService.setSelectedSubscriber(subscriber.user_id);
    this.selectedUser = subscriber;
    this.getRating(subscriber)
  }

  async openDialog(subscriber: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/usersubs/delete/subs';

    const dialogRef = this.dialog.open(DeleteSubComponent, {
      data: {
        user_id: subscriber.user_id,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        component_id: 2,
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

  // Підписки
  async getSubscriptionsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/usersubs/get/CountUserSubs';
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

  async getRating(selectedUser: any): Promise<any> {
    console.log(selectedUser);
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      console.log(response);

      this.reviews = response.status;
      console.log(this.reviews);
      if (response && Array.isArray(response.status)) {
        let totalMarkTenant = 0;
        this.numberOfReviews = response.status.length;
        response.status.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkTenant += item.info.mark;
            this.ratingTenant = totalMarkTenant;
            console.log(this.ratingTenant);
          }
        });

        console.log('Кількість відгуків:', this.numberOfReviews);
      } else if (response.status === false) {
        this.ratingTenant = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }


}

