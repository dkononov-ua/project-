import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';

interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}
@Component({
  selector: 'app-subscribers-user',
  templateUrl: './subscribers-user.component.html',
  styleUrls: ['./subscribers-user.component.scss'],
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

export class SubscribersUserComponent implements OnInit {

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
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  ratingOwner: number = 0;
  counterUserSubscribers: any;
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

  reviews: any;
  numberOfReviews: any;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private router: Router,
    private updateComponent: UpdateComponentService,
    private sharedService: SharedService,
    private counterService: CounterService
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSubInfo(this.offs);
    await this.getCounterUser();
  }

  // отримання, кількості підписників та запит на якій я сторінці
  async getCounterUser() {
    await this.counterService.getUserSubscribersCount();
    await this.counterService.getUserSubscriptionsCount();
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserSubscribers$.subscribe(async data => {
      this.counterUserSubscribers = data;
      this.counterFound = this.counterUserSubscribers.status;
      if (this.counterFound) {
        await this.getCurrentPageInfo();
      }
    })
  }

  // Отримання даних всіх підписників
  async getSubInfo(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), offs: offs, };
    try {
      const response = await this.http.post(serverPath + '/usersubs/get/subs', data).toPromise() as any[];
      if (response) { this.subscriptions = response; } else { this.subscriptions = []; }
    } catch (error) { console.error(error); }
  }

  selectedHouse() {
    if (this.choseFlatId) {
      const chosenFlat = this.subscriptions.find((flat: any) => flat.flat.flat_id === this.choseFlatId);
      if (chosenFlat) {
        this.chosenFlat = chosenFlat;
        this.getRatingOwner(this.chosenFlat?.owner.user_id);
        this.generateLocationUrl();
      } else { this.chosenFlat = null; console.log('Немає інформації'); }
    }
  }

  // Перемикання оселі
  onFlatSelect(flat: any) {
    this.ratingOwner = 0;
    this.currentPhotoIndex = 0;
    this.indexPage = 1;
    this.choseFlatId = flat.flat.flat_id;
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId);
    this.selectedHouse();
  }

  // Перемикання Фото в каруселі
  prevPhoto() { this.currentPhotoIndex--; }
  nextPhoto() { this.currentPhotoIndex++; }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.isCopiedMessage = message; setTimeout(() => { this.isCopiedMessage = ''; }, 2000);
        })
        .catch((error) => { this.isCopiedMessage = ''; });
    }
  }

  copyFlatId() { this.copyToClipboard(this.chosenFlat?.flat.flat_id, 'ID оселі скопійовано'); }
  copyOwnerId() { this.copyToClipboard(this.chosenFlat?.owner.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.chosenFlat?.owner.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.chosenFlat?.owner.mail, 'Пошту скопійовано'); }

  // Перезавантаження сторінки з лоадером
  reloadPage() { this.loading = true; setTimeout(() => { location.reload(); }, 500); }

  // Ухвалення до дискусії
  async approveSubscriber(choseFlatId: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson!), flat_id: choseFlatId, };
      const response: any = await this.http.post(serverPath + '/usersubs/accept', data).toPromise();
      if (response.status == true) {
        this.statusMessage = 'Ухвалено до дискусії'
        this.chosenFlat = null;
        this.counterService.getUserDiscussioCount();
        this.counterService.getUserSubscribersCount();
        this.getSubInfo(this.offs);
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      } else { this.statusMessage = 'Помилка', this.reloadPage; }
      (error: any) => { this.statusMessage = 'Помилка', setTimeout(() => { this.reloadPage }, 2000); console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }

  // Видалення підписника
  async deleteSubscriber(flat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: { flatId: flat.flat.flat_id, flatName: flat.flat.flat_name, flatCity: flat.flat.city, flatSub: 'subscribers', }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = { auth: JSON.parse(userJson), flat_id: flat.flat.flat_id, };
        try {
          const response: any = await this.http.post(serverPath + '/usersubs/delete/ysubs', data).toPromise();
          if (response.status === true) {
            this.statusMessage = 'Підписника видалено'
            this.chosenFlat = null;
            this.counterService.getUserSubscribersCount();
            this.getSubInfo(this.offs);
            setTimeout(() => { this.statusMessage = ''; }, 2000);
          } else { this.statusMessage = 'Помилка', this.reloadPage; }
        } catch (error) { this.statusMessage = 'Помилка на сервері', this.reloadPage; console.error(error); }
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
  openMap() { window.open(this.locationLink, '_blank'); }

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
    } catch (error) { console.error(error); }
  }

  async reportHouse(flat: any): Promise<void> {
    this.sharedService.reportHouse(flat);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.statusMessage = 'Скаргу надіслано';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      } else { this.statusMessage = 'Помилка'; setTimeout(() => { this.statusMessage = ''; }, 2000); }
    });
  }

}

