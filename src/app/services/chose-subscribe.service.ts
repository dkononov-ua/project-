import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribeService {
  private chosenFlatIdSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatId$ = this.chosenFlatIdSubject.asObservable();
  selectedFlat: { flat_id: any; flatImg: any; price_m: any; } | undefined;
  selectedFlatId: string | null = null;

  setChosenFlatId(flatId: string) {
    this.chosenFlatIdSubject.next(flatId);
  }
}
