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
  thirdPath: string = ServerConfig.thirdPath;
  savedServerPath: string = '';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
  ) {
    this.sharedService.statusServer$.subscribe((status: string) => {
      this.statusServer = status;
    });
  }

  async checkServerPath(): Promise<void> {
    try {
      // Перевірка поточного збереженого шляху
      const response: any = await this.http.get(`${this.savedServerPath}/serv/chech`).pipe(timeout(2000)).toPromise();

      if (response.serb === true) {
        this.sharedService.setStatusServer('');  // Сервер доступний, все добре
      } else {
        throw new Error('Current path check failed');
      }
    } catch {
      // Якщо поточний шлях недоступний, починаємо перевірку альтернативних шляхів
      try {
        const response: any = await this.http.get(`${this.firstPath}/serv/chech`).pipe(timeout(2000)).toPromise();

        if (response.serb === true && this.savedServerPath !== this.firstPath) {
          this.serverPath = this.firstPath;
          localStorage.setItem('savedServerPath', this.serverPath);
          this.sharedService.setServerPath(this.serverPath);
          this.sharedService.setStatusServer('');
        } else {
          throw new Error('First path check failed');
        }
      } catch {
        try {
          const response: any = await this.http.get(`${this.secondPath}/serv/chech`).pipe(timeout(2000)).toPromise();

          if (response.serb === true && this.savedServerPath !== this.secondPath) {
            this.serverPath = this.secondPath;
            localStorage.setItem('savedServerPath', this.serverPath);
            this.sharedService.setServerPath(this.serverPath);
            // this.sharedService.setStatusServer('Задіяний резервний інтернет');
          } else {
            throw new Error('Second path check failed');
          }
        } catch {
          try {
            const response: any = await this.http.get(`${this.thirdPath}/serv/chech`).pipe(timeout(2000)).toPromise();

            if (response.serb === true && this.savedServerPath !== this.thirdPath) {
              this.serverPath = this.thirdPath;
              localStorage.setItem('savedServerPath', this.serverPath);
              this.sharedService.setServerPath(this.serverPath);
              // this.sharedService.setStatusServer('Задіяний другий резервний інтернет');
            } else {
              throw new Error('Third path check failed');
            }
          } catch {
            this.sharedService.setStatusServer('Відсутня електроенергія. Спробуйте пізніше!');
          }
        }
      }
    }
  }

  async startTimerCheckServer(): Promise<void> {
    const intervalId = setInterval(async () => {
      try {
        await this.checkServerPath();
        clearInterval(intervalId); // Зупинити перевірки, якщо сервер знову став доступним
      } catch {
        // Якщо поточний сервер недоступний, продовжуємо перевірку
      }
    }, 3000);
  }

  async startCheckServer(): Promise<void> {
    this.startTimerCheckServer();
  }



}
