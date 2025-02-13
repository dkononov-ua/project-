import { Injectable } from '@angular/core';
import { clientId } from './../../../config/api';

declare var google: any; // Підключаємо глобальний об'єкт Google API

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId = clientId; // Замініть на свій Google Client ID

  constructor() {}

  initOneTapLogin(containerId: string, callback: (userData: any) => void) {
    setTimeout(() => {
      if (!google || !google.accounts) {
        console.error('Google API не завантажено');
        return;
      }

      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          const userData = this.decodeJwt(response.credential);
          callback(userData);
        },
        auto_select: false,
      });

      google.accounts.id.renderButton(
        document.getElementById(containerId),
        { theme: 'outline', size: 'large' }
      );
    }, 1000);

  }

  private decodeJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
