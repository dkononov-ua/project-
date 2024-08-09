import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { FilterUserService } from 'src/app/services/search/filter-user.service';

@Component({
  selector: 'app-cards-list-users',
  templateUrl: './cards-list-users.component.html',
  styleUrls: ['./cards-list-users.component.scss'],
  animations: [animations.top3],
})

export class CardsListUsersComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  selectedFlatId: string | any;
  choseUser: any;
  allCards: any;
  isLoadingImg: boolean = false;

  // пагінатор
  offs = PaginationConfig.offs;
  counterFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;

  choseUserId: any;
  currentLocation: string = '';
  @ViewChild('findCards') findCardsElement!: ElementRef;
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private choseSubscribersService: ChoseSubscribersService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private location: Location,
    private cardsDataHouseService: CardsDataHouseService,
    private filterUserService: FilterUserService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    this.checkUserAuthorization();
    await this.getSelectedFlatId();
    await this.getChosenUserId();
    this.getSubInfoFromService(this.offs);
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

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
      })
    );
  }

  // Підписка на отримання айді обраного користувача
  async getChosenUserId() {
    this.subscriptions.push(
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.choseUser = Number(selectedSubscriber);
        const storedSubscriberId = localStorage.getItem('selectedSubscriberId');
        if (storedSubscriberId) {
          const parsedSubscriberId = JSON.parse(storedSubscriberId);
          if (parsedSubscriberId !== this.choseUser) {
            this.onSelect(this.choseUser);
          }
        }
      })
    );
  }

  // Запит на сервіс про список карток так їх кількість
  private getSubInfoFromService(offs: number): void {
    if (this.currentLocation !== '/search/tenant') {
      this.cardsDataHouseService.getUserInfo(offs);
    }
    this.getCardsData();
    this.getCounterCards();
  }

  // Підписка на інформацію про картки
  private getCardsData(): void {
    this.subscriptions.push(
      this.cardsDataHouseService.cardsData$.subscribe(data => {
        this.allCards = data;
      })
    );
  }

  // Підписка на кількість карток, та запит на якій я сторінці
  private getCounterCards(): void {
    // Якщо я в Дискусії
    if (this.currentLocation === '/house/discus/discussion') {
      this.counterService.getHouseDiscussioCount(this.selectedFlatId);
      this.subscriptions.push(
        this.counterService.counterHouseDiscussio$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписниках
    } else if (this.currentLocation === '/house/discus/subscribers') {
      this.counterService.getHouseSubscribersCount(this.selectedFlatId);
      this.subscriptions.push(
        this.counterService.counterHouseSubscribers$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписках
    } else if (this.currentLocation === '/house/discus/subscriptions') {
      this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
      this.subscriptions.push(
        this.counterService.counterHouseSubscriptions$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
    } else if (this.currentLocation === '/search/tenant') {
      this.subscriptions.push(
        this.filterUserService.counterFound$.subscribe(number => {
          this.counterFound = number;
        })
      )
    }
    // Вираховую на якій я сторінці та скільки всього карток
    if (this.counterFound) {
      this.getCurrentPageInfo();
    }
  }

  // Перемикання оселі
  async onSelect(user_id: number): Promise<void> {
    // Видаляю ID юзера
    this.choseSubscribersService.removeChosenUserId();
    // Передаю нове ID юзера
    this.choseSubscribersService.setSelectedSubscriber(user_id);
    // Відкриваю картку
    this.choseSubscribersService.setIndexPage(3);
    // Встановлюю дані по обраній оселі на сервісі
    this.cardsDataHouseService.selectCard();
  }

  // наступна сторінка з картками
  incrementOffset() {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfoFromService(this.offs);
    }
    this.getCurrentPageInfo()
  }

  // попередня сторінка з картками
  decrementOffset() {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = (this.pageEvent.pageIndex) * this.pageEvent.pageSize;
      this.offs = offs;
      this.getSubInfoFromService(this.offs);
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

  onScroll(event: Event): void {
    const element = this.findCardsElement.nativeElement;
    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atTop) {
      // console.log(atTop)
      // this.filterService.loadCards('prev')
    } else if (atBottom) {
      // console.log(atBottom)
      this.filterUserService.loadCards('next')
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}


