import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // Відслідковування зміни шляху до серверу
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() { }

  // Встановлюю статус лоадеру та передаю його в інші компоненти
  setLoading(status: boolean) {
    // console.log('setLoading', status);
    if (status === true) {
      this.loadingSubject.next(true);
    } else {
      this.loadingSubject.next(false);
    }
  }

}
