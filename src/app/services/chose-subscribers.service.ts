import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribersService {

  private selectedSubscriberSubject = new BehaviorSubject<number>(0);
  public selectedSubscriber$ = this.selectedSubscriberSubject.asObservable();
  getSelectedSubscriber: any;
  selectSubscriber: any;
  getSelectedSubscriberId: any;

  private indexPageSubject = new BehaviorSubject<number>(1);
  public indexPage$ = this.indexPageSubject.asObservable();


  constructor() {
    const storedSubscriberId = localStorage.getItem('selectedSubscriberId');
    if (storedSubscriberId) {
      this.selectedSubscriberSubject.next(Number(storedSubscriberId));
    }
  }

  setIndexPage(indexPage: number) {
    this.indexPageSubject.next(indexPage);
  }

  removeChosenUserId() {
    // console.log('removeChosenFlatId')
    localStorage.removeItem('selectedSubscriberId');
    this.selectedSubscriberSubject.next(0);
  }

  setSelectedSubscriber(subscriberId: number) {
    if (subscriberId) {
      this.selectedSubscriberSubject.next(Number(subscriberId));
      localStorage.setItem('selectedSubscriberId', subscriberId.toString());
    }
  }


}
