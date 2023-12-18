import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeComunService {
  private selectedComunSubject = new BehaviorSubject<string | null>(null);
  public selectedComun$ = this.selectedComunSubject.asObservable();

  constructor() {
    const storedComun = localStorage.getItem('selectedComun');
    if (storedComun) {
      this.selectedComunSubject.next(storedComun);
    }
  }

  getSelectedComun(): string | null {
    return this.selectedComunSubject.value;
  }

  setSelectedComun(comun: string): void {
    console.log(comun)
    localStorage.setItem('selectedComun', comun);
    this.selectedComunSubject.next(comun);
  }

  clearSelectedComun(): void {
    localStorage.removeItem('selectedComun');
    this.selectedComunSubject.next(null);
  }
}
