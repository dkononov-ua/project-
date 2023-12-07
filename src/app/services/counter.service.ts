import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { serverPath } from 'src/app/config/server-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CounterService {
  private serverPath = serverPath;
  selectedFlatId: any | null;
  private houseSubsCountRequested = false;
  // Лічильники оселі
  private counterHouseSubscribersSubject = new BehaviorSubject<any[]>([]);
  private counterHouseSubscriptionsSubject = new BehaviorSubject<any[]>([]);
  private counterHouseDiscussioSubject = new BehaviorSubject<any[]>([]);

  // Властивості оселі для отримання потоків даних
  counterHouseSubscribers$ = this.counterHouseSubscribersSubject.asObservable();
  counterHouseSubscriptions$ = this.counterHouseSubscriptionsSubject.asObservable();
  counterHouseDiscussio$ = this.counterHouseDiscussioSubject.asObservable();

  constructor(private http: HttpClient,) { }

  // Підписники/Підписки/Дискусії оселі
  async getHouseSubsCount(selectedFlatId: any) {
    if (!this.houseSubsCountRequested) {
      this.houseSubsCountRequested = true;
      const userJson = localStorage.getItem('user');
      const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId };

      try {
        const requests = [
          this.http.post(serverPath + '/subs/get/countSubs', data).toPromise(),
          this.http.post(serverPath + '/usersubs/get/CountUserSubs', data).toPromise(),
          this.http.post(serverPath + '/acceptsubs/get/CountSubs', data).toPromise(),
        ];

        const [
          counterHouseSubscribers,
          counterHouseSubscriptions,
          counterHouseDiscussio
        ]: any[] = await Promise.all(requests);

        if (counterHouseSubscribers) {
          this.counterHouseSubscribersSubject.next(counterHouseSubscribers);
          localStorage.setItem('counterHouseSubscribers', JSON.stringify(counterHouseSubscribers));
        }

        if (counterHouseSubscriptions) {
          this.counterHouseSubscriptionsSubject.next(counterHouseSubscriptions);
          localStorage.setItem('counterHouseSubscriptions', JSON.stringify(counterHouseSubscriptions));
        }

        if (counterHouseDiscussio) {
          this.counterHouseDiscussioSubject.next(counterHouseDiscussio);
          localStorage.setItem('counterHouseDiscussio', JSON.stringify(counterHouseDiscussio));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }



  // Підписки оселі
  async getHouseSubscriptionsCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseSubscriptions = await this.http.post(serverPath + '/usersubs/get/CountUserSubs', data).toPromise() as any[];
      this.counterHouseSubscriptionsSubject.next(counterHouseSubscriptions);
      localStorage.setItem('counterHouseSubscriptions', JSON.stringify(counterHouseSubscriptions));
    }
    catch (error) { console.error(error) }
  }

  // Дискусії оселі
  async getHouseDiscussioCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseDiscussio = await this.http.post(serverPath + '/acceptsubs/get/CountSubs', data).toPromise() as any[];
      this.counterHouseDiscussioSubject.next(counterHouseDiscussio);
      localStorage.setItem('counterHouseDiscussio', JSON.stringify(counterHouseDiscussio));
    }
    catch (error) { console.error(error) }
  }

}
