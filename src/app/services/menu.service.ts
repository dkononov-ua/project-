import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface MenuStatus {
  status: boolean;
  index: number;
}

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  private toogleMenuSubject = new BehaviorSubject<MenuStatus>({ status: false, index: 0 });
  public toogleMenu$ = this.toogleMenuSubject.asObservable();
  private indexMenuSubject = new BehaviorSubject<number>(0);
  public indexMenu$ = this.indexMenuSubject.asObservable();

  constructor() { }

  toogleMenu(status: boolean, index: number) {
    this.toogleMenuSubject.next({ status, index });
  }

  indexMenu(index: number) {
    this.indexMenuSubject.next(index);
  }


}
