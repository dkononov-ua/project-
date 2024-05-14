import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class CanActivateGuard implements CanActivate {
  //  користувач увійшов в свій аккаунт, дозволяємо доступ до роутів
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (localStorage.getItem('user')) {
      // користувач увійшов в свій аккаунт, дозволяємо доступ до роутів
      return true;
    }

    // користувач не увійшов в свій аккаунт, перенаправляємо на сторінку входу
    this.router.navigate(['/auth/login']);
    return false;
  }
}
