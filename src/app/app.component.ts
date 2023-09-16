import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsChatOpenService } from './services/is-chat-open.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loginForm: any;
  isChatOpenStatus: boolean = false;

  constructor(
    private http: HttpClient,
    private isChatOpenService: IsChatOpenService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    this.getUserInfo();
    await this.getChatIsOpen();
  }

  async getUserInfo() {
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

  async getChatIsOpen() {
    this.isChatOpenService.isChatOpen$.subscribe(async isChatOpen => {
      this.isChatOpenStatus = isChatOpen;
      this.cdr.detectChanges();
    });
  }
}
