import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';

interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}

@Component({
  selector: 'app-subscriptions-user',
  templateUrl: './subscriptions-user.component.html',
  styleUrls: ['./subscriptions-user.component.scss'],
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
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('800ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class SubscriptionsUserComponent implements OnInit {

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
  currentPhotoIndex: number = 0;
  // статуси
  loading: boolean | undefined;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  page: number = 0;
  indexPage: number = 0;
  counterUserSubscriptions: any;

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

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private counterService: CounterService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });

    this.getSubInfo(this.offs);
    await this.getCounterUser();

    if (this.counterFound !== 0) {
      this.indexPage = 1;
    } else {
      this.indexPage = 0;
    }
  }

  // отримання, кількості підписок та запит на якій я сторінці
  async getCounterUser() {
    await this.counterService.getUserSubscribersCount();
    await this.counterService.getUserSubscriptionsCount();
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserSubscriptions$.subscribe(async data => {
      this.counterUserSubscriptions = data;
      this.counterFound = this.counterUserSubscriptions.status;
      if (this.counterFound) { await this.getCurrentPageInfo(); }
    })
  }

  // Отримання та збереження даних всіх дискусій
  async getSubInfo(offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), offs: offs, };
    try {
      const allSubscriptions = await this.http.post(serverPath + '/subs/get/ysubs', data).toPromise() as any[];
      if (allSubscriptions) {
        localStorage.setItem('allSubscriptions', JSON.stringify(allSubscriptions));
        const getAllSubscriptions = JSON.parse(localStorage.getItem('allSubscriptions') || '[]');
        if (getAllSubscriptions) {
          this.subscriptions = getAllSubscriptions;
        } else {
          this.subscriptions = []
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  selectSubscriptions() {
    if (this.choseFlatId) {
      const allSubscriptions = JSON.parse(localStorage.getItem('allSubscriptions') || '[]');
      if (allSubscriptions) {
        const chosenFlat = allSubscriptions.find((flat: any) => flat.flat.flat_id === this.choseFlatId);
        if (chosenFlat) {
          this.chosenFlat = chosenFlat;
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
    this.currentPhotoIndex = 0; // встановлюємо перше фото оселі
    this.indexPage = 2; // встановлюємо основну картку оселі
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId); // передаємо всім компонентам айді оселі яке ми обрали
    this.selectSubscriptions(); // Виводимо інформацію про обрану оселю
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

  // Видалення підписки
  async deleteSubscriber(flat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: { flatId: flat.flat.flat_id, flatName: flat.flat.flat_name, flatCity: flat.flat.city, flatSub: 'subscriptions', }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = { auth: JSON.parse(userJson), flat_id: flat.flat.flat_id, };
        try {
          const response: any = await this.http.post(serverPath + '/subs/delete/ysubs', data).toPromise();
          if (response.status === true) {
            this.statusMessage = 'Підписка видалена'
            this.chosenFlat = null;
            this.counterService.getUserSubscriptionsCount();
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
  openMap() {
    this.statusMessage = 'Відкриваємо локаці на мапі';
    setTimeout(() => { this.statusMessage = ''; window.open(this.locationLink, '_blank'); }, 2000);
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

