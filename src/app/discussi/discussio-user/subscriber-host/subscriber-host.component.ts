import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/shared/server-config';
@Component({
  selector: 'app-subscriber-host',
  templateUrl: './subscriber-host.component.html',
  styleUrls: ['./subscriber-host.component.scss']
})
export class SubscriberHostComponent implements OnInit {
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  loading: boolean = true;
  dataUpdated = false;

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getUpdate();
    this.loading = false;
  }

  async getUpdate() {
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
      this.counterSubs = response;
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
      this.counterSubscriptions = response;
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
      this.counterAcceptSubs = response;
    }
    catch (error) {
      console.error(error)
    }
  }
}



