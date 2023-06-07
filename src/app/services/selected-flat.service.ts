import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedFlatService {
  private selectedFlatIdSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatId$ = this.selectedFlatIdSubject.asObservable();

  getSelectedFlatId(): string | null {
    console.log(this.selectedFlatIdSubject.value)
    return this.selectedFlatIdSubject.value;
  }

  setSelectedFlatId(flatId: string): void {
    console.log(flatId)

    this.selectedFlatIdSubject.next(flatId);
  }
}
