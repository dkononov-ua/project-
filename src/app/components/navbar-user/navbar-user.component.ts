import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { serverPath } from 'src/app/shared/server-config';


@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  unreadMessage: any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getMessageAll()
  }

  async getMessageAll(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/chat/get/DontReadMessageUser';
    const data = { auth: JSON.parse(userJson!) };

    if (userJson) {
      this.http.post(url, data).subscribe((response: any) => {
        this.unreadMessage = response.status;
      }, (error: any) => {
        console.error(error);
      });
    } else {
      console.log('user not found');
    }
  }


}
