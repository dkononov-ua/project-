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
    const savedServerPath = localStorage.getItem('savedServerPath') || this.firstPath;
    this.savedServerPath = savedServerPath;

    try {
      const response: any = await this.http.get(`${this.firstPath}/serv/chech`).pipe(timeout(5000)).toPromise();

      if (response.serb === true) {
        if (this.savedServerPath !== this.firstPath) {
          this.serverPath = this.firstPath;
          this.sharedService.setServerPath(this.serverPath);
          this.sharedService.setStatusServer('');
        }
      } else {
        throw new Error('First path check failed');
      }
    } catch {
      try {
        const response: any = await this.http.get(`${this.secondPath}/serv/chech`).pipe(timeout(5000)).toPromise();

        if (response.serb === true && this.savedServerPath !== this.secondPath) {
          this.serverPath = this.secondPath;
          localStorage.setItem('savedServerPath', this.serverPath);
          this.sharedService.setServerPath(this.serverPath);
          this.sharedService.setStatusServer('Задіяний резервний інтернет');
        } else {
          throw new Error('Second path check failed');
        }
      } catch {
        try {
          const response: any = await this.http.get(`${this.thirdPath}/serv/chech`).pipe(timeout(5000)).toPromise();

          if (response.serb === true && this.savedServerPath !== this.thirdPath) {
            this.serverPath = this.thirdPath;
            localStorage.setItem('savedServerPath', this.serverPath);
            this.sharedService.setServerPath(this.serverPath);
            this.sharedService.setStatusServer('Задіяний другий резервний інтернет');
          } else {
            throw new Error('Third path check failed');
          }
        } catch {
          if (this.statusServer !== 'Відсутня електроенергія, жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.') {
            this.sharedService.setStatusServer('Відсутня електроенергія, жоден сервер не відповідає. Спробуйте пізніше! Актуальна інформація в групі телеграм.');
          }
        }
      }
    }
  }

  async startTimerCheckServer(): Promise<void> {
    setInterval(() => this.checkServerPath(), 11000);
  }

  async startCheckServer(): Promise<void> {
    await this.checkServerPath();
    this.startTimerCheckServer();
  }


}
