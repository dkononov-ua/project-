import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedFlatService {
  private selectedFlatIdSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatId$ = this.selectedFlatIdSubject.asObservable();

  private selectedFlatNameSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatName$ = this.selectedFlatNameSubject.asObservable();

  constructor() {
    const storedFlatId = localStorage.getItem('selectedFlatId');
    if (storedFlatId) {
      this.selectedFlatIdSubject.next(storedFlatId);
    }

    const storedFlatName = localStorage.getItem('selectedFlatName');
    if (storedFlatName) {
      this.selectedFlatNameSubject.next(storedFlatName);
    }
  }

  getSelectedFlatId(): string | null {
    return this.selectedFlatIdSubject.value;
  }

  getSelectedFlatName(): string | null {
    return this.selectedFlatNameSubject.value;
  }

  setSelectedFlatId(flatId: string): void {
    if (this.selectedFlatIdSubject.value !== flatId) {
      localStorage.setItem('selectedFlatId', flatId);
      this.selectedFlatIdSubject.next(flatId);
    }
  }

  setSelectedFlatName(flatName: string): void {
    if (this.selectedFlatNameSubject.value !== flatName) {
      localStorage.setItem('selectedFlatName', flatName);
      this.selectedFlatNameSubject.next(flatName);
    }
  }

  // при видаленні оселі очищаємо selectedFlatId
  clearSelectedFlatId(): void {
    localStorage.removeItem('selectedFlatId');
    this.selectedFlatIdSubject.next(null);
  }

    // при видаленні оселі очищаємо selectedFlatId
    clearSelectedFlatName(): void {
      localStorage.removeItem('selectedFlatName');
      this.selectedFlatNameSubject.next(null);
    }
}
