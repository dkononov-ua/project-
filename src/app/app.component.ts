import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loginForm: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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

    window.addEventListener('scroll', () => {
      const footer = document.querySelector('.footer') as HTMLElement;
      if (footer !== null) {
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

        if (isAtBottom) {
          footer.style.visibility = 'visible';
        } else {
          footer.style.visibility = 'hidden';
        }
      }
    });

  }

  title = 'project';
}
