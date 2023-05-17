import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private photoValue: any;
  photoChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  updateFilter(filterValue: any, photoValue: any) {
    this.filterValue = filterValue;
    this.photoValue = photoValue;
    this.filterChange$.next(filterValue);
    this.photoChange$.next(photoValue);
    console.log(filterValue)
    console.log(photoValue)
  }


  getFilterValue() {
    return this.filterValue;
  }
}
