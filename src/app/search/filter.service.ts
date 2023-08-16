import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  photoChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  updateFilter(filterValue: any) {
    console.log(filterValue)
    this.filterValue = filterValue;
    this.filterChange$.next(filterValue);
  }

  getFilterValue() {
    return this.filterValue;
  }
}
