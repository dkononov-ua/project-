// server-keep-alive.service.ts
import { Injectable } from '@angular/core';
import { serverPath } from 'src/app/config/server-config';

@Injectable({
  providedIn: 'root',
})
export class ServerKeepAliveService {
  private serverPath = serverPath;

  constructor() {}

  startKeepAlive() {
    // console.log('sendKeepAliveRequest')
    const interval = setInterval(() => {
      this.sendKeepAliveRequest();
    }, 3600000); // 1 година
  }

  private sendKeepAliveRequest() {
    console.log(2222)
    fetch(this.serverPath)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          console.error('Error:', response.status);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
}
