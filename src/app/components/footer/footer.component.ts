import { Component, OnInit } from '@angular/core';
import { ServerKeepAliveService } from 'src/app/services/server-keep-alive.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  gmail: string = 'discussio.inc@gmail.com';
  authorization: boolean = false;

  constructor() { }

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }
}
