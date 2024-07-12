import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private statusMessageSubject = new BehaviorSubject<string>('');
  public statusMessage$ = this.statusMessageSubject.asObservable();
  private timer: any = null;

  constructor() { }

  setStatusMessage(message: string): void {
    // console.log(message);
    this.statusMessageSubject.next(message);
    if (message) {
      // Скасовуємо попередній таймер, якщо він існує
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // Встановлюємо новий таймер
      this.timer = setTimeout(() => {
        this.statusMessageSubject.next('');
        this.timer = null; // Скидаємо таймер після його завершення
      }, 3000);
    }
  }
}
