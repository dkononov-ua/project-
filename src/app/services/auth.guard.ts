import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})

export class CanActivateGuard implements CanActivate {
  //  користувач увійшов в свій аккаунт, дозволяємо доступ до роутів
  constructor(
    private router: Router,
    private sharedService: SharedService,
  ) { }

  canActivate(): boolean {
    if (localStorage.getItem('user')) {
      // користувач увійшов в свій аккаунт, дозволяємо доступ до роутів
      return true;
    } else {
      this.sharedService.setStatusMessage('Будь ласка авторизуйтесь');
      this.router.navigate(['/auth/registration']);
      setTimeout(() => {
        this.sharedService.setStatusMessage('');
      }, 2000);
      // користувач не увійшов в свій аккаунт, перенаправляємо на сторінку входу
      return false;
    }
  }
}
