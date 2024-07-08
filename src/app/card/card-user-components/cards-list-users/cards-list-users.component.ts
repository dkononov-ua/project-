import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
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
import { Chat } from '../../../interface/info';
import { animations } from '../../../interface/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StatusDataService } from 'src/app/services/status-data.service';
import { Subscription } from 'rxjs';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { FilterUserService } from 'src/app/search/filter-user.service';

@Component({
  selector: 'app-cards-list-users',
  templateUrl: './cards-list-users.component.html',
  styleUrls: ['./cards-list-users.component.scss'],
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
    animations.top3,
  ],
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
    private cardsDataHouseService: CardsDataHouseService,
    private statusDataService: StatusDataService,
    private filterUserService: FilterUserService,
  ) { }

  ngOnInit(): void {
    this.currentLocation = this.location.path();

    // Підписка на шлях до серверу
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(serverPath => {
        this.serverPath = serverPath;
      })
    );

    // Підписка на отримання айді обраної оселі
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
      })
    );

    // Підписка на отримання айді юзера
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

    this.getSubInfoFromService(this.offs);
  }

  // Запит на сервіс про список карток так їх кількість
  private getSubInfoFromService(offs: number): void {
    if (this.currentLocation !== '/search-tenants') {
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
        // console.log(this.allCards)
      })
    );
  }

  // Підписка на кількість карток, та запит на якій я сторінці
  private getCounterCards(): void {
    // Якщо я в Дискусії
    if (this.currentLocation === '/subscribers-discus') {
      this.counterService.getHouseDiscussioCount(this.selectedFlatId);
      this.subscriptions.push(
        this.counterService.counterHouseDiscussio$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписниках
    } else if (this.currentLocation === '/subscribers-house') {
      this.counterService.getHouseSubscribersCount(this.selectedFlatId);
      this.subscriptions.push(
        this.counterService.counterHouseSubscribers$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
      // Якщо я в Підписках
    } else if (this.currentLocation === '/subscriptions-house') {
      this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
      this.subscriptions.push(
        this.counterService.counterHouseSubscriptions$.subscribe(data => {
          this.counterFound = Number(data);
        })
      );
    } else if (this.currentLocation === '/search-tenants') {
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}


