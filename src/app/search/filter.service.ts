import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  private optionsFound: number | undefined;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  photoChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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
}
