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
  agreementIds: any = [];
  houseConcludedAgree: any = [];


  // Лічильники оселі
  private counterHouseSubscribersSubject = new BehaviorSubject<string>('');
  private counterHouseSubscriptionsSubject = new BehaviorSubject<string>('');
  private counterHouseDiscussioSubject = new BehaviorSubject<string>('');
  private counterHouseNewMessageSubject = new BehaviorSubject<string>('');

  // Лічильники оселі надіслані угоди
  private counterHouseSendAgreeSubject = new BehaviorSubject<string>('');
  private houseSendAgreeSubject = new BehaviorSubject<any>([]);

  private counterHouseConcludedAgreeSubject = new BehaviorSubject<string>('');
  private houseConcludedAgreeSubject = new BehaviorSubject<any[]>([]);


  private houseConcludedAgreeIdsSubject = new BehaviorSubject<any>([]);
  private actExistsArraySubject = new BehaviorSubject<any[]>([]);

  // Лічильники користувача
  private counterUserSubscribersSubject = new BehaviorSubject<string>('');
  private counterUserSubscriptionsSubject = new BehaviorSubject<string>('');
  private counterUserDiscussioSubject = new BehaviorSubject<string>('');
  private counterUserNewMessageSubject = new BehaviorSubject<string>('');

  // Властивості оселі для отримання потоків даних
  // Система підписок
  counterHouseSubscribers$ = this.counterHouseSubscribersSubject.asObservable();
  counterHouseSubscriptions$ = this.counterHouseSubscriptionsSubject.asObservable();
  counterHouseDiscussio$ = this.counterHouseDiscussioSubject.asObservable();
  // Повідомлення
  counterHouseNewMessage$ = this.counterHouseNewMessageSubject.asObservable();
  // Угоди
  counterHouseSendAgree$ = this.counterHouseSendAgreeSubject.asObservable();
  houseSendAgree$ = this.houseSendAgreeSubject.asObservable();
  counterHouseConcludedAgree$ = this.counterHouseConcludedAgreeSubject.asObservable();
  houseConcludedAgree$ = this.houseConcludedAgreeSubject.asObservable();
  houseConcludedAgreeIds$ = this.houseConcludedAgreeIdsSubject.asObservable();
  actExistsArray$ = this.actExistsArraySubject.asObservable();
  // ***********
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
    // console.log(data)
    try {
      const counterHouseSubscribers: any = await this.http.post(this.serverPath + '/subs/get/countSubs', data).toPromise();
      // console.log(counterHouseSubscribers)
      if (counterHouseSubscribers.status !== 'Авторизуйтесь') {
        this.counterHouseSubscribersSubject.next(counterHouseSubscribers.status);
        // console.log('Запит на сервер Підписники оселі', counterHouseSubscribers)
        localStorage.setItem('counterHouseSubscribers', JSON.stringify(counterHouseSubscribers.status));
      } else {
        this.counterHouseSubscribersSubject.next('0');
        localStorage.removeItem('counterHouseSubscribers');
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
      // console.log(counterHouseSubscriptions)
      if (counterHouseSubscriptions.status !== 'Авторизуйтесь') {
        // console.log('Запит на сервер Підписки оселі', counterHouseSubscriptions)
        this.counterHouseSubscriptionsSubject.next(counterHouseSubscriptions.status);
        localStorage.setItem('counterHouseSubscriptions', JSON.stringify(counterHouseSubscriptions.status));
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
        this.counterHouseDiscussioSubject.next(counterHouseDiscussio.status);
        // console.log('Запит на сервер Дискусії оселі', counterHouseDiscussio)
        localStorage.setItem('counterHouseDiscussio', JSON.stringify(counterHouseDiscussio.status));
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

  // Надіслані угоди оселі
  async getHouseSendAgree(selectedFlatId: any, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, offs: offs, };
    try {
      const counterHouseSendAgree: any = await this.http.post(this.serverPath + '/agreement/get/agreements', data).toPromise();
      // console.log(counterHouseSendAgree)
      if (counterHouseSendAgree) {
        this.counterHouseSendAgreeSubject.next(counterHouseSendAgree.length);
        this.houseSendAgreeSubject.next(counterHouseSendAgree);
        // console.log('Запит на сервер, кількість надісланих угод оселі', counterHouseSendAgree.length)
        localStorage.setItem('counterHouseSendAgree', JSON.stringify(counterHouseSendAgree.length));
        localStorage.setItem('houseSendAgreeSubject', JSON.stringify(counterHouseSendAgree));
      } else {
        this.counterUserDiscussioSubject.next('0');
        localStorage.removeItem('counterHouseSendAgree');
      }
    }
    catch (error) { console.error(error) }
  }

  // Ухвалені угоди оселі
  async getHouseConcludedAgree(selectedFlatId: any, offs: number): Promise<void> {
    const userJson = localStorage.getItem('user');
    const data = { auth: JSON.parse(userJson!), flat_id: selectedFlatId, offs: offs, };
    try {
      const houseConcludedAgree: any = await this.http.post(this.serverPath + '/agreement/get/saveagreements', data).toPromise();
      // console.log(houseConcludedAgree)
      if (houseConcludedAgree) {
        const agreement = houseConcludedAgree.map((item: { flat: { agreement_id: any; }; }) => item.flat.agreement_id);
        this.agreementIds = agreement;
        this.houseConcludedAgree = houseConcludedAgree;
        if (this.agreementIds) {
          this.getActAgree(selectedFlatId, offs);
        }
        this.counterHouseConcludedAgreeSubject.next(houseConcludedAgree.length);
        this.houseConcludedAgreeIdsSubject.next(this.agreementIds);
        this.houseConcludedAgreeSubject.next(this.houseConcludedAgree);
        // console.log('Запит на сервер, кількість надісланих угод оселі', counterHouseConcludedAgree.length)
        localStorage.setItem('counterHouseConcludedAgree', JSON.stringify(houseConcludedAgree.length));
        localStorage.setItem('houseConcludedAgreeIds', JSON.stringify(this.agreementIds));
        localStorage.setItem('houseConcludedAgree', JSON.stringify(this.houseConcludedAgree));
      } else {
        this.counterUserDiscussioSubject.next('0');
        this.houseConcludedAgreeIdsSubject.next([]);
        localStorage.removeItem('counterHouseConcludedAgree');
      }

    }
    catch (error) { console.error(error) }
  }

  // Перевіряємо чи сформовані акти передачі оселі по ухваленим угодам
  async getActAgree(selectedFlatId: any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const houseCheckedAgreements = [];

    if (userJson && this.agreementIds) {
      try {
        // Проміжний масив для зберігання обіцянок (Promise)
        const promises = this.agreementIds.map(async (agreementId: any) => {
          const data = {
            auth: JSON.parse(userJson!),
            flat_id: selectedFlatId,
            agreement_id: agreementId,
            offs
          };

          // Виконуємо запит для кожного agreement_id
          const response = await this.http.post(this.serverPath + '/agreement/get/act', data).toPromise() as any[];

          // Знаходимо відповідний об'єкт угоди
          const agreement = this.houseConcludedAgree.find((agreement: { flat: { agreement_id: any; }; }) => agreement.flat.agreement_id === agreementId);

          // Формуємо новий об'єкт з угоди та результату перевірки акту
          const houseCheckedAgreement = {
            ...agreement,
            actExists: response.length > 0
          };

          // Повертаємо сформований об'єкт
          return houseCheckedAgreement;
        });
        // Очікуємо завершення всіх запитів
        const results = await Promise.all(promises);
        // Оновлюємо масив houseCheckedAgreements
        houseCheckedAgreements.push(...results);
        // Відправляємо дані після обробки всіх угод
        this.actExistsArraySubject.next(houseCheckedAgreements);
        localStorage.setItem('actExistsArray', JSON.stringify(houseCheckedAgreements));
      } catch (error) {
        console.error(error);
        // У разі помилки скидаємо subject і видаляємо значення з localStorage
        this.actExistsArraySubject.next([]);
        localStorage.removeItem('actExistsArray');
      }
    }
  }




}
