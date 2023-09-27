import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateComponentService {
  private updateSubject = new Subject<void>();
  private updateSubjectUser = new Subject<void>();

  update$ = this.updateSubject.asObservable();
  updateUser$ = this.updateSubjectUser.asObservable();

  triggerUpdate() {
    this.updateSubject.next();
  }

  triggerUpdateUser() {
    this.updateSubjectUser.next();
  }
}
