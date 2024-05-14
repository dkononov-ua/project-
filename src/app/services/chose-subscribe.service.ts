import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CounterService } from './counter.service';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribeService {
  private chosenFlatIdSubject = new BehaviorSubject<string | null>(null);
  public selectedFlatId$ = this.chosenFlatIdSubject.asObservable();
  selectedFlat: { flat_id: any; flatImg: any; price_m: any; } | undefined;
  selectedFlatId: string | null = null;

  constructor(
    private counterService: CounterService,
  ) { }

  async setChosenFlatId(flatId: string) {
    // console.log(flatId)
    this.chosenFlatIdSubject.next(flatId);
    setTimeout(async () => {
      await this.counterService.getUserNewMessage();
    }, 500);
  }
  
}
