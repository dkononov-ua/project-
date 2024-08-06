import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

// Сервіси
import { ChoseSubscribeService } from '../../../services/chose-subscribe.service';
import { SharedService } from 'src/app/services/shared.service';
import { CounterService } from 'src/app/services/counter.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';

// Конфігурації
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';

// Анімації
import { animations } from '../../../interface/animation';
import { FilterService } from 'src/app/search/filter.service';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
  animations: [animations.right1]
})
export class CardsListComponent implements OnInit, OnDestroy {

  // Імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';

  // Параметри оселі
  chosenFlat: any;
  choseFlatId: any | null = null;
  allCards: any;

  // Пагінатор
  offs = PaginationConfig.offs;
  counterFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;

  subscriptions: Subscription[] = [];
  currentLocation: string = '';
  isMobile: boolean = false;
  authorization: boolean = false;

  @ViewChild('findCards') findCardsElement!: ElementRef;

  constructor(
    private choseSubscribeService: ChoseSubscribeService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private location: Location,
    private cardsDataService: CardsDataService,
    private filterService: FilterService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLocation = this.location.path();
    await this.getCheckDevice();
    await this.getServerPath();
    this.checkUserAuthorization();
    await this.getChosenFlatId();
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

  // Запит на сервіс про список карток так їх кількість
  private getSubInfoFromService(offs: number): void {
    if (this.currentLocation !== '/search/house') {
      this.cardsDataService.getSubInfo(offs);
    }
    this.getCardsData();
    this.getCounterCards();
  }

  // Підписка на інформацію про картки
  private getCardsData(): void {
    this.subscriptions.push(
      this.cardsDataService.cardsData$.subscribe(data => {
        this.allCards = data;
      })
    );
  }

  // Підписка на кількість карток, та запит на якій я сторінці
  private getCounterCards(): void {
    const currentLocation = this.location.path();
    // Якщо я в Дискусії
    if (currentLocation === '/user/discus/discussion') {
      this.counterService.getUserDiscussioCount();
      this.subscriptions.push(
        this.counterService.counterUserDiscussio$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписниках
    } else if (currentLocation === '/user/discus/subscribers') {
      this.counterService.getUserSubscribersCount();
      this.subscriptions.push(
        this.counterService.counterUserSubscribers$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписках
    } else if (currentLocation === '/user/discus/subscriptions') {
      this.counterService.getUserSubscriptionsCount();
      this.subscriptions.push(
        this.counterService.counterUserSubscriptions$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
    } else if (currentLocation === '/search/house') {
      this.subscriptions.push(
        this.filterService.filterChange$.subscribe(async () => {
          const optionsFound = this.filterService.getOptionsFound();
          if (optionsFound) {
            this.counterFound = optionsFound;
          }
        })
      );
    }
    // Вираховую на якій я сторінці та скільки всього карток
    if (this.counterFound) {
      this.getCurrentPageInfo();
    }
  }

  // Перемикання оселі
  onFlatSelect(choseFlatId: any): void {
    this.choseSubscribeService.setChosenFlatId(choseFlatId);
    this.choseSubscribeService.setIndexPage(3);
  }

  // пагінатор наступна сторінка з картками
  incrementOffset(): void {
    if (this.pageEvent.pageIndex * this.pageEvent.pageSize + this.pageEvent.pageSize < this.counterFound) {
      this.pageEvent.pageIndex++;
      const offs = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.cardsDataService.getSubInfo(offs);
    }
    this.getCurrentPageInfo();
  }

  // пагінатор попередня сторінка з картками
  decrementOffset(): void {
    if (this.pageEvent.pageIndex > 0) {
      this.pageEvent.pageIndex--;
      const offs = this.pageEvent.pageIndex * this.pageEvent.pageSize;
      this.cardsDataService.getSubInfo(offs);
    }
    this.getCurrentPageInfo();
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

  goBack(): void {
    this.location.back();
  }

  // При закриванні компоненту
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // треба налаштувати
  onScroll(event: Event): void {
    const element = this.findCardsElement.nativeElement;
    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atTop) {
      // console.log(atTop)
      // this.filterService.loadCards('prev')
    } else if (atBottom) {
      // console.log(atBottom)
      this.filterService.loadCards('next')
    }
  }
}
