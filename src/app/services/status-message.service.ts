import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private statusMessageSubject = new BehaviorSubject<string>('');
  public statusMessage$ = this.statusMessageSubject.asObservable();

  constructor() { }

  setStatusMessage(message: string): void {
    // console.log(message);
    this.statusMessageSubject.next(message);
  }
}
