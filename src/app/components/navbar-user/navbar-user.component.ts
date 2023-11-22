import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/config/server-config';
@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  unreadMessage: any;
  selectedFlatId!: string | null;
  counterUserSubs: any;
  counterUserSubscriptions: any;
  counterUserDiscuss: any;
  loading: boolean = true;
  dataUpdated = false;
  offs: number = 0;
  numSendAgree: number = 0;
  userInf: any;
  agreeNum: number = 0;

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      await this.getMessageAll()
      await this.getUpdate();
    }
    this.loading = false;
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

  async getUpdate() {
    localStorage.getItem('userData')
    const userInfo = localStorage.getItem('userData');
    if (userInfo) {
      this.userInf = JSON.parse(userInfo);
      this.agreeNum = this.userInf.agree.total;
    }

    await this.getSubsCount();
    await this.getAcceptSubsCount();
    await this.getSubscriptionsCount();

    this.updateComponent.updateUser$.subscribe(() => {
      this.dataUpdated = true;
      if (this.dataUpdated === true) {
        this.getSubsCount();
        this.getAcceptSubsCount();
        this.getSubscriptionsCount();
      }
    });
  }

  // Підписники
  async getSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/usersubs/get/CountYUserSubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterUserSubs = response;
    }
    catch (error) {
      console.error(error)
    }
  }

  // Підписки
  async getSubscriptionsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/subs/get/countYSubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterUserSubscriptions = response;
    }
    catch (error) {
      console.error(error)
    }
  }

  // Дискусії
  async getAcceptSubsCount() {
    const userJson = localStorage.getItem('user')
    const url = serverPath + '/acceptsubs/get/CountYsubs';
    const data = {
      auth: JSON.parse(userJson!),
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.counterUserDiscuss = response;
    }
    catch (error) {
      console.error(error)
    }
  }
}
