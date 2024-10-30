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

  private toogleMenuEditHouseSubject = new BehaviorSubject<boolean>(false);
  public toogleMenuEditHouse$ = this.toogleMenuEditHouseSubject.asObservable();

  constructor() { }

  toogleMenu(status: boolean) {
    this.toogleMenuSubject.next(status);
  }

  // меню редагування користувача
  toogleMenuEditUser(status: boolean) {
    this.toogleMenuEditUserSubject.next(status);
  }

  // меню редагування оселі
  toogleMenuEditHouse(status: boolean) {
    this.toogleMenuEditHouseSubject.next(status);
  }

}
