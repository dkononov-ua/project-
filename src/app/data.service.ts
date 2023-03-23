import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getData(): any {
    console.log('Пройшла перевірка користувача')
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      const apiUrl = 'http://localhost:3000/userinfo';
      return this.http.post(apiUrl, JSON.parse(userJson));
      // // const user = JSON.parse(userJson)
      // this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
      //   .subscribe((response: any) => {
      //     console.log(response);
      //   }, (error: any) => {
      //     console.error(error);
      //   });
      // // ...
    } else {
      console.log('user not found');
    }
    // Змініть URL на ваш реальний API-warp

  }
}


