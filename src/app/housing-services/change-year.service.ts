import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChangeYearService {
  private selectedYearSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public selectedYear$: Observable<number> = this.selectedYearSubject.asObservable();

  constructor() {
    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      this.selectedYearSubject.next(Number(storedYear));
    }
  }

  setSelectedYear(selectedYear: number): void {
    this.selectedYearSubject.next(selectedYear);
  }
}
