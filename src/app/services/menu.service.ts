import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  private toogleMenuSubject = new BehaviorSubject<boolean>(false);
  public toogleMenu$ = this.toogleMenuSubject.asObservable();

  private toogleMenuEditUserSubject = new BehaviorSubject<boolean>(false);
  public toogleMenuEditUser$ = this.toogleMenuEditUserSubject.asObservable();


  constructor() { }

  toogleMenu(status: boolean) {
    this.toogleMenuSubject.next(status);
  }

  toogleMenuEditUser(status: boolean) {
    this.toogleMenuEditUserSubject.next(status);
  }

}
