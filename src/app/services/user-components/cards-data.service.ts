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
import { ActionDeleteSubComponent } from 'src/app/components/action-delete-sub/action-delete-sub.component';

@Injectable({
  providedIn: 'root'
})
export class CardsDataService {
  serverPath: string = '';
  subscriptions: any[] = [];
  choseFlatId: any | null;
  chosenFlat: any;

  // об'єкт зі всіма картками
  private cardsDataSubject = new BehaviorSubject<any>('');
  public cardsData$ = this.cardsDataSubject.asObservable();
  // об'єкт одна обрана картка
  private cardDataSubject = new BehaviorSubject<any>('');
  public cardData$ = this.cardDataSubject.asObservable();

  private reportResultDeleteFlatSubject = new Subject<any>();

  currentLocation: string;
  allCards: any;
  linkPath: string = '';
  statusDataOpen: number = 0;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private choseSubscribeService: ChoseSubscribeService,
    private statusDataService: StatusDataService,
    private location: Location,
    private locationHouseService: LocationHouseService,
    private dialog: MatDialog,
    private counterService: CounterService,

  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      // console.log(this.serverPath)
    })
    this.choseSubscribeService.selectedFlatId$.subscribe(async selectedFlatId => {
      if (selectedFlatId) {
        this.choseFlatId = selectedFlatId;
        this.selectCard();
      }
    });
    this.currentLocation = this.location.path();
    // console.log(this.currentLocation)
  }

  // Отримання та збереження даних всіх дискусій
  async getSubInfo(offs: number): Promise<void> {
    // console.log('getSubInfo')
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), offs: offs, };
    const currentLocation = this.location.path();
    if (currentLocation === '/user/discus/discussion') {
      this.linkPath = '/acceptsubs/get/ysubs';
    }
    if (currentLocation === '/user/discus/subscribers') {
      this.linkPath = '/usersubs/get/subs';
    }
    if (currentLocation === '/user/discus/subscriptions') {
      this.linkPath = '/subs/get/ysubs';
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
    this.allCards = data;
    // this.selectCard();
  }

  removeCardsData() {
    this.cardsDataSubject.next(null);
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  selectCard() {
    // console.log('i selected house card')
    // console.log('selectCard')
    // console.log(this.choseFlatId)
    // console.log(this.allCards)
    if (this.choseFlatId && this.allCards) {
      const chosenFlat = this.allCards.find((flat: any) => flat.flat.flat_id === this.choseFlatId);
      // console.log(chosenFlat)
      if (chosenFlat) {
        // console.log('i selected house card')
        this.setCardData(chosenFlat)
        this.statusDataService.setStatusDataFlat(chosenFlat.flat);
        if (chosenFlat?.owner) {
          this.statusDataService.setStatusData(chosenFlat.owner);
          //Не видаляй! (chosenFlat?.owner, 1 => запитую різні рейтинги якщо 1 то я запитую і показую тільки рейтинг власника
          this.statusDataService.setUserData(chosenFlat.owner, 1);
          this.sharedService.getRatingOwner(chosenFlat.owner.user_id);
        }
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
  async deleteFlatSub(flat: any, flatSub: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(ActionDeleteSubComponent, {
      data: { flatId: flat.flat.flat_id, flatName: flat.flat.flat_name, flatCity: flat.flat.city, flatSub: flatSub, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = { auth: JSON.parse(userJson), flat_id: flat.flat.flat_id, };
        const currentLocation = this.location.path();
        if (currentLocation === '/user/discus/discussion') {
          this.linkPath = '/acceptsubs/delete/ysubs';
        }
        if (currentLocation === '/user/discus/subscribers') {
          this.linkPath = '/usersubs/delete/ysubs';
        }
        if (currentLocation === '/user/discus/subscriptions') {
          this.linkPath = '/subs/delete/ysubs';
        }
        try {
          const response: any = await this.http.post(this.serverPath + this.linkPath, data).toPromise();
          this.reportResultDeleteFlatSubject.next(response);
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

  getResultDeleteFlatSubject() {
    return this.reportResultDeleteFlatSubject.asObservable();
  }
}
