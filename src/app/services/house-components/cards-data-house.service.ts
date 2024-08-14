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
  iResident: string = '';

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
    const currentLocation = this.location.path();
    if (currentLocation === '/house/discus/discussion') {
      this.linkPath = '/acceptsubs/get/subs';
      this.getResponseUserInfo(this.linkPath, offs);
    }
    if (currentLocation === '/house/discus/subscribers') {
      this.linkPath = '/subs/get/subs';
      this.getResponseUserInfo(this.linkPath, offs);
    }
    if (currentLocation === '/house/discus/subscriptions') {
      this.linkPath = '/usersubs/get/ysubs';
      this.getResponseUserInfo(this.linkPath, offs);
    }
    if (currentLocation === '/house/residents/resident') {
      this.linkPath = '/citizen/get/citizen';
      this.getResponseUserInfo(this.linkPath, offs);
    }
    if (currentLocation === '/house/residents/owner') {
      this.linkPath = '/citizen/get/ycitizen';
      this.getResponseOwnerInfo(offs);
    }
  }

  async getResponseUserInfo(linkPath: string, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const data = { auth: JSON.parse(userJson!), flat_id: this.selectedFlatId, offs: offs, };
      try {
        this.allCards = await this.http.post(this.serverPath + linkPath, data).toPromise() as any[];
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
  }

  // Отримую інформацію про власника
  async getResponseOwnerInfo(offs: number): Promise<any> {
    const userData = localStorage.getItem('userData');
    const userJson = localStorage.getItem('user');
    if (userJson && userData) {
      const userObject = JSON.parse(userData);
      const user_id = userObject.inf.user_id;
      const data = { auth: JSON.parse(userJson!), user_id: user_id, flat_id: this.selectedFlatId, offs: offs, };
      try {
        const response = await this.http.post(this.serverPath + '/citizen/get/ycitizen', data).toPromise() as any[];
        const ownerInfo = response.find(item => item.flat.flat_id.toString() === this.selectedFlatId)?.owner;
        if (ownerInfo) {
          this.allCards = [ownerInfo];
          this.setCardsData(this.allCards)
          if (user_id === ownerInfo.user_id) {
            this.iResident = 'false';
            this.sharedService.setCheckOwnerPage(this.iResident);
          } else {
            this.iResident = 'true';
            this.sharedService.setCheckOwnerPage(this.iResident);
            localStorage.setItem('ownerInfo', JSON.stringify(ownerInfo));
          }
        } else {
          this.iResident = 'false';
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
    // console.log('selectCard')
    if (this.choseUserId && this.allCards) {
      const chosenUser = this.allCards.find((user: any) => user.user_id === Number(this.choseUserId));
      if (chosenUser) {
        this.setCardData(chosenUser);
        this.currentLocation = this.location.path();
        // (chosenUser?.owner, 1 => запитую різні рейтинги якщо 1 то я запитую і показую тільки рейтинг власника
        this.statusDataService.setStatusData(chosenUser);
        if (this.currentLocation === '/house/residents/owner') {
          this.statusDataService.setUserData(chosenUser, 1);
        } else {
          this.statusDataService.setUserData(chosenUser, 2);
        }
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
        if (currentLocation === '/house/residents/resident') {
          this.linkPath = '/citizen/delete/citizen';
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

  // Отримую угоди та перевіряю інформацію по мешканцям та умовам їх угод
  async getConcludedAgree(): Promise<any> {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        console.error('User not found in localStorage');
        return;
      }

      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        offs: 0,
      };

      const response: any = await this.http.post(`${this.serverPath}/agreement/get/saveagreements`, data).toPromise();
      // console.log(response)
      if (!response) {
        return {
          numConcludedAgree: 0,
          selectedSubAgree: null,
          timeToOpenRating: null,
          statusPermitCreate: false,
          statusPermitCreateMsg: 'Немає угод',
          statusPermitStart: false,
          statusPermitStartMsg: 'Немає угод',
          statusPermitEnd: false,
          statusPermitEndMsg: 'Немає угод',
        };
      }

      const agreeData = response.filter((item: { flat: { subscriber_id: any; }; }) =>
        item.flat.subscriber_id === Number(this.choseUserId)
      );

      if (agreeData.length === 0) {
        return {
          numConcludedAgree: 0,
          selectedSubAgree: null,
          timeToOpenRating: null,
          statusPermitCreate: false,
          statusPermitCreateMsg: 'Немає угод',
          statusPermitStart: false,
          statusPermitStartMsg: 'Немає угод',
          statusPermitEnd: false,
          statusPermitEndMsg: 'Немає угод',
        };
      }

      const selectedSubAgree = agreeData[0].flat;
      const { dateAgreeStart, dateAgreeEnd, data: agreeDataDate } = selectedSubAgree;

      // Підраховую кількість днів до відкриття відгука
      const openRating = new Date(agreeDataDate);
      openRating.setDate(openRating.getDate() + 14);
      const today = new Date();
      const differenceInDays = Math.ceil((openRating.getTime() - today.getTime()) / (1000 * 3600 * 24));

      return {
        numConcludedAgree: agreeData.length,
        selectedSubAgree,
        timeToOpenRating: differenceInDays,
        statusPermitCreate: differenceInDays <= 0,
        statusPermitCreateMsg: differenceInDays <= 0
          ? 'Оцінювання дозволено'
          : `Доступ до цінювання через ${differenceInDays} днів`,
        statusPermitStart: new Date() > new Date(dateAgreeStart),
        statusPermitStartMsg: new Date() > new Date(dateAgreeStart)
          ? 'Оцінювання дозволено'
          : 'Угода не вступила в силу',
        statusPermitEnd: new Date() < new Date(dateAgreeEnd),
        statusPermitEndMsg: new Date() < new Date(dateAgreeEnd)
          ? 'Оцінювання дозволено'
          : 'Дія угоди закінчена',
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
