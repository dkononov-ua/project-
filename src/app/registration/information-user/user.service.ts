import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(email: string, password: string) {
    const body = {
      email: email,
      password: password
    }
    return this.http.post('http://localhost:3000/user', body);
  }
}
