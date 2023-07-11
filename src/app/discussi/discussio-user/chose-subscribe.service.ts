import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribeService {
  private selectedFlatIdSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatId$ = this.selectedFlatIdSubject.asObservable();
  selectedFlat: { flat_id: any; flatImg: any; price_m: any; } | undefined;
  selectedFlatId: string | null = null;

  get chosenFlatId(): string | null {
    return this.selectedFlatIdSubject.value;
    console.log(this.selectedFlatIdSubject.value)

  }

  set chosenFlatId(flatId: string | null) {
    this.selectedFlatIdSubject.next(flatId);
    console.log(flatId)

  }

  setSelectedFlatId(flatId: string) {
    this.selectedFlatIdSubject.next(flatId);
    console.log(flatId)
  }
}
