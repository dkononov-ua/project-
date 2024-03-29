import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateComponentService {
  private updateSubject = new Subject<void>();
  private updateSubjectUser = new Subject<void>();
  private iReadHouseMessageSubjec = new Subject<void>();
  private iReadUserMessageSubjec = new Subject<void>();

  update$ = this.updateSubject.asObservable();
  updateUser$ = this.updateSubjectUser.asObservable();
  iReadHouseMessage$ = this.iReadHouseMessageSubjec.asObservable();
  iReadUserMessage$ = this.iReadUserMessageSubjec.asObservable();

  triggerUpdate() {
    this.updateSubject.next();
  }

  triggerUpdateUser() {
    this.updateSubjectUser.next();
  }

  iReadHouseMessage() {
    // console.log('iReadHouseMessage')
    this.iReadHouseMessageSubjec.next();
  }

  iReadUserMessage() {
    // console.log('iReadUserMessage')
    this.iReadUserMessageSubjec.next();
  }
}
