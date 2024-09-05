import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  private toogleMenuSubject = new BehaviorSubject<boolean>(false);
  public toogleMenu$ = this.toogleMenuSubject.asObservable();

  constructor() { }

  toogleMenu(status: boolean) {
    // console.log('toogleMenu called with status:', status);
    // console.trace();  // Додає трасування стека викликів
    this.toogleMenuSubject.next(status);
  }

}
