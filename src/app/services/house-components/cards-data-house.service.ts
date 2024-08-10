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
import { CounterService } from '../counter.service';
import { SelectedFlatService } from '../selected-flat.service';
import { ChoseSubscribersService } from '../chose-subscribers.service';
import { ActionDeleteSubComponent } from 'src/app/components/action-delete-sub/action-delete-sub.component';

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
  additionalHouseInfo: any;

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
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: offs, };
      const currentLocation = this.location.path();
      if (currentLocation === '/house/discus/discussion') {
        this.linkPath = '/acceptsubs/get/subs';
      }
      if (currentLocation === '/house/discus/subscribers') {
        this.linkPath = '/subs/get/subs';
      }
      if (currentLocation === '/house/discus/subscriptions') {
        this.linkPath = '/usersubs/get/ysubs';
      }
      try {
        this.allCards = await this.http.post(this.serverPath + this.linkPath, data).toPromise() as any[];
        if (this.allCards) {
          this.setCardsData(this.allCards)
        } else {
          this.setCardsData([])
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  setCardsData(data: any): void {
    this.cardsDataSubject.next(data);
    this.allCards = data;
    this.selectCard();
  }

  removeCardsData() {
    this.cardsDataSubject.next(null);
    this.allCards = null;
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  selectCard() {
    if (this.choseUserId && this.allCards) {
      const chosenUser = this.allCards.find((user: any) => user.user_id === Number(this.choseUserId));
      if (chosenUser) {
        this.setCardData(chosenUser)
        // (chosenUser?.owner, 1 => запитую різні рейтинги якщо 1 то я запитую і показую тільки рейтинг власника
        this.statusDataService.setStatusData(chosenUser);
        this.statusDataService.setUserData(chosenUser, 2);
        this.sharedService.getRatingOwner(chosenUser.user_id);
      }
    }
  }

  setCardData(data: any): void {
    this.cardDataSubject.next(data);
  }

  removeCardData() {
    this.cardDataSubject.next(undefined);
  }

  // Видалення
  async deleteUser(user: any, flatSub: string): Promise<void> {
    // console.log(user)
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(ActionDeleteSubComponent, {
      data: { user_id: user.user_id, firstName: user.firstName, lastName: user.lastName, flatSub: flatSub, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && user.user_id && this.selectedFlatId) {
        const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, user_id: user.user_id, };
        const currentLocation = this.location.path();
        if (currentLocation === '/house/discus/discussion') {
          this.linkPath = '/acceptsubs/delete/subs';
        }
        if (currentLocation === '/house/discus/subscribers') {
          this.linkPath = '/subs/delete/subs';
        }
        if (currentLocation === '/house/discus/subscriptions') {
          this.linkPath = '/usersubs/delete/subs';
        }
        try {
          const response: any = await this.http.post(this.serverPath + this.linkPath, data).toPromise();
          this.reportResultDeleteUserSubject.next(response);
          if (response.status === true) {
            setTimeout(() => {
              this.removeCardData();
              this.removeCardsData();
              location.reload();
            }, 200);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  async getAdditionalHouseInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/get/flatinf', {
          auth: JSON.parse(userJson),
          flat_id: this.selectedFlatId,
        }).toPromise();
        // console.log(response)
        if (response && response.status !== 'Не співпало ID квартири з користувачем') {
          this.additionalHouseInfo = response[0];
          localStorage.setItem('additionalHouseInfo', JSON.stringify(response));
          return this.additionalHouseInfo;
        } else {
          localStorage.removeItem('additionalHouseInfo');
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      return null;
    }
  };

  getResultDeleteUserSubject() {
    return this.reportResultDeleteUserSubject.asObservable();
  }
}
