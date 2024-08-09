import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChangeYearService {
  private selectedYearSubject: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  public selectedYear$: Observable<string> = this.selectedYearSubject.asObservable();

  constructor() {
    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      this.selectedYearSubject.next(storedYear);
    }
  }

  setSelectedYear(selectedYear: string): void {
    this.selectedYearSubject.next(selectedYear);
  }
}
