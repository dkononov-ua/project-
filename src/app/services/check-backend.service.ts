import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class CheckBackendService {

  serverPath: string = '';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
  ) { }

  async checkServerPath(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      // локальний сервер
      const firstPath = 'http://localhost:3000';
      // перший основний шлях до бекенду
      // const firstPath = 'https://backend.discussio.site:8000';
      try {
        // console.log('Перевіряю firstPath');
        const response: any = await this.http.get(firstPath + '/serv/chech').toPromise();
        // console.log(response.serb)
        // якщо є відповідь, залишаємо його основним
        if (response.serb === true) {
          this.serverPath = firstPath;
          console.log('ОК шлях firstPath');
        }
      } catch (error: any) {
        if (error.status === 0) {
          // console.log('Помилка з firstPath статус:', error.status);
        } else {
          console.log(error);
        }
        // console.log('Перевіряю secondPath');
        // другий шлях до бекенду
        const secondPath = 'https://sky.syrykh.com:8000';
        try {
          const response: any = await this.http.post(secondPath + '/userinfo', JSON.parse(userJson)).toPromise();
          // якщо є відповідь, ставимо його основним
          // console.log(response.serb)
          if (response.serb === true) {
            this.serverPath = secondPath;
            console.log('Встановлюю шлях secondPath');
          }
        } catch (secondPathError: any) {
          if (secondPathError.status === 0) {
            // console.log('Помилка з secondPath статус:', secondPathError.status);
            // залишаємо перший шлях
            this.serverPath = firstPath;
            this.sharedService.setStatusMessage('Можливо відсутня електроенергія сервер не відповідає');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Спробуйте пізніше!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('Актуальна інформація в групі телеграм');
                setTimeout(() => {
                  this.sharedService.setStatusMessage('');
                }, 1500);
              }, 1500);
            }, 1500);
          } else {
            console.log(secondPathError);
            // залишаємо перший шлях
            this.serverPath = firstPath;
            this.sharedService.setStatusMessage('Можливо відсутня електроенергія сервер не відповідає');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Спробуйте пізніше!');
              setTimeout(() => {
                this.sharedService.setStatusMessage('Актуальна інформація в групі телеграм');
                setTimeout(() => {
                  this.sharedService.setStatusMessage('');
                }, 1500);
              }, 1500);
            }, 1500);
          }
        }
      }
      // перевіряємо, чи шлях змінився, і змінюємо його всюди
      if (this.serverPath && this.serverPath !== firstPath) {
        console.log('Переписую всюди шлях на secondPath', this.serverPath);
        this.sharedService.setServerPath(this.serverPath);
      }
    } else {
      console.log('Дані користувача відсутні');
    }
  }

  // Виклик функції та встановлення інтервалу перевірки серверу
  startCheckServer() {
    setInterval(async () => {
      await this.checkServerPath();
    }, 10000); // 10000 мілісекунд = 10 секунд
  }
}
