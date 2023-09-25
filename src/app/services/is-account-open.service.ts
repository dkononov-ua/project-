import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsAccountOpenService {
  private isAccountOpenSubject = new BehaviorSubject<boolean>(false);
  public isAccountOpen$ = this.isAccountOpenSubject.asObservable();
  isAccountOpen: boolean = false;

  getIsAccountOpen(): boolean {
    console.log(this.isAccountOpenSubject.value)
    return this.isAccountOpenSubject.value;
  }

  setIsAccountOpen(isAccountOpen: boolean) {
    console.log(isAccountOpen)
    this.isAccountOpenSubject.next(isAccountOpen);
  }
}
