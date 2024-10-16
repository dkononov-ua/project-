import { Injectable } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, analytics } from '../../config/firebaseConfig';
import { SharedService } from '../../services/shared.service';
import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CounterService } from '../../services/counter.service';
import * as ServerConfig from 'src/app/config/path-config';
import { StatusMessageService } from '../../services/status-message.service';
import { LoaderService } from 'src/app/services/loader.service';
import { StatusDataService } from 'src/app/services/status-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  userData: any;
  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private counterService: CounterService,
    private router: Router,
    private statusMessageService: StatusMessageService,
    private loaderService: LoaderService,
    private statusDataService: StatusDataService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  async singAuthGoogle(param: string) {
    this.loaderService.setLoading(true);

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
          const response = await this.http.post(this.serverPath + '/registration/googleLogin', data).toPromise() as any;
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
            this.statusMessageService.setStatusMessage('Вітаємо в Discussio!');
            setTimeout(() => {
              this.statusMessageService.setStatusMessage('Переходимо до налаштування профілю!');
              localStorage.setItem('user', JSON.stringify(response));
              setTimeout(() => {
                this.router.navigate(['/user/edit']);
                this.statusMessageService.setStatusMessage('');
                this.loaderService.setLoading(false);
              }, 2000);
            }, 1000);
          } else if (response.status === true && param === 'login') {
            localStorage.removeItem('storageUserLooking');
            this.sharedService.setStatusMessage('З поверненням!');
            localStorage.setItem('user', JSON.stringify(response));
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оновлюємо дані');
              this.dataService.getInfoUser().subscribe((response: any) => {
                setTimeout(() => {
                  if (response.status === true) {
                    this.sharedService.setStatusMessage('Оновлено');
                    this.statusDataService.setUserData(response.cont, 0);
                    setTimeout(() => {
                      this.router.navigate(['/user']);
                      this.sharedService.setStatusMessage('');
                      this.loaderService.setLoading(false);
                    }, 1500);
                  } else {
                    this.sharedService.setStatusMessage('Помилка оновлення даних');
                    setTimeout(() => {
                      location.reload();
                    }, 1500);
                  }
                }, 1500);
              })
            }, 1500);
          } else {
            this.statusMessageService.setStatusMessage('Помилка входу');
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        } catch (error) {
          console.log(error);
          this.loaderService.setLoading(false);
        }
      } else { }
    } else {
      console.log('Властивість `_tokenResponse` не знайдена у користувача');
      this.loaderService.setLoading(false);
    }
  }
}
