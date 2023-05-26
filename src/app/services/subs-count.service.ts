import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubsCountService {
  private subscribersCountSubject = new BehaviorSubject<number>(0);
  subscribersCount$ = this.subscribersCountSubject.asObservable();

  setSubscribersCount(count: number): void {
    this.subscribersCountSubject.next(count);
  }
}
