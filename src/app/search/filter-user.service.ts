import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

  private filterValue: any;
  private optionsFound: number | undefined;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  loadCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sortValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  showedCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  updateFilter(filterValue: any, optionsFound: number) {
    this.filterValue = filterValue;
    this.optionsFound = optionsFound;
    if (this.filterValue) {
      this.filterChange$.next(filterValue);
    }
  }

  getFilterValue() {
    return this.filterValue;
  }

  getOptionsFound() {
    return this.optionsFound;
  }

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

  sortTenants(sortValue: any) {
    // console.log('sortHouse')
    this.sortValue$.next(sortValue);
  }


}


