import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChangeMonthService {
  private selectedMonthSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedMonth$: Observable<string> = this.selectedMonthSubject.asObservable();

  constructor() {
    const storedMonth = localStorage.getItem('selectedMonth');
    if (storedMonth) {
      this.selectedMonthSubject.next(storedMonth);
    }
  }

  setSelectedMonth(selectedMonth: string): void {
    this.selectedMonthSubject.next(selectedMonth);
    localStorage.setItem('selectedMonth', selectedMonth);
  }
}
