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
    return this.isChatOpenSubject.value;
  }

  setIsChatOpen(isChatOpen: boolean) {
    this.isChatOpenSubject.next(isChatOpen);
  }
}
