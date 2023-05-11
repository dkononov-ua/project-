import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  updateFilter(filterValue: any) {
    this.filterValue = filterValue;
    this.filterChange$.next(filterValue);
    // console.log(filterValue);
  }

  getFilterValue() {
    return this.filterValue;
  }
}
