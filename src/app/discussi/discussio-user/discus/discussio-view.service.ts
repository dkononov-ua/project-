import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussioViewService {

  private discussioViewSubject = new BehaviorSubject<boolean>(false);
  public discussioView$ = this.discussioViewSubject.asObservable();
  discussioView: boolean = false;

  getDiscussioView(): boolean {
    return this.discussioViewSubject.value;
  }

  setDiscussioView(discussioView: boolean) {
    this.discussioViewSubject.next(discussioView);
  }
}
