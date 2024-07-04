import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
// власні імпорти інформації
import { CounterService } from 'src/app/services/counter.service';
import { animations } from '../../../interface/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CardsDataHouseService } from 'src/app/services/house-components/cards-data-house.service';
import { SharedService } from 'src/app/services/shared.service';
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

  constructor(
    private choseSubscribersService: ChoseSubscribersService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cardsDataHouseService: CardsDataHouseService,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.counterService.getHouseSubscribersCount(0);

    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
    // Підписка на отримання айді обраного юзера
    this.subscriptions.push(
      this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
        this.selectedUserId = selectedSubscriber;
        // console.log(this.selectedUserId)
        if (this.selectedUserId) {
          this.indexPage = 2;
        }
      })
    );

    // Підписка на отримання кількості карток
    this.subscriptions.push(
      this.counterService.counterHouseSubscribers$.subscribe(data => {
        this.counterFound = Number(data);
      })
    );
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

