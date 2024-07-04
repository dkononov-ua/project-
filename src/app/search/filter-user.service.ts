import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardsDataHouseService } from '../services/house-components/cards-data-house.service';

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

  constructor(private cardsDataHouseService: CardsDataHouseService) { }

  updateFilter(filterValue: any, counterFound: number) {
    this.filterValue = filterValue;
    // console.log(this.filterValue)
    this.counterFound$.next(counterFound);
    if (this.filterValue) {
      this.filterChange$.next(filterValue);
      // console.log(filterValue)
      this.cardsDataHouseService.setCardsData(filterValue);
    }
  }

  getFilterValue() {
    return this.filterValue;
  }

  // getOptionsFound() {
  //   return this.counterFound;
  // }

  loadCards(loadCards: string) {
    // console.log(loadCards);
    this.loadCards$.next(loadCards);
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


