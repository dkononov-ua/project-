import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsChatOpenService {
  private isChatOpenSubject = new BehaviorSubject<boolean>(false);
  public isChatOpen$ = this.isChatOpenSubject.asObservable();
  isChatOpen: boolean = false;

  getIsChatOpen(): boolean {
    console.log(this.isChatOpenSubject.value)
    return this.isChatOpenSubject.value;
  }

  setIsChatOpen(isChatOpen: boolean) {
    console.log(isChatOpen)
    this.isChatOpenSubject.next(isChatOpen);
  }
}
