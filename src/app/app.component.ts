import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loginForm: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log(111111)
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/auth', JSON.parse(userJson))
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  title = 'project';
}



