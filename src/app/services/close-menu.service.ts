import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloseMenuService {
  private closeMenuSubject = new BehaviorSubject<boolean>(false);
  public closeMenu$ = this.closeMenuSubject.asObservable();
  closeMenu: boolean = false;

  getCloseMenu(): boolean {
    return this.closeMenuSubject.value;
  }

  setCloseMenu(closeMenu: boolean) {
    this.closeMenuSubject.next(closeMenu);
  }
}
