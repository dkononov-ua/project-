import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  private optionsFound: number | undefined;
  private loadNextCards: boolean = false;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  loadNextCards$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  house$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  sortValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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

  getMoreCards() {
    return this.loadNextCards;
  }

  loadMoreCards(loadNextCards: boolean) {
    // console.log(loadNextCards);
    this.loadNextCards = loadNextCards
    this.loadNextCards$.next(loadNextCards);
  }

  pickHouse(house: any) {
    // console.log(house);
    if (house) {
      this.house$.next(house);
    }
  }

  sortHouse(sortValue: any) {
    console.log('sortHouse')
    this.sortValue$.next(sortValue);
  }




}
