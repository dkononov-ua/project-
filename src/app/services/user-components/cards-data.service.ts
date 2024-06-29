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
      this.choseFlatId = selectedFlatId;
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
    if (currentLocation === '/subscribers-discuss') {
      this.linkPath = '/acceptsubs/get/ysubs';
    }
    if (currentLocation === '/subscribers-user') {
      this.linkPath = '/usersubs/get/subs';
    }
    if (currentLocation === '/subscriptions-user') {
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
  }

  removeCardsData() {
    this.cardsDataSubject.next(null);
  }

  // Виводимо інформацію з локального сховища про обрану оселю
  selectCard() {
    // console.log('selectCard')
    if (this.choseFlatId && this.allCards) {
      const chosenFlat = this.allCards.find((flat: any) => flat.flat.flat_id === this.choseFlatId);
      if (chosenFlat) {
        this.setCardData(chosenFlat)
        // console.log(this.chosenFlat)
        this.statusDataService.setStatusDataFlat(chosenFlat.flat);
        if (chosenFlat?.owner) {
          this.statusDataService.setStatusData(chosenFlat.owner);
          // (chosenFlat?.owner, 1 => запитую різні рейтинги якщо 1 то я запитую і показую тільки рейтинг власника
          this.statusDataService.setUserData(chosenFlat.owner, 1);
          this.sharedService.getRatingOwner(chosenFlat.owner.user_id);
        }
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
  async deleteFlatSub(flat: any, flatSub: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(DeleteSubsComponent, {
      data: { flatId: flat.flat.flat_id, flatName: flat.flat.flat_name, flatCity: flat.flat.city, flatSub: flatSub, }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson && flat) {
        const data = { auth: JSON.parse(userJson), flat_id: flat.flat.flat_id, };
        const currentLocation = this.location.path();
        if (currentLocation === '/subscribers-discuss') {
          this.linkPath = '/acceptsubs/delete/ysubs';
        }
        if (currentLocation === '/subscribers-user') {
          this.linkPath = '/usersubs/delete/ysubs';
        }
        if (currentLocation === '/subscriptions-user') {
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
