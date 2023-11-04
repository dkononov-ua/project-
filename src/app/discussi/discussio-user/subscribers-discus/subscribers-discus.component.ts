import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { DeleteSubsComponent } from '../delete-subs/delete-subs.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewComunService } from 'src/app/services/view-comun.service';
import { Router } from '@angular/router';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { PageEvent } from '@angular/material/paginator';
interface chosenFlat {
  flat: any;
  owner: any;
  img: any;
}
@Component({
  selector: 'app-subscribers-discus',
  templateUrl: './subscribers-discus.component.html',
  styleUrls: ['./subscribers-discus.component.scss'],
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

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    1: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
    2000: '2км',
  }

  purpose: { [key: number]: string } = {
    0: 'Переїзд',
    1: 'Відряджання',
    2: 'Подорож',
    3: 'Пожити в іншому місті',
    4: 'Навчання',
    5: 'Особисті причини',
  }

  animals: { [key: number]: string } = {
    0: 'Без тварин',
    1: 'Можна з тваринами',
    2: 'Тільки котики',
    3: 'Тільки песики',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
  }

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  loading: boolean | undefined;
  chosenFlat: chosenFlat | null = null;
  isCopiedMessage!: string;
  choseFlatId: any | null;
  currentPhotoIndex: number = 0;
  chatExists = false;
  statusMessageChat: any;
  public locationLink: string = '';
  selectedView!: any;
  selectedViewName!: string;
  subscriptions: any[] = [];

  // показ карток
  card_info: boolean = false;
  indexPage: number = 0;
  indexMenu: number = 0;
  indexMenuMobile: number = 1;
  ratingOwner: number = 0;
  onClickMenu(indexMenu: number, indexPage: number, indexMenuMobile: number,) {
    this.indexMenu = indexMenu;
    this.indexPage = indexPage;
    this.indexMenuMobile = indexMenuMobile;
  }

  openInfoUser() {
    this.card_info = true;
  }

  // пагінатор
  offs: number = 0;
  counterFound: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  pageEvent: PageEvent = {
    length: this.counterFound,
    pageSize: 5,
    pageIndex: 0
  };

  constructor(
    private http: HttpClient,
    private choseSubscribeService: ChoseSubscribeService,
    private dialog: MatDialog,
    private selectedViewComun: ViewComunService,
    private router: Router,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getSubInfo(null, this.offs);
    await this.getAcceptSubsCount();
  }

  // Отримання даних всіх дискусій
  async getSubInfo(flatId: any, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: offs,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      if (response) {
        this.subscriptions = response;
        if (flatId) {
          const chosenFlat = response.find((flat: any) => flat.flat.flat_id === flatId);
          if (chosenFlat) {
            this.chosenFlat = chosenFlat;
            this.getRatingOwner(this.chosenFlat?.owner.user_id);
            this.generateLocationUrl();
          } else {
            console.log('Немає інформації');
          }
        } else {
          this.onFlatSelect(response[0]);
        }
      } else {
        console.log('Немає дискусій');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Перемикання оселі
  onFlatSelect(flat: any) {
    this.ratingOwner = 0;
    this.currentPhotoIndex = 0;
    this.indexPage = 1;
    this.choseFlatId = flat.flat.flat_id;
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId);
    this.getSubInfo(this.choseFlatId, this.offs);
    this.checkChatExistence(this.choseFlatId);
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
    const url = serverPath + '/acceptsubs/delete/ysubs';

    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: {
        flatId: flat.flat.flat_id,
        flatName: flat.flat.flat_name,
        flatCity: flat.flat.city,
        flatSub: 'discussio',
      }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: flat.flat.flat_id,
        };
        try {
          const response = await this.http.post(url, data).toPromise();
          this.subscriptions = this.subscriptions.filter(item => item.flat_id !== flat.flat.flat_id);
          this.indexPage = 1;
          this.chosenFlat = null;
          this.updateComponent.triggerUpdateUser();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  // Створюю чат
  async createChat(chosenFlat: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && chosenFlat.flat.flat_id) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: chosenFlat.flat.flat_id,
      };
      this.http.post(serverPath + '/chat/add/chatUser', data)
        .subscribe((response: any) => {
          if (response) {
            this.indexPage = 3;
          } else if (response.status === false) {
            this.statusMessageChat = true;
            console.log('чат вже створено')
          }
          this.chosenFlat = chosenFlat;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
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
    window.open(this.locationLink, '_blank');
  }

  // Перевірка на існування чату
  async checkChatExistence(choseFlatId: any): Promise<any> {
    const url = serverPath + '/chat/get/userchats';
    const userJson = localStorage.getItem('user');
    if (userJson && choseFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: choseFlatId,
        offs: 0
      };
      try {
        const response = await this.http.post(url, data).toPromise() as any;
        if (choseFlatId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { flat_id: any }) => chat.flat_id === choseFlatId);
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
    if (this.selectedView) {
      this.router.navigate(['/housing-services/host-comun/comun-stat-month']);
    }
  }

  // Отримую загальну кількість дискусій
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountYsubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response: any = await this.http.post(url, data).toPromise() as any;
      this.counterFound = response.status;
    }
    catch (error) {
      console.error(error)
    }
  }

  // пагінатор наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfo(null, this.offs);
    }
    this.getCurrentPageInfo()
  }

  // пагінатор попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfo(null, this.offs);
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
    const url = serverPath + '/rating/get/ownerMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      if (response && Array.isArray(response.status)) {
        let totalMarkOwner = 0;
        response.status.forEach((item: { mark: number; }) => {
          if (item.mark) {
            totalMarkOwner += item.mark;
            this.ratingOwner = totalMarkOwner;
          }
        });
      } else {
        console.log('Власник без оцінок.');
      }
    } catch (error) {
      console.error(error);
    }
  }

}

