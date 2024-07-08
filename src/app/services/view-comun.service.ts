import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewComunService {

  private selectedViewSubject = new BehaviorSubject<string | null>(null);
  public selectedView$ = this.selectedViewSubject.asObservable();

  private selectedNameSubject = new BehaviorSubject<string | null>(null);
  public selectedName$ = this.selectedNameSubject.asObservable();

  constructor() {
    const storedViewComun = localStorage.getItem('storedViewComun');
    if (storedViewComun) {
      this.selectedViewSubject.next(storedViewComun);
    }
  }

  getSelectedView(): string | null {
    return this.selectedViewSubject.value;
  }

  getSelectedName(): string | null {
    return this.selectedNameSubject.value;
  }

  setSelectedView(ViewComun: string): void {
    // console.log(ViewComun)
    localStorage.removeItem('selectedView');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('house');
    localStorage.removeItem('selectedComun');
    localStorage.setItem('selectedView', ViewComun);
    this.selectedViewSubject.next(ViewComun);
  }

  setSelectedName(Name: string): void {
    // console.log(Name)
    localStorage.removeItem('selectedView');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('house');
    localStorage.removeItem('selectedComun');
    localStorage.setItem('selectedName', Name);
    this.selectedNameSubject.next(Name);
  }

  clearSelectedView(): void {
    localStorage.removeItem('selectedView');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('house');
    localStorage.removeItem('selectedComun');
    this.selectedViewSubject.next(null);
  }

  clearSelectedName(): void {
    localStorage.removeItem('selectedName');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('house');
    localStorage.removeItem('selectedComun');
    this.selectedNameSubject.next(null);
  }
}
