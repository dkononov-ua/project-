import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class CounterService {
  serverPath: string = '';
  // Лічильники оселі
  private counterHouseSubscribersSubject = new BehaviorSubject<string>('');
  private counterHouseSubscriptionsSubject = new BehaviorSubject<string>('');
  private counterHouseDiscussioSubject = new BehaviorSubject<string>('');
  private counterHouseNewMessageSubject = new BehaviorSubject<string>('');

  // Лічильники користувача
  private counterUserSubscribersSubject = new BehaviorSubject<string>('');
  private counterUserSubscriptionsSubject = new BehaviorSubject<string>('');
  private counterUserDiscussioSubject = new BehaviorSubject<string>('');
  private counterUserNewMessageSubject = new BehaviorSubject<string>('');

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
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  // Підписники оселі
  async getHouseSubscribersCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseSubscribers: any = await this.http.post(this.serverPath + '/subs/get/countSubs', data).toPromise();
      if (counterHouseSubscribers.status !== 'Авторизуйтесь') {
        this.counterHouseSubscribersSubject.next(counterHouseSubscribers);
        // console.log('Запит на сервер Підписники оселі', counterHouseSubscribers)
        localStorage.setItem('counterHouseSubscriptions', JSON.stringify(counterHouseSubscribers));
      } else {
        this.counterHouseSubscribersSubject.next('0');
        localStorage.removeItem('counterHouseSubscriptions');
      }
    }
    catch (error) { console.error(error) }
  }

  // Підписки оселі
  async getHouseSubscriptionsCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseSubscriptions: any = await this.http.post(this.serverPath + '/usersubs/get/CountUserSubs', data).toPromise();
      if (counterHouseSubscriptions.status !== 'Авторизуйтесь') {
        // console.log('Запит на сервер Підписки оселі', counterHouseSubscriptions)
        this.counterHouseSubscriptionsSubject.next(counterHouseSubscriptions);
        localStorage.setItem('counterHouseSubscriptions', JSON.stringify(counterHouseSubscriptions));
      } else {
        this.counterHouseSubscriptionsSubject.next('0');
        localStorage.removeItem('counterHouseSubscriptions');
      }
    }
    catch (error) { console.error(error) }
  }

  // Дискусії оселі
  async getHouseDiscussioCount(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseDiscussio: any = await this.http.post(this.serverPath + '/acceptsubs/get/CountSubs', data).toPromise();
      if (counterHouseDiscussio.status !== 'Авторизуйтесь') {
        this.counterHouseDiscussioSubject.next(counterHouseDiscussio);
        // console.log('Запит на сервер Дискусії оселі', counterHouseDiscussio)
        localStorage.setItem('counterHouseDiscussio', JSON.stringify(counterHouseDiscussio));
      } else {
        this.counterHouseDiscussioSubject.next('0');
        localStorage.removeItem('counterHouseDiscussio');
      }
    }
    catch (error) { console.error(error) }
  }

  // Підписники користувача
  async getUserSubscribersCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserSubscribers: any = await this.http.post(this.serverPath + '/usersubs/get/CountYUserSubs', data).toPromise();
      if (counterUserSubscribers.status !== 'Авторизуйтесь') {
        this.counterUserSubscribersSubject.next(counterUserSubscribers.status);
        // console.log('Запит на сервер Підписники користувача', counterUserSubscribers)
        localStorage.setItem('counterUserSubscribers', JSON.stringify(counterUserSubscribers.status));
      } else {
        this.counterUserSubscribersSubject.next('0');
        localStorage.removeItem('counterUserSubscribers');
      }
    }
    catch (error) { console.error(error) }
  }

  // Підписки користувача
  async getUserSubscriptionsCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserSubscriptions: any = await this.http.post(this.serverPath + '/subs/get/countYSubs', data).toPromise();
      if (counterUserSubscriptions.status !== 'Авторизуйтесь') {
        // console.log('Запит на сервер Підписки користувача', counterUserSubscriptions)
        this.counterUserSubscriptionsSubject.next(counterUserSubscriptions.status);
        localStorage.setItem('counterUserSubscriptions', JSON.stringify(counterUserSubscriptions.status));
      } else {
        this.counterUserSubscriptionsSubject.next('0');
        localStorage.removeItem('counterUserSubscriptions');
      }

    }
    catch (error) { console.error(error) }
  }

  // Дискусії користувача
  async getUserDiscussioCount() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserDiscussio: any = await this.http.post(this.serverPath + '/acceptsubs/get/CountYsubs', data).toPromise();
      // console.log(counterUserDiscussio)
      if (counterUserDiscussio.status !== 'Авторизуйтесь') {
        this.counterUserDiscussioSubject.next(counterUserDiscussio.status);
        // console.log('Запит на сервер Дискусії користувача', counterUserDiscussio)
        localStorage.setItem('counterUserDiscussio', JSON.stringify(counterUserDiscussio.status));
      } else {
        this.counterUserDiscussioSubject.next('0');
        localStorage.removeItem('counterUserDiscussio');
      }
    }
    catch (error) { console.error(error) }
  }

  // Перевірка на нові повідомлення оселі
  async getHouseNewMessage(selectedFlatId: any) {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, };
    try {
      const counterHouseNewMessage: any = await this.http.post(this.serverPath + '/chat/get/DontReadMessageFlat', data).toPromise();
      // console.log(counterHouseNewMessage)
      if (counterHouseNewMessage.status !== 'Авторизуйтесь') {
        this.counterHouseNewMessageSubject.next(counterHouseNewMessage);
        // console.log('Запит на сервер Повідомлень оселі', counterHouseNewMessage)
        localStorage.setItem('counterHouseNewMessage', JSON.stringify(counterHouseNewMessage));
      } else {
        this.counterHouseNewMessageSubject.next('0');
        localStorage.removeItem('counterHouseNewMessage');
      }
    }
    catch (error) { console.error(error) }
  }

  // Перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    const userJson = localStorage.getItem('user')
    const data = { auth: JSON.parse(userJson!) };
    try {
      const counterUserNewMessage: any = await this.http.post(this.serverPath + '/chat/get/DontReadMessageUser', data).toPromise();
      // console.log(counterUserNewMessage)
      if (counterUserNewMessage.status !== 'Авторизуйтесь') {
        this.counterUserNewMessageSubject.next(counterUserNewMessage);
        // console.log('Запит на сервер Повідомлень оселі', counterUserNewMessage)
        localStorage.setItem('counterUserNewMessage', JSON.stringify(counterUserNewMessage));
      } else {
        this.counterUserNewMessageSubject.next('0');
        localStorage.removeItem('counterUserNewMessage');
      }
    }
    catch (error) { console.error(error) }
  }
}
