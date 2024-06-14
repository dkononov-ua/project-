import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(
    private choseSubscribeService: ChoseSubscribeService,
    private sharedService: SharedService,
    private counterService: CounterService,
    private location: Location,
    private cardsDataService: CardsDataService
  ) { }

  ngOnInit(): void {
    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(serverPath => {
        this.serverPath = serverPath;
      })
    );

    // Підписка на отримання айді обраної оселі
    this.subscriptions.push(
      this.choseSubscribeService.selectedFlatId$.subscribe(selectedFlatId => {
        this.choseFlatId = selectedFlatId;
      })
    );

    this.getSubInfoFromService(this.offs);
  }

  // Запит на сервіс про список карток так їх кількість
  private getSubInfoFromService(offs: number): void {
    this.cardsDataService.getSubInfo(offs);
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
    if (currentLocation === '/subscribers-discuss') {
      this.counterService.getUserDiscussioCount();
      this.subscriptions.push(
        this.counterService.counterUserDiscussio$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписниках
    } else if (currentLocation === '/subscribers-user') {
      this.counterService.getUserSubscribersCount();
      this.subscriptions.push(
        this.counterService.counterUserSubscribers$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписках
    } else if (currentLocation === '/allCards-user') {
      this.counterService.getUserSubscriptionsCount();
      this.subscriptions.push(
        this.counterService.counterUserSubscriptions$.subscribe(data => {
          this.counterFound = Number(data);
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
    // Встановлюю обрану оселю щоб виділити її
    this.choseFlatId = choseFlatId;
    // Передаю ID обраної оселю
    this.choseSubscribeService.setChosenFlatId(this.choseFlatId);
    // Встановлюю дані по обраній оселі на сервісі
    this.cardsDataService.selectCard();
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
}
