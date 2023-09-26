import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsChatOpenService } from './services/is-chat-open.service';
import { Location } from '@angular/common';
import { IsAccountOpenService } from './services/is-account-open.service';
import { serverPath } from 'src/app/shared/server-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('locationElement') locationElement!: ElementRef;
  loginForm: any;
  isChatOpenStatus: boolean = false;
  isAccountOpenStatus: boolean = true;

  constructor(
    private http: HttpClient,
    private isChatOpenService: IsChatOpenService,
    private cdr: ChangeDetectorRef,
    private isAccountOpenService: IsAccountOpenService,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    const currentLocation = this.location.path();
    this.getAccountIsOpen()
    if (this.isAccountOpenStatus === false) {
      this.compareLocationWithCondition(currentLocation);
    }
    await this.getUserInfo();
    await this.getChatIsOpen();
  }

  async getUserInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post( serverPath +'/auth', JSON.parse(userJson))
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  compareLocationWithCondition(desiredLocation: string): void {
    const location = '/registration';
    if (location === desiredLocation) {
      this.isAccountOpenStatus = false;
    } else {
      this.isAccountOpenStatus = true;
    }
  }

  async getChatIsOpen() {
    this.isChatOpenService.isChatOpen$.subscribe(async isChatOpen => {
      this.isChatOpenStatus = isChatOpen;
      this.cdr.detectChanges();
    });
  }

  async getAccountIsOpen() {
    this.isAccountOpenService.isAccountOpen$.subscribe(async isAccountOpen => {
      this.isAccountOpenStatus = isAccountOpen;
      this.cdr.detectChanges();
    });
  }
}
