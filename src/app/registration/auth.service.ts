import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  checkUser(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000', user);
  }
  logout() {
    // Тут ви можете видалити токен або інші дані аутентифікації зі сховища (наприклад, localStorage)
    localStorage.removeItem('token');
    // Перенаправте користувача на сторінку входу або головну сторінку
    this.router.navigate(['/registration']);
  }
}
