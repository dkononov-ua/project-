import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribersService {

  private selectedSubscriberSubject = new BehaviorSubject<string | null>(null);
  public selectedSubscriber$ = this.selectedSubscriberSubject.asObservable();
  getSelectedSubscriber: any;

  constructor() {
    const storedSubscriberId = localStorage.getItem('selectedSubscriberId');
    if (storedSubscriberId) {
      this.selectedSubscriberSubject.next(storedSubscriberId);
    }
  }

  setSelectedSubscriber(subscriberId: string | null) {
    this.selectedSubscriberSubject.next(subscriberId);
    if (subscriberId) {
      localStorage.setItem('selectedSubscriberId', subscriberId);
    } else {
      localStorage.removeItem('selectedSubscriberId');
    }
  }
}
