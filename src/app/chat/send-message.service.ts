import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { serverPath } from 'src/app/config/server-config';

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  private serverPath = serverPath;
  private messageTextSubject = new BehaviorSubject<string>('');
  public messageText$ = this.messageTextSubject.asObservable();

  private messageTextUserSubject = new BehaviorSubject<string>('');
  public messageTextUser$ = this.messageTextUserSubject.asObservable();

  constructor(private http: HttpClient) { }

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

  sendMessageUser(messageText: string, selectedFlatId: string): Observable<any> {
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


}
