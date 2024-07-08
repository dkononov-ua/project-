import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
// власні імпорти інформації
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { SharedService } from 'src/app/services/shared.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-subscribers-house',
  templateUrl: './subscribers-house.component.html',
  styleUrls: ['./../../discussi.scss'],
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

export class SubscribersHouseComponent implements OnInit, OnDestroy {

  indexPage: number = 0;
  selectedUserId: any;
  page: any;
  counterFound: number = 0;
  startX = 0;
  subscriptions: any[] = [];
  isMobile: boolean = false;

  goBack(): void {
    this.location.back();
  }
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }
  selectedFlatId: number = 0;

  constructor(
    private choseSubscribersService: ChoseSubscribersService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cardsDataHouseService: CardsDataHouseService,
    private sharedService: SharedService,
    private selectedFlatService: SelectedFlatService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getSelectedFlat();
    await this.getСhoseUserID();
    if (this.selectedFlatId) {
      await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
      await this.getCounterFound();
    }
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
        this.selectedFlatId = Number(flatId);
      })
    )
  }

  // Підписка на отримання айді обраного юзера
  async getСhoseUserID() {
    this.subscriptions.push(
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.selectedUserId = Number(selectedSubscriber);
        // console.log(this.selectedUserId)
        if (this.selectedUserId) {
          this.indexPage = 2;
        }
      })
    )
  }

  // Підписка на отримання кількості карток
  async getCounterFound() {
    this.subscriptions.push(
      this.counterService.counterHouseSubscribers$.subscribe(data => {
        // console.log(data)
        this.counterFound = Number(data);
      }))
  }

  closeUser() {
    this.choseSubscribersService.removeChosenUserId();
    this.indexPage = 1;
  }

  ngOnDestroy() {
    this.cardsDataHouseService.removeCardData(); // очищуємо дані про оселю
    this.closeUser();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }
  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.router.navigate(['/house/house-info']);
      }
    } else {
      if (this.indexPage !== 1 && !this.selectedUserId) {
        this.indexPage++;
      } else if (this.selectedUserId && this.indexPage <= 2) {
        this.indexPage++;
      }
    }
  }
}

