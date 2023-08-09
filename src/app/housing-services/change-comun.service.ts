import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeComunService {
  private selectedComunSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedComun$: Observable<string> = this.selectedComunSubject.asObservable();

  constructor() {
    const storedComun = localStorage.getItem('selectedComun');
    if (storedComun) {
      this.selectedComunSubject.next(storedComun);
    }
    console.log('ChangeComunService created. Stored comunal:', storedComun);
  }

  setSelectedComun(selectedComun: string): void {
    this.selectedComunSubject.next(selectedComun);
    localStorage.setItem('selectedComun', selectedComun);
    console.log('Selected comunal updated:', selectedComun);
  }
}
