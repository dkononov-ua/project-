import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { ChoseSubscribeService } from '../services/chose-subscribe.service';

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***


  private messageTextSubject = new BehaviorSubject<string>('');
  public messageText$ = this.messageTextSubject.asObservable();

  private messageTextUserSubject = new BehaviorSubject<string>('');
  public messageTextUser$ = this.messageTextUserSubject.asObservable();
  userData: any;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private choseSubscribeService: ChoseSubscribeService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  sendMessage(messageText: string, selectedFlatId: string, selectedSubscriberID: string): Observable<any> {
    const userJson = localStorage.getItem('user');
    this.messageTextSubject.next(messageText);
    if (userJson && selectedFlatId && selectedSubscriberID) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlatId,
        user_id: selectedSubscriberID,
        message: messageText,
      };
      return this.http.post(this.serverPath + '/chat/sendMessageFlat', data)
        .pipe(
          catchError((error: any) => {
            console.error(error);
            return throwError("Ваше повідомлення не надіслано");
          })
        );
    } else {
      return throwError("Ваше повідомлення не надіслано. Не вистачає даних.");
    }
  }

  // автоматична відправка повідомлень від оселі
  // sendMessageAndCheck(messageText: string, selectedFlatId: string): void {
  //   const userJson = localStorage.getItem('user');
  //   if (userJson) {
  //     const userData = localStorage.getItem('userData');
  //     if (userData) {
  //       this.userData = JSON.parse(userData);
  //       console.log(this.userData)
  //       this.sendMessage(messageText, selectedFlatId, this.userData.inf.user_id)
  //         .subscribe(
  //           (response) => {
  //             console.log('Повідомлення надіслано:', response);
  //             // Тут ви можете додати додаткову логіку для обробки успішного надсилання повідомлення
  //           },
  //           (error) => {
  //             console.error('Помилка при надсиланні повідомлення:', error);
  //             // Тут ви можете додати додаткову логіку для обробки помилки надсилання повідомлення
  //           }
  //         );
  //     } else {
  //       console.log('Інформація користувача відсутня')
  //     }
  //   }
  // }


  sendMessageUser(messageText: string, selectedFlatId: string): Observable<any> {
    console.log(messageText, selectedFlatId)
    const userJson = localStorage.getItem('user');
    this.messageTextUserSubject.next(messageText);
    if (userJson && selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlatId,
        message: messageText,
      };
      return this.http.post(this.serverPath + '/chat/sendMessageUser', data)
        .pipe(
          catchError((error: any) => {
            console.error(error);
            return throwError("Ваше повідомлення не надіслано");
          })
        );
    } else {
      return throwError("Ваше повідомлення не надіслано. Не вистачає даних.");
    }
  }

  // Перевірка на існування чату
  async checkChatExistence(choseFlatId: any): Promise<boolean> {
    const userJson = localStorage.getItem('user');
    if (userJson && choseFlatId) {
      const data = { auth: JSON.parse(userJson), flat_id: choseFlatId, offs: 0 };
      try {
        const response = await this.http.post(this.serverPath + '/chat/get/userchats', data).toPromise() as any;
        if (choseFlatId && Array.isArray(response.status)) {
          const chatExists = response.status.some((chat: { flat_id: any }) => chat.flat_id === choseFlatId);
          return chatExists;
        } else {
          // console.log('чат не існує');
          return false;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      console.log('Авторизуйтесь');
      throw new Error('User not authenticated or flat ID not provided');
    }
  }

  // Створюю чат з підтримкою Діскусіо
  async createChat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson), flat_id: 1, };
      try {
        const response: any = await this.http.post(this.serverPath + '/chat/add/chatUser', data).toPromise();
        // console.log(response)
        if (response.status === true) {
          // const messageText = 'Вітаємо! Це підтримка користувачів Discussio! Якщо у вас виникли якісь складнощі чи питання ми вам допоможемо!';
          // Відправляю повідомлення від Підтримки Діскусіо
          // this.sendMessageAndCheck(messageText, '1');
          this.sharedService.setStatusMessage('Створюємо чат');
          setTimeout(async () => {
            const result = await this.getFlatChats();
            if (result === 1) {
              setTimeout(() => {
                this.openChat();
              }, 2000);
            } else if (result === 0) {
              this.sharedService.setStatusMessage('Не вдалось завантажити чат');
              setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
            }
          }, 1000);
        } else {
          this.sharedService.setStatusMessage('Чат не створився, повторіть спробу');
          setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Якась біда на сервері');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Відкриваю чат з підтримкою Діскусіо
  async openChat(): Promise<any> {
    try {
      this.sharedService.setStatusMessage('Завантажуємо чат...');
      const result = await this.getFlatChats();
      if (result === 1) {
        this.sharedService.setStatusMessage('Discussio підтримка');
        setTimeout(() => {
          this.choseSubscribeService.setChosenFlatId('1');
          this.sharedService.setStatusMessage('');
          this.router.navigate(['/chat-user']);
        }, 1000);
      } else if (result === 0) {
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 1000);
      }
    } catch (error) {
      console.error('Помилка при завантаженні чату:', error);
      this.sharedService.setStatusMessage('Помилка на сервері, спробуйте пізніше');
      setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
    }
  }

  async getFlatChats(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson), offs: 0 };
      const response: any = await this.http.post(this.serverPath + '/chat/get/userchats', data).toPromise();
      // console.log(response)
      if (Array.isArray(response.status) && response.status) {
        let allChatsInfo = await Promise.all(response.status.map(async (value: any) => {
          let infUser = await this.http.post(this.serverPath + '/userinfo/public', { auth: JSON.parse(userJson), user_id: value.user_id }).toPromise() as any[];
          let infFlat = await this.http.post(this.serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
          return { flat_id: value.flat_id, user_id: value.user_id, chat_id: value.chat_id, flat_name: value.flat_name, infUser: infUser, infFlat: infFlat, unread: value.unread, lastMessage: value.last_message };
        }));
        localStorage.setItem('userChats', JSON.stringify(allChatsInfo));
        // this.chats = allChatsInfo;
        return 1;
      } else {
        return 0;
      }
    } else {
      console.log('Нічого не знайдено');
    };
  }

  // Створюю чат з оселею
  async createUserChat(choseFlatId: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && choseFlatId) {
      const data = { auth: JSON.parse(userJson), flat_id: choseFlatId, };
      try {
        console.log(data)
        // const response: any = await this.http.post(this.serverPath + '/chat/add/chatUser', data).toPromise();
        // if (response.status === true) {
        //   this.sharedService.setStatusMessage('Створюємо чат');
        //   const result = await this.getFlatChats();
        //   if (result === 1) {
        //     setTimeout(() => { this.openChat(); }, 2000);
        //   } else if (result === 0) {
        //     this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        //     setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
        //   }
        // } else { }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
        setTimeout(() => { this.sharedService.setStatusMessage(''); }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }




}
