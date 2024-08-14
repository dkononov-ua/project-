import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
// власні імпорти інформації
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../../interface/animation';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { SharedService } from 'src/app/services/shared.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-resident-owner',
  templateUrl: './resident-owner.component.html',
  styleUrls: ['./../../../subs.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.right1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.appearance,
  ],
})

export class ResidentOwnerComponent implements OnInit, OnDestroy {

  indexPage: number = 0;
  selectedUserId: any;
  page: any;
  counterFound: number = 0;
  subscriptions: any[] = [];
  isMobile: boolean = false;
  chosenUser: any;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  selectedFlatId: number = 0;

  constructor(
    private choseSubscribersService: ChoseSubscribersService,
    private counterService: CounterService,
    private cardsDataHouseService: CardsDataHouseService,
    private sharedService: SharedService,
    private selectedFlatService: SelectedFlatService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getSelectedFlat();
    await this.getСhoseUserID();
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    await this.getCardData();
    await this.getCounterFound();

  }

  // Підписка на отримання даних обраної оселі
  async getCardData() {
    this.subscriptions.push(
      this.cardsDataHouseService.cardData$.subscribe(async (data: any) => {
        this.chosenUser = data;
        if (this.chosenUser) {
          this.onClickMenu(2);
        } else {
          this.onClickMenu(1);
        }
      })
    );
  }

  // підписка на шлях до серверу
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        if (flatId) {
          this.selectedFlatId = Number(flatId);
        } else {
          this.sharedService.logoutHouse();
        }
      })
    )
  }

  // Підписка на отримання айді обраного юзера
  async getСhoseUserID() {
    this.subscriptions.push(
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.selectedUserId = Number(selectedSubscriber);
      })
    )
  }

  // Підписка на отримання кількості карток
  async getCounterFound() {
    this.subscriptions.push(
      this.counterService.counterHouseDiscussio$.subscribe(data => {
        // console.log(data)
        this.counterFound = Number(data);
      }))
  }

  ngOnDestroy() {
    this.close();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  close() {
    this.onClickMenu(1);
    setTimeout(() => {
      this.choseSubscribersService.removeChosenUserId();
      this.cardsDataHouseService.removeCardData();
    }, 300);
  }

}

