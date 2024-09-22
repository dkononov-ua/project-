import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardsDataHouseService } from '../house-components/cards-data-house.service';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

  private filterValue: any;
  counterFound$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  loadCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sortValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  showedCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  blockBtnStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  limits$: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  constructor(private cardsDataHouseService: CardsDataHouseService) { }

  updateFilter(filterValue: any, counterFound: number) {
    // присвоюю значення знайденої інформації
    this.filterValue = filterValue;
    // передаю значення кількості знайденого
    this.counterFound$.next(counterFound);
    // передаю інформацію туди де я на неї підписався
    this.filterChange$.next(filterValue);
    // передаю в сервіс там де я отримую і виводжу інформацію по картках користувачаів
    this.cardsDataHouseService.setCardsData(filterValue);
  }

  getFilterValue() {
    return this.filterValue;
  }

  loadCards(loadCards: string) {
    // console.log(loadCards);
    this.loadCards$.next(loadCards);
  }

  setLimits(limits: number) {
    console.log(limits);
    this.limits$.next(limits);
  }

  showedCards(showedCards: string) {
    // console.log(loadNextCards);
    this.showedCards$.next(showedCards);
  }

  pickUser(user: any) {
    // console.log(house);
    if (user) {
      this.user$.next(user);
    }
  }

  blockBtn(status: boolean) {
    // console.log('blockBtnStatus', status);
    this.blockBtnStatus$.next(status);
  }

  sortTenants(sortValue: any) {
    // console.log('sortHouse')
    this.sortValue$.next(sortValue);
  }
}


