import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribersService {

  private selectedSubscriberSubject = new BehaviorSubject<string>('');
  public selectedSubscriber$ = this.selectedSubscriberSubject.asObservable();
  getSelectedSubscriber: any;
  selectSubscriber: any;
  getSelectedSubscriberId: any;

  constructor() {
    const storedSubscriberId = localStorage.getItem('selectedSubscriberId');
    if (storedSubscriberId) {
      this.selectedSubscriberSubject.next(storedSubscriberId);
    }
  }

  setSelectedSubscriber(subscriberId: string) {
    // console.log(subscriberId)
    this.selectedSubscriberSubject.next(subscriberId);
    if (subscriberId) {
      localStorage.setItem('selectedSubscriberId', subscriberId);
    } else {
      localStorage.removeItem('selectedSubscriberId');
    }
  }

  removeChosenUserId() {
    // console.log('removeChosenFlatId')
    this.selectedSubscriberSubject.next('');
  }
}
