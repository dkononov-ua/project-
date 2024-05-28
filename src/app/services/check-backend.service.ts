import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import * as ServerConfig from 'src/app/config/path-config';
import { timeout } from 'rxjs';

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
        console.log('ОК firstPath');
        this.serverPath = this.firstPath;
        this.sharedService.setStatusServer('')
      } else {
        console.log('firstPath is OFF');
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
          console.log('ОК secondPath');
          this.statusServer = 'Задіяний резервний інтернет, швидкість може бути нижчою! Дякуємо за розуміння!';
          this.sharedService.setStatusServer(this.statusServer);
        } else {
          console.log('secondPath is OFF');
        }
      } catch (secondPathError: any) {
        //якщо нічого не відповідає
        // console.log('firstPath and secondPath is OFF');
        this.serverPath = this.secondPath;
        if (this.statusServer !== 'Відсутня електроенергія, жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.') {
          this.statusServer = 'Задіяний резервний інтернет, швидкість може бути нижчою! Дякуємо за розуміння!';
          this.sharedService.setStatusServer(this.statusServer);
        }
      }

    }
  }

  async startTimerCheckServer() {
    setInterval(async () => {
      await this.checkServerPath();
    }, 11000);
  }


  // async checkServerPath(): Promise<any> {
  //   // const firstPath = 'http://localhost:3000';
  //   // перший основний шлях до бекенду
  //   const firstPath = 'https://backend.discussio.site:8000';
  //   try {
  //     console.log('Перевіряю firstPath');
  //     const response: any = await this.http.get(firstPath + '/serv/chech').toPromise();
  //     // console.log(response)
  //     // якщо є відповідь, і шлях не такий же переписуємо його на основний
  //     if (this.serverPath !== firstPath && response.serb === true) {
  //       this.changeServerPath = true;
  //       this.serverPath = firstPath;
  //       this.sharedService.setStatusServer('Перемикаємось на основний інтернет');
  //       console.log('Заміна на firstPath');
  //       // встановлюю шлях в локальне сховище;
  //       localStorage.setItem('savedServerPath', this.serverPath);
  //       // встановлюю шлях в сервісі який передасть це значення всюди;
  //       this.sharedService.setServerPath(this.serverPath);
  //     } else {
  //       //якщо такий шлях вже задіяний всюди
  //       this.serverPath = firstPath;
  //       this.changeServerPath = false;
  //       this.sharedService.setStatusServer('')
  //       console.log('ОК firstPath');
  //     }
  //   } catch (firstPathError: any) {
  //     // якщо помилка з першим шляхом то ми пробуємо інший
  //     try {
  //       console.log('Перевіряю secondPath');
  //       const response: any = await this.http.get(this.secondPath + '/serv/chech').toPromise();
  //       // console.log(response.serb)
  //       // якщо response.serb === true і він не є ще основним то ставимо його
  //       if (this.serverPath !== this.secondPath && response.serb === true) {
  //         this.serverPath = this.secondPath;
  //         this.changeServerPath = true;
  //         this.sharedService.setStatusServer('Перемикаємось на резервний інтернет')
  //         console.log('Заміна на secondPath');
  //       } else {
  //         console.log('ОК secondPath');
  //         //якщо такий шлях вже задіяний всюди
  //         this.serverPath = this.secondPath;
  //         this.changeServerPath = false;
  //         if (this.statusServer !== 'Основний інтернет відсутній. Задіяний резервний, швидкість може бути нижчою! Дякуємо за розуміння!') {
  //           this.sharedService.setStatusServer('Основний інтернет відсутній. Задіяний резервний, швидкість може бути нижчою! Дякуємо за розуміння!')
  //         }
  //       }
  //     } catch (secondPathError: any) {
  //       //якщо нічого не відповідає
  //       if (this.statusServer !== 'Можливо відсутня електроенергія жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.') {
  //         this.sharedService.setStatusServer('Можливо відсутня електроенергія жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.')
  //       }
  //     }
  //   }
  //   console.log(this.serverPath);

  //   if (this.serverPath !== firstPath) {
  //     console.log('Переписую всюди шлях на firstPath', this.serverPath);
  //     this.sharedService.setServerPath(this.serverPath);
  //   }

  //   // // перевіряємо, якщо шлях не був firstPath а він доступний, то відправляємо його всюди
  //   // if (this.serverPath === firstPath && this.changeServerPath) {
  //   //   console.log('Переписую всюди шлях на firstPath', this.serverPath);
  //   //   this.sharedService.setServerPath(this.serverPath);
  //   //   this.changeServerPath = false;
  //   // }
  //   // // перевіряємо, якщо шлях не був secondPath а він доступний, то відправляємо його всюди
  //   // if (this.serverPath === this.secondPath && this.changeServerPath) {
  //   //   console.log('Переписую всюди шлях на secondPath', this.serverPath);
  //   //   this.sharedService.setServerPath(this.serverPath);
  //   //   this.changeServerPath = false;
  //   // }
  // }

  // Виклик функції та встановлення інтервалу перевірки серверу
  async startCheckServer() {
    await this.checkServerPath();
    this.startTimerCheckServer();
  }

}
