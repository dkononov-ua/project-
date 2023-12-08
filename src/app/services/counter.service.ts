import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { serverPath } from 'src/app/config/server-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CounterService {
  private serverPath = serverPath;
  // Лічильники оселі
  private counterHouseSubscribersSubject = new BehaviorSubject<any[]>([]);
  private counterHouseSubscriptionsSubject = new BehaviorSubject<any[]>([]);
  private counterHouseDiscussioSubject = new BehaviorSubject<any[]>([]);
  private counterHouseNewMessageSubject = new BehaviorSubject<any[]>([]);

  // Лічильники користувача
  private counterUserSubscribersSubject = new BehaviorSubject<any[]>([]);
  private counterUserSubscriptionsSubject = new BehaviorSubject<any[]>([]);
  private counterUserDiscussioSubject = new BehaviorSubject<any[]>([]);
  private counterUserNewMessageSubject = new BehaviorSubject<any[]>([]);

  // Властивості оселі для отримання потоків даних
  counterHouseSubscribers$ = this.counterHouseSubscribersSubject.asObservable();
  counterHouseSubscriptions$ = this.counterHouseSubscriptionsSubject.asObservable();
  counterHouseDiscussio$ = this.counterHouseDiscussioSubject.asObservable();
  counterHouseNewMessage$ = this.counterHouseNewMessageSubject.asObservable();
  // Властивості користувача для отримання потоків даних
  counterUserSubscribers$ = this.counterUserSubscribersSubject.asObservable();
  counterUserSubscriptions$ = this.counterUserSubscriptionsSubject.asObservable();
  counterUserDiscussio$ = this.counterUserDiscussioSubject.asObservable();
  counterUserNewMessage$ = this.counterUserNewMessageSubject.asObservable();
  constructor(private http: HttpClient,) { }

  // Підписники оселі
  async getHouseSubscribersCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseSubscribers = await this.http.post(serverPath + '/subs/get/countSubs', data).toPromise() as any[];
      this.counterHouseSubscribersSubject.next(counterHouseSubscribers);
      // console.log('Запит на сервер Підписники оселі', counterHouseSubscribers)
      localStorage.setItem('counterHouseSubscriptions', JSON.stringify(counterHouseSubscribers));
    }
    catch (error) { console.error(error) }
  }

  // Підписки оселі
  async getHouseSubscriptionsCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseSubscriptions = await this.http.post(serverPath + '/usersubs/get/CountUserSubs', data).toPromise() as any[];
      // console.log('Запит на сервер Підписки оселі', counterHouseSubscriptions)
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
      // console.log('Запит на сервер Дискусії оселі', counterHouseDiscussio)
      localStorage.setItem('counterHouseDiscussio', JSON.stringify(counterHouseDiscussio));
    }
    catch (error) { console.error(error) }
  }

  // Підписники користувача
  async getUserSubscribersCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserSubscribers = await this.http.post(serverPath + '/usersubs/get/CountYUserSubs', data).toPromise() as any[];
      this.counterUserSubscribersSubject.next(counterUserSubscribers);
      // console.log('Запит на сервер Підписники користувача', counterUserSubscribers)
      localStorage.setItem('counterUserSubscribers', JSON.stringify(counterUserSubscribers));
    }
    catch (error) { console.error(error) }
  }

  // Підписки користувача
  async getUserSubscriptionsCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserSubscriptions = await this.http.post(serverPath + '/subs/get/countYSubs', data).toPromise() as any[];
      // console.log('Запит на сервер Підписки користувача', counterUserSubscriptions)
      this.counterUserSubscriptionsSubject.next(counterUserSubscriptions);
      localStorage.setItem('counterUserSubscriptions', JSON.stringify(counterUserSubscriptions));
    }
    catch (error) { console.error(error) }
  }

  // Дискусії користувача
  async getUserDiscussioCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserDiscussio = await this.http.post(serverPath + '/acceptsubs/get/CountYsubs', data).toPromise() as any[];
      this.counterUserDiscussioSubject.next(counterUserDiscussio);
      // console.log('Запит на сервер Дискусії користувача', counterUserDiscussio)
      localStorage.setItem('counterUserDiscussio', JSON.stringify(counterUserDiscussio));
    }
    catch (error) { console.error(error) }
  }

  // Перевірка на нові повідомлення оселі
  async getHouseNewMessage(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseNewMessage = await this.http.post(serverPath + '/chat/get/DontReadMessageFlat', data).toPromise() as any[];
      this.counterHouseNewMessageSubject.next(counterHouseNewMessage);
      // console.log('Запит на сервер Повідомлень оселі', counterHouseNewMessage)
      localStorage.setItem('counterHouseNewMessage', JSON.stringify(counterHouseNewMessage));
    }
    catch (error) { console.error(error) }
  }

    // Перевірка на нові повідомлення оселі
    async getUserNewMessage() {
      const userJson = localStorage.getItem('user')
      const data = { auth: JSON.parse(userJson!) };
      try {
        const counterUserNewMessage = await this.http.post(serverPath + '/chat/get/DontReadMessageUser', data).toPromise() as any[];
        this.counterUserNewMessageSubject.next(counterUserNewMessage);
        // console.log('Запит на сервер Повідомлень оселі', counterUserNewMessage)
        localStorage.setItem('counterUserNewMessage', JSON.stringify(counterUserNewMessage));
      }
      catch (error) { console.error(error) }
    }


}
