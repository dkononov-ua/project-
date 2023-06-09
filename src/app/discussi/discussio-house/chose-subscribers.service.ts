import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribersService {
  private selectedSubscriberSubject = new BehaviorSubject<string | null>(null);
  public selectedSubscriber$ = this.selectedSubscriberSubject.asObservable();

  setSelectedSubscriber(subscriberId: string | null) {
    this.selectedSubscriberSubject.next(subscriberId);
  }
}
