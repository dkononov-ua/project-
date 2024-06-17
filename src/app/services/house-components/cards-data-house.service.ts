import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from '../shared.service';
import { ChoseSubscribeService } from '../chose-subscribe.service';
import { StatusDataService } from '../status-data.service';
import { Location } from '@angular/common';
import { LocationHouseService } from '../location-house.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSubsComponent } from 'src/app/discussi/discussio-user/delete/delete-subs.component';
import { CounterService } from '../counter.service';
import { SelectedFlatService } from '../selected-flat.service';
import { ChoseSubscribersService } from '../chose-subscribers.service';

@Injectable({
  providedIn: 'root'
})
export class CardsDataHouseService {
  serverPath: string = '';
  subscriptions: any[] = [];

  // об'єкт зі всіма картками
  private cardsDataSubject = new BehaviorSubject<any>('');
  public cardsData$ = this.cardsDataSubject.asObservable();
  // об'єкт одна обрана картка
  private cardDataSubject = new BehaviorSubject<any>('');
  public cardData$ = this.cardDataSubject.asObservable();

  private reportResultDeleteUserSubject = new Subject<any>();

  currentLocation: string;
  allCards: any;
  linkPath: string = '';
  statusDataOpen: number = 0;
  selectedFlatId: any | null;
  choseUserId: any | null;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private choseSubscribeService: ChoseSubscribeService,
    private statusDataService: StatusDataService,
    private location: Location,
    private locationHouseService: LocationHouseService,
    private dialog: MatDialog,
    private counterService: CounterService,
    private selectedFlatService: SelectedFlatService,
    private choseSubscribersService: ChoseSubscribersService,

  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      // console.log(this.serverPath)
    })
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId || null;
    });
    this.choseSubscribersService.selectedSubscriber$.subscribe(selectedSubscriber => {
      this.choseUserId = selectedSubscriber;
    })
    this.currentLocation = this.location.path();
    // console.log(this.currentLocation)
  }

  // Отримання даних всіх користувачів
  async getUserInfo(offs: number): Promise<void> {
    console.log('getUserInfo')
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: offs, };
    const currentLocation = this.location.path();
    if (currentLocation === '/subscribers-discus') {
      this.linkPath = '/acceptsubs/get/subs';
    }
    if (currentLocation === '/subscribers-house') {
      this.linkPath = '/subs/get/subs';
    }
    if (currentLocation === '/subscriptions-house') {
      this.linkPath = '/usersubs/get/ysubs';
    }
    // console.log(currentLocation)
    // console.log(this.linkPath)
    try {
      this.allCards = await this.http.post(this.serverPath + this.linkPath, data).toPromise() as any[];
      // console.log(this.allCards)
      if (this.allCards) {
        this.setCardsData(this.allCards)
      } else {
        this.setCardsData([])
      }
    } catch (error) {
      console.error(error);
    }
  }

  setCardsData(data: any): void {
    // console.log('setCardsData')
    // console.log(data)
    this.cardsDataSubject.next(data);
  }

  removeCardsData() {
    this.cardsDataSubject.next(null);
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  selectCard() {
    // console.log('selectCard')
    if (this.choseUserId && this.allCards) {
      const chosenUser = this.allCards.find((user: any) => user.user_id === this.choseUserId);
      if (chosenUser) {
        this.setCardData(chosenUser)
        // (chosenUser?.owner, 1 => запитую різні рейтинги якщо 1 то я запитую і показую тільки рейтинг власника
        this.statusDataService.setUserData(chosenUser, 1);
        this.sharedService.getRatingOwner(chosenUser.user_id);
      } else {
        console.log('Немає інформації');
      }
    }
  }

  setCardData(data: any): void {
    // console.log('setCardData')
    // console.log(data)
    this.cardDataSubject.next(data);
  }

  removeCardData() {
    this.cardDataSubject.next(null);
  }

  // Видалення
  async deleteUser(user: any, flatSub: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: { user_id: user.user_id, firstName: user.firstName, lastName: user.lastName, flatSub: flatSub, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && user.user_id && this.selectedFlatId) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: user.user_id, };
        const currentLocation = this.location.path();
        if (currentLocation === '/subscribers-discus') {
          this.linkPath = '/acceptsubs/delete/subs';
        }
        if (currentLocation === '/subscribers-house') {
          this.linkPath = '/subs/delete/subs';
        }
        if (currentLocation === '/subscriptions-house') {
          this.linkPath = '/usersubs/delete/subs';
        }
        try {
          const response: any = await this.http.post(this.serverPath + this.linkPath, data).toPromise();
          this.reportResultDeleteUserSubject.next(response);
          this.removeCardData();
          this.removeCardsData();
          setTimeout(() => {
            this.getUserInfo(0);
          }, 100);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  getResultDeleteUserSubject() {
    return this.reportResultDeleteUserSubject.asObservable();
  }
}
