import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import * as ServerConfig from 'src/app/config/path-config';
import { timeout } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class CheckBackendService {

  serverPath: string = '';
  statusServer: string = '';

  firstPath: string = ServerConfig.firstPath;
  secondPath: string = ServerConfig.secondPath;
  savedServerPath: string = '';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private loaderService: LoaderService,
  ) {
    this.sharedService.statusServer$.subscribe((status: string) => {
      this.statusServer = status;
    });
  }

  async checkServerPath(): Promise<any> {
    const savedServerPath = localStorage.getItem('savedServerPath');
    // console.log('Збережений шлях:', savedServerPath)
    if (savedServerPath) {
      // якщо є збережений шлях ми беремо його для порівняння
      this.savedServerPath = savedServerPath;
    } else {
      // якщо немає ми беремо перший
      this.savedServerPath = this.firstPath;
    }
    try {
      // console.log('Перевіряю firstPath');
      const response: any = await this.http.get(this.firstPath + '/serv/chech')
        .pipe(timeout(5000)) // Встановлюємо таймаут на 5 секунд
        .toPromise();
      // console.log(response)
      if (this.savedServerPath !== this.firstPath && response.serb === true) {
        // якщо є відповідь, і шлях не такий же переписуємо його на основний
        // console.log('Заміна на firstPath');
        this.serverPath = this.firstPath;
        // показую користувачу статус;
        this.statusServer = 'Перемикаємось на основний інтернет'
        this.sharedService.setStatusServer(this.statusServer);
        // встановлюю шлях в сервісі який передасть це значення всюди;
        this.sharedService.setServerPath(this.serverPath);
      } else if (this.savedServerPath === this.firstPath && response.serb === true) {
        //якщо такий шлях вже задіяний всюди
        // console.log('ОК firstPath');
        this.serverPath = this.firstPath;
        this.sharedService.setStatusServer('')
      }
    } catch (firstPathError: any) {
      // console.log(firstPathError)
      // якщо помилка з першим шляхом то ми пробуємо інший
      try {
        // console.log('Перевіряю secondPath');
        const response: any = await this.http.get(this.secondPath + '/serv/chech')
          .pipe(timeout(5000)) // Встановлюємо таймаут на 5 секунд
          .toPromise();
        // console.log(response.serb)
        if (this.savedServerPath !== this.secondPath && response.serb === true) {
          // якщо response.serb === true і він не є ще основним то ставимо його
          // console.log('Заміна на secondPath');
          this.statusServer = 'Перемикаємось на резервний інтернет'
          this.sharedService.setStatusServer(this.statusServer);
          // встановлюю шлях в локальне сховище;
          localStorage.setItem('savedServerPath', this.serverPath);
          // встановлюю шлях в сервісі який передасть це значення всюди;
          this.sharedService.setServerPath(this.secondPath);
        } else if (this.savedServerPath === this.secondPath && response.serb === true) {
          //якщо такий шлях вже задіяний всюди
          // console.log('ОК secondPath');
          this.statusServer = 'Задіяний резервний інтернет, швидкість може бути нижчою! Дякуємо за розуміння!';
          this.sharedService.setStatusServer(this.statusServer);
        }
      } catch (secondPathError: any) {
        //якщо нічого не відповідає
        // console.log('firstPath and secondPath is OFF');
        // this.serverPath = this.secondPath;
        if (this.statusServer !== 'Відсутня електроенергія, жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.') {
          this.statusServer = 'Відсутня електроенергія, жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.';
          this.sharedService.setStatusServer(this.statusServer);
          // this.router.navigate(['/home/about-project']);
        }
      }
    }
  }

  async startTimerCheckServer() {
    setInterval(async () => {
      await this.checkServerPath();
    }, 11000);
  }

  // Виклик функції та встановлення інтервалу перевірки серверу
  async startCheckServer() {
    await this.checkServerPath();
    this.startTimerCheckServer();
  }

}
