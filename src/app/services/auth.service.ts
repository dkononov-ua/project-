import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  flatService: any;
  serverPath: string = '';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  // Перевіряю чи авторизований юзер
  async checkAuth() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await firstValueFrom(this.http.post(this.serverPath + '/auth', JSON.parse(userJson)));
        if (response.status === true) {
          this.checkUser(response)
        } else {
          this.sharedService.clearCache();
        }
      } catch (error) {
        this.sharedService.clearCache();
      }
    }
  }

  // Перевіряю чи збережений в локальному сховищі користувач той самий що і зараз, і чи не змінювався в нього пароль
  checkUser(user: any) {
    const storageUser = localStorage.getItem('user');
    if (storageUser && user) {
      const storageUserObject = JSON.parse(storageUser);
      if (storageUserObject.password === user.password) {
        // console.log('userAutchCheck complite')
      } else {
        this.sharedService.clearCache();
      }
    } else {
      this.sharedService.clearCache();
    }
  }

}
