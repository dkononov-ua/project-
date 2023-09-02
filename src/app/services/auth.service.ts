import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Оновлено імпорт throwError
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  flatService: any;

  constructor(private http: HttpClient, private router: Router) { }

  checkUser(user: any): Observable<any> {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      return throwError('Користувач не знайдений');
    }
    return this.http.post<any>('http://localhost:3000', user);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('house');
    localStorage.removeItem('selectedFlatId');
    setTimeout(() => {
      this.router.navigate(['/registration']);
    }, 500);
  }
}
