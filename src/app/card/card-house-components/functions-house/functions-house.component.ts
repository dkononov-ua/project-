import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { Subject } from 'rxjs';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { ViewComunService } from '../../../discussi/discussio-user/discus/view-comun.service';
import { DeleteSubsComponent } from '../../../discussi/discussio-user/delete/delete-subs.component';
import { StatusDataService } from 'src/app/services/status-data.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { LocationHouseService } from 'src/app/services/location-house.service';
import { CreateChatService } from 'src/app/chat/create-chat.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { HouseInfo } from '../../../interface/info';
import { HouseConfig } from '../../../interface/param-config';

@Component({
  selector: 'app-functions-house',
  templateUrl: './functions-house.component.html',
  styleUrls: ['./functions-house.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(1220%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateY(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateY(1220%)' }))
      ]),
    ]),
    animations.top4,
    animations.left4,
  ],
})

export class FunctionsHouseComponent implements OnInit, OnDestroy {

  disabledBtn: boolean = false;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

  toggleAllMenu(index: number) {
    this.linkOpen[index] = !this.linkOpen[index];
    this.disabledBtn = true;
    if (this.menu[index]) {
      setTimeout(() => {
        this.menu[index] = !this.menu[index];
        this.disabledBtn = false;
      }, 600);
    } else {
      this.menu[index] = !this.menu[index];
      this.disabledBtn = false;
    }
  }

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
  chosenFlat: any;
  choseFlatId: any | null;
  public locationLink: string = '';
  subscriptions: any[] = [];
  selectedView!: any;
  selectedViewName!: string;
  chatExists = false;
  // показ карток
  page: number = 0;

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
  panelHeight: string = '0px'; // Початкова висота панелі
  panelWidth: string = '0px'; // Початкова висота панелі
  iconRotation: number = 0;
  currentLocation: string = '';
  authorization: boolean = false;

  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;
  house: HouseInfo = HouseConfig;

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
    private cardsDataService: CardsDataService,
    private sendMessageService: SendMessageService,
    private locationHouseService: LocationHouseService,
    private createChatService: CreateChatService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    this.checkUserAuthorization();
    await this.getChosenFlatId();
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Підписка на отримання айді обраної оселі
  async getChosenFlatId() {
    this.subscriptions.push(
      this.choseSubscribeService.selectedFlatId$.subscribe(async selectedFlatId => {
        this.choseFlatId = selectedFlatId;
        // console.log(this.choseFlatId)
        if (this.choseFlatId) {
          this.getCardsData();
        }
      })
    );
  }

  // Підписка на отримання даних обраної оселі
  async getCardsData() {
    this.subscriptions.push(
      this.cardsDataService.cardData$.subscribe(async (data: any) => {
        if (data) {
          this.chosenFlat = data;
          // Якщо є обрана оселя та я авторизований
          if (this.chosenFlat && this.authorization && this.choseFlatId) {
            // Перевіряю чи створений чат
            await this.checkChatExistence();
            // Формую локацію на мапі
            this.locationLink = await this.locationHouseService.generateLocationUrl(this.chosenFlat);
          }
          if (Array.isArray(data.img) && data.img.length !== 0) {
            this.house.photos = data.img.map((img: string) => ({
              flat_id: data.flat.flat_id,
              img: img
            }));
          } else if (data) {
            this.house.photos = [{
              flat_id: data.flat.flat_id,
              img: 'housing_default.svg'
            }];
          } else {
            this.house.photos = [{
              flat_id: 0,
              img: 'housing_default.svg'
            }];
          }
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    this.sharedService.copyToClipboard(textToCopy, message);
  }

  // Видалення карток
  async deleteSubscriber(flat: any): Promise<void> {
    if (this.currentLocation === '/subscribers-discuss') {
      this.cardsDataService.deleteFlatSub(flat, 'discussio');
    } else if (this.currentLocation === '/subscribers-user') {
      this.cardsDataService.deleteFlatSub(flat, 'subscribers');
    } else if (this.currentLocation === '/subscriptions-user') {
      this.cardsDataService.deleteFlatSub(flat, 'subscriptions');
    }
    this.cardsDataService.getResultDeleteFlatSubject().subscribe(result => {
      if (result.status === true) {
        if (this.currentLocation === '/subscribers-discuss') {
          this.sharedService.setStatusMessage('Дискусію видалено');
          this.cardsDataService.getSubInfo(0);
        } else if (this.currentLocation === '/subscribers-user') {
          this.sharedService.setStatusMessage('Підписника видалено');
          this.cardsDataService.getSubInfo(0);
        } else if (this.currentLocation === '/subscriptions-user') {
          this.sharedService.setStatusMessage('Підписку видалено');
          this.cardsDataService.getSubInfo(0);
        }
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      } else {
        this.sharedService.setStatusMessage('Помилка');
        setTimeout(() => { this.sharedService.setStatusMessage('') }, 2000);
      }
    });
  }

  // Перевіряємо в сервісі існування чату оселі з обраним користувачем
  async checkChatExistence(): Promise<any> {
    const chatExists = await this.createChatService.checkChatExistenceUser();
    this.chatExists = chatExists;
    // console.log(chatExists)
  }

  // Створюю чат з оселею
  async createChat(flat_id: number): Promise<void> {
    this.createChatService.createUserChat(flat_id)
  }

  openChat() {
    if (this.chatExists) {
      this.choseSubscribeService.setChosenFlatId(this.chosenFlat?.flat.flat_id);
      this.router.navigate(['/chat-user']);
    }
  }

  // Відкриваю локацію на мапі
  openMap() {
    if (this.authorization) {
      this.sharedService.openMap(this.locationLink)
    } else {
      this.sharedService.getAuthorization();
    }
  }

  // Перегляд статистики комунальних
  goToComun() {
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

  openFullScreenImage(photos: any): void {
    this.sharedService.openFullScreenImage(photos);
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
        this.cardsDataService.getSubInfo(this.offs)
        setTimeout(() => {
          this.sharedService.setStatusMessage('Переходимо до Дискусії');
          setTimeout(() => {
            this.router.navigate(['/subscribers-discuss']);
            this.sharedService.setStatusMessage('');
          }, 1000);
        }, 2000);
      } else { this.sharedService.setStatusMessage('Помилка'), location.reload(); }
      (error: any) => { this.sharedService.setStatusMessage('Помилка'), setTimeout(() => { location.reload(); }, 2000); console.error(error); }
    } else { console.log('Авторизуйтесь'); }
  }
}


