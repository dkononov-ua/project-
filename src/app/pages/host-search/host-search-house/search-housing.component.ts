import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Location } from '@angular/common';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';
import { ChoseSubscribeService } from 'src/app/services/chose-subscribe.service';
import { FilterService } from 'src/app/services/search/filter.service';
import { CardsDataService } from 'src/app/services/user-components/cards-data.service';
@Component({
  selector: 'app-search-housing',
  templateUrl: './search-housing.component.html',
  styleUrls: ['./../../../style/search/search.term.scss'],
  animations: [animations.appearance],
})

export class SearchHousingComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  counterFound: number = 0
  openUser: boolean = false;
  card_info: number = 0;
  indexPage: number = 1;
  shownCard: string | undefined;
  filterValue: string = '';
  authorization: boolean = false;
  isMobile = false;
  counterUserSubscriptions: any;

  goBack(): void {
    this.location.back();
  }

  subscriptions: any[] = [];
  blockBtnStatus: boolean = false;

  constructor(
    private filterService: FilterService,
    private location: Location,
    private counterService: CounterService,
    private sharedService: SharedService,
    private choseSubscribeService: ChoseSubscribeService,
    private cardsDataService: CardsDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    await this.getSearchInfo();
    this.getShowedCards();
    await this.getIndexPage();
    await this.getLoadResult();
  }

  // перевірка девайсу
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

  // показую маленький лоадер на кількість знайдених варіантів
  async getLoadResult() {
    this.subscriptions.push(
      this.filterService.blockBtnStatus$.subscribe(async (status: boolean) => {
        this.blockBtnStatus = status;
        setTimeout(() => {
          if (this.blockBtnStatus) {
            this.blockBtnStatus = !this.blockBtnStatus;
          }
        }, 3000);
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      this.getUserSubscriptionsCount()
      await this.counterService.getUserSubscriptionsCount();
    } else {
      this.authorization = false;
    }
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    this.subscriptions.push(
      this.counterService.counterUserSubscriptions$.subscribe(data => {
        const counterUserSubscriptions: any = data;
        if (counterUserSubscriptions.status === 'Немає доступу') {
          this.counterUserSubscriptions = null;
        } else {
          this.counterUserSubscriptions = counterUserSubscriptions;
        }
      })
    );
  }

  // підписка на кількість знайдених осель
  async getSearchInfo() {
    this.subscriptions.push(
      this.filterService.filterChange$.subscribe(async () => {
        const counterFound = this.filterService.getOptionsFound();
        if (counterFound) {
          this.counterFound = counterFound;
        } else {
          this.counterFound = 0;
        }
      })
    );
  }

  getShowedCards() {
    this.filterService.showedCards$.subscribe(showedCards => {
      // console.log(showedCards)
      if (showedCards !== '') {
        this.shownCard = showedCards;
      }
    });
  }

  // Відправляю на сервіс фільтр який я хочу застосувати
  onSortSelected(value: string) {
    this.filterValue = value;
    this.filterService.sortHouse(value)
  }

  // Відкриваю сторінку профілю
  async getIndexPage() {
    this.subscriptions.push(
      this.choseSubscribeService.indexPage$.subscribe(indexPage => {
        this.indexPage = indexPage;
      })
    )
  }

  ngOnDestroy() {
    // видаляю обраний айді оселі
    this.choseSubscribeService.removeChosenFlatId();
    this.cardsDataService.removeCardData; // очищуємо дані про оселю
    this.cardsDataService.removeCardsData();

    // скидую в компоненті profile індекс сторінки щоб показувати всі картки при оновленні сторінки
    this.choseSubscribeService.setIndexPage(2);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

