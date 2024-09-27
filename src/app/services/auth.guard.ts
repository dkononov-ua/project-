import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})

export class CanActivateGuard implements CanActivate {
  //  користувач увійшов в свій аккаунт, дозволяємо доступ до роутів
  constructor(private sharedService: SharedService,) { }

  canActivate(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    } else {
      this.sharedService.logout();
      return false;
    }
  }
}
