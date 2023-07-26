import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterUserService {

  private filterValue: any;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  updateFilter(filterValue: any) {
    this.filterValue = filterValue;
    this.filterChange$.next(filterValue);
  }

  getFilterValue() {
    return this.filterValue;
  }
}
