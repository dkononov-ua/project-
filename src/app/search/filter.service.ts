import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  private optionsFound: number | undefined;
  private card_info: number = 0;
  private indexPage: number = 1;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

  updatePage(card_info: number, indexPage: number) {
    this.card_info = card_info;
    this.indexPage = indexPage;
    this.filterChange$.next(card_info);
    this.filterChange$.next(indexPage);
    console.log(this.indexPage)
    console.log(this.card_info)
  }

  getCardInfo() {
    return this.card_info;
  }

  getIndexPage() {
    return this.indexPage;
  }

}
