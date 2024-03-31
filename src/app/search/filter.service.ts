import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  private optionsFound: number | undefined;

  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  house$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  loadCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sortValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  showedCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  updateFilter(filterValue: any, optionsFound: number) {
    this.filterValue = filterValue;
    this.optionsFound = optionsFound;
    this.filterChange$.next(filterValue);
  }

  getFilterValue() {
    return this.filterValue;
  }

  getOptionsFound() {
    return this.optionsFound;
  }

  loadCards(loadCards: string) {
    // console.log(loadNextCards);
    this.loadCards$.next(loadCards);
  }

  showedCards(showedCards: string) {
    // console.log(loadNextCards);
    this.showedCards$.next(showedCards);
  }

  pickHouse(house: any) {
    // console.log(house);
    if (house) {
      this.house$.next(house);
    }
  }

  sortHouse(sortValue: any) {
    // console.log('sortHouse')
    this.sortValue$.next(sortValue);
  }




}
