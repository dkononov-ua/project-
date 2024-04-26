import { Injectable } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, analytics } from '../config/auth';
import { SharedService } from '../services/shared.service';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterService } from '../services/counter.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  serverPath = serverPath;

  userData: any;
  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private counterService: CounterService,
    private router: Router,
  ) { }

  async singAuthGoogle(param: string) {
    const provider = new GoogleAuthProvider();
    const user: any = await signInWithPopup(auth, provider);
    // console.log(user);
    if (user && '_tokenResponse' in user) {
      this.userData = user._tokenResponse
      // console.log(this.userData);
      if (this.userData) {
        const data = {
          idToken: this.userData.idToken,
          email: this.userData.email,
        };
        // console.log(data)
        try {
          const response = await this.http.post(serverPath + '/registration/googleLogin', data).toPromise() as any;
          // console.log(response)
          if (response.status === true && param === 'registration') {
            // зберігаю інформацію для профілю
            const registrationGoogleInfo = {
              firstName: this.userData.firstName,
              lastName: this.userData.lastName,
              email: this.userData.email
            };
            localStorage.setItem('registrationGoogleInfo', JSON.stringify(registrationGoogleInfo));
            this.sharedService.clearCache();
            this.sharedService.setStatusMessage('Вітаємо в Discussio!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Переходимо до налаштування профілю!');
              localStorage.setItem('user', JSON.stringify(response));
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
                this.router.navigate(['/information-user']);
              }, 2000);
            }, 1000);
          } else if (response.status === true && param === 'login') {
            this.sharedService.clearCache();
            this.sharedService.setStatusMessage('З поверненням в Discussio!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Переходимо до профілю!');
              localStorage.setItem('user', JSON.stringify(response));
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
                this.router.navigate(['/user/info']);
              }, 2000);
            }, 1000);
          } else {
            this.sharedService.setStatusMessage('Помилка входу');
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        } catch (error) {
          console.log(error)
        }
      } else { }
    } else {
      console.log('Властивість `_tokenResponse` не знайдена у користувача');
    }
  }

}
