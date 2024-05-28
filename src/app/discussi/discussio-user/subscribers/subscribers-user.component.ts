import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { DeleteSubsComponent } from '../delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';

interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}

@Component({
  selector: 'app-subscribers-user',
  templateUrl: './subscribers-user.component.html',
  styleUrls: ['./subscribers-user.component.scss'],
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

export class SubscribersUserComponent implements OnInit {

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
  // шляхи до серверу
  isLoadingImg: boolean = false;

  // параметри оселі
  chosenFlat: chosenFlat | null = null;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  chatExists = false;
  currentPhotoIndex: number = 0;
  // статуси
  loading: boolean | undefined;
  isCopiedMessage!: string;
  statusMessage: any;
  statusMessageChat: any;
  // показ карток
  indexPage: number = 1;
  ratingOwner: number = 0;
  counterUserSubscribers: any;

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
  photoViewing: boolean = false;

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService,
    private counterService: CounterService,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSubInfo(this.offs);
    await this.getCounterUser();
  }

  onPanStart(event: any): void {
    this.startX = 0;
  }

  onPanEnd(event: any): void {
    const minDeltaX = 50;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        if (this.indexPage !== 0) {
          this.indexPage--;
        } else {
          this.router.navigate(['/user/info']);
        }
      } else {
        if (this.indexPage !== 1 && !this.chosenFlat) {
          this.indexPage++;
        } else if (this.chosenFlat && this.indexPage <= 3) {
          this.indexPage++;
        }
      }
    }
  }

  // отримання, кількості підписників та запит на якій я сторінці
  async getCounterUser() {
    await this.counterService.getUserSubscribersCount();
    await this.counterService.getUserSubscriptionsCount();
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserSubscribers$.subscribe(async data => {
      this.counterUserSubscribers = data;
      this.counterFound = this.counterUserSubscribers;
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
      const allSubscribers: any = await this.http.post(this.serverPath + '/usersubs/get/subs', data).toPromise() as any[];
      // console.log(allSubscribers)
      if (allSubscribers && allSubscribers.status !== false) {
        localStorage.setItem('allSubscribers', JSON.stringify(allSubscribers));
        const getAllSubscribers = JSON.parse(localStorage.getItem('allSubscribers') || '[]');
        if (getAllSubscribers) {
          this.subscriptions = getAllSubscribers;
        } else {
          this.subscriptions = []
        }
      } else {
        console.log('Авторизуйтесь')
        // this.sharedService.logout();
      }
    } catch (error) {
      console.error(error);
    }
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

  // Виводимо інформацію з локального сховища про обрану оселю
  selectSubscribers() {
    if (this.choseFlatId) {
      const allSubscribers = JSON.parse(localStorage.getItem('allSubscribers') || '[]');
      if (allSubscribers) {
        const chosenFlat = allSubscribers.find((flat: any) => flat.flat.flat_id === this.choseFlatId);
        if (chosenFlat) {
          this.chosenFlat = chosenFlat;
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
    this.selectSubscribers(); // Виводимо інформацію про обрану оселю
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

  // Ухвалення до дискусії
  async approveSubscriber(choseFlatId: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson!), flat_id: choseFlatId, };
      const response: any = await this.http.post(this.serverPath + '/usersubs/accept', data).toPromise();
      if (response.status == true) {
        this.sharedService.setStatusMessage('Ухвалено');
        this.chosenFlat = null;
        this.counterService.getUserDiscussioCount();
        this.counterService.getUserSubscribersCount();
        this.getSubInfo(this.offs);
        setTimeout(() => {
          this.sharedService.setStatusMessage('Переходимо до Дискусії');
          setTimeout(() => {
            this.router.navigate(['/subscribers-discuss']);
            this.sharedService.setStatusMessage('');
          }, 1000);
        }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'), this.reloadPage; }
      (error: any) => { this.sharedService.setStatusMessage('Помилка'), setTimeout(() => { this.reloadPage }, 2000); console.error(error); }
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
          const response: any = await this.http.post(this.serverPath + '/usersubs/delete/ysubs', data).toPromise();
          if (response.status === true) {
            this.sharedService.setStatusMessage('Підписника видалено');
            this.chosenFlat = null;
            this.counterService.getUserSubscribersCount();
            await this.getSubInfo(this.offs);
            if (this.subscriptions.length > 0) {
              this.indexPage = 1;
            } else {
              this.indexPage = 0;
            }
            setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
          } else { this.sharedService.setStatusMessage('Помилка'), this.reloadPage; }
        } catch (error) { this.sharedService.setStatusMessage('Помилка на сервері'), this.reloadPage; console.error(error); }
      }
    });
  }

  openOwner(index: number) {
    if (index === 0) {
      this.sharedService.setStatusMessage('Оселя');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(2) }, 1000);
    } else {
      this.sharedService.setStatusMessage('Представник оселі');
      setTimeout(() => { this.sharedService.setStatusMessage(''); this.onClickMenu(3) }, 1000);
    }
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

