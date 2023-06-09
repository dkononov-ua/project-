import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedFlatService {
  private selectedFlatIdSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatId$ = this.selectedFlatIdSubject.asObservable();

  constructor() {
    const storedFlatId = localStorage.getItem('selectedFlatId');
    if (storedFlatId) {
      this.selectedFlatIdSubject.next(storedFlatId);
    }
  }

  getSelectedFlatId(): string | null {
    return this.selectedFlatIdSubject.value;
  }

  setSelectedFlatId(flatId: string): void {
    localStorage.setItem('selectedFlatId', flatId);
    this.selectedFlatIdSubject.next(flatId);
  }
}
