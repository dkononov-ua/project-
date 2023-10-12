import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

  private filterValue: any;
  private optionsFound: number | undefined;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);  constructor() { }

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
}


