import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterUserService } from '../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../interface/animation';
import { Location } from '@angular/common';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';

@Component({
  selector: 'app-search-tenant',
  templateUrl: './search-tenant.component.html',
  styleUrls: ['../search.term.scss'],
  animations: [
    animations.right2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
    animations.appearance,
  ],
})

export class SearchTenantComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  counterFound: number = 0;
  selectedFlatId!: number | null;
  houseData: any;
  acces_subs: number = 1;
  indexPage: number = 1;
  startX = 0;
  blockBtnStatus: boolean = false;
  authorizationHouse: boolean = false;
  counterHouseSubscriptions: number = 0;
  isMobile = false;
  goBack(): void {
    this.location.back();
  }
  subscriptions: any[] = [];

  constructor(
    private filterUserService: FilterUserService,
    private selectedFlatService: SelectedFlatService,
    private location: Location,
    private counterService: CounterService,
    private sharedService: SharedService,
    private choseSubscribersService: ChoseSubscribersService,
    private cardsDataHouseService: CardsDataHouseService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.getSelectedFlat();
    this.getBtnStatus();
    this.getHouseAcces();
    this.getCounterFound();
    this.getIndexPage();
  }

  // підписка на шлях до серверу
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

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (this.selectedFlatId) {
          this.authorizationHouse = true;
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  // Відкриваю сторінку профілю
  async getIndexPage() {
    this.subscriptions.push(
      this.choseSubscribersService.indexPage$.subscribe(indexPage => {
        this.indexPage = indexPage;
      })
    )
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    this.subscriptions.push(
      this.counterService.counterHouseSubscriptions$.subscribe(data => {
        const counterHouseSubscriptions: any = data;
        this.counterHouseSubscriptions = counterHouseSubscriptions;
      })
    )
  }

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    this.houseData = localStorage.getItem('houseData');
    if (this.houseData) {
      const parsedHouseData = JSON.parse(this.houseData);
      this.houseData = parsedHouseData;
      // console.log(this.houseData)
      if (this.houseData.acces) {
        this.acces_subs = this.houseData.acces.acces_subs;
      } else {
        await this.getHouseSubscriptionsCount();
      }
    } else {
      this.acces_subs = 0
    }
  }

  async getCounterFound() {
    // Підписка на отримання айді обраного юзера
    this.subscriptions.push(
      this.filterUserService.counterFound$.subscribe(number => {
        const counterFound = number;
        if (counterFound !== 0) {
          this.counterFound = counterFound;
          this.filterUserService.blockBtn(false)
        } else {
          this.counterFound = counterFound;
        }
      })
    )
  }

  getBtnStatus() {
    this.subscriptions.push(
      this.filterUserService.blockBtnStatus$.subscribe(blockBtnStatus => {
        this.blockBtnStatus = blockBtnStatus;
      })
    )
  }

  ngOnDestroy() {
    // видаляю обраний айді користувача
    this.choseSubscribersService.removeChosenUserId();
    this.cardsDataHouseService.removeCardData(); // очищуємо дані про оселю

    // скидую в компоненті profile індекс сторінки щоб показувати всі картки при оновленні сторінки
    this.choseSubscribersService.setIndexPage(2);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

