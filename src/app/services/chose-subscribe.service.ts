import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CounterService } from './counter.service';

@Injectable({
  providedIn: 'root'
})
export class ChoseSubscribeService {
  private chosenFlatIdSubject = new BehaviorSubject<any>(undefined);
  public selectedFlatId$ = this.chosenFlatIdSubject.asObservable();
  selectedFlat: { flat_id: any; flatImg: any; price_m: any; } | undefined;
  selectedFlatId: string | null = null;

  private indexPageSubject = new BehaviorSubject<number>(1);
  public indexPage$ = this.indexPageSubject.asObservable();

  constructor(
    private counterService: CounterService,
  ) { }

  setIndexPage(indexPage: number) {
    this.indexPageSubject.next(indexPage);
  }

  async setChosenFlatId(flatId: string) {
    this.chosenFlatIdSubject.next(flatId);
    setTimeout(async () => {
      await this.counterService.getUserNewMessage();
    }, 500);
  }

  removeChosenFlatId() {
    // console.log('removeChosenFlatId')
    this.chosenFlatIdSubject.next(undefined);
  }
}
