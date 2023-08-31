import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  flatService: any;

  constructor(private http: HttpClient, private router: Router) { }

  checkUser(user: any): Observable<any> {
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
