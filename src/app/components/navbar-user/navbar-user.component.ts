import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import { serverPath } from 'src/app/config/server-config';
import { DataService } from 'src/app/services/data.service';
import { CounterService } from 'src/app/services/counter.service';
@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  selectedFlatId!: string | null;
  loading: boolean = true;
  dataUpdated = false;
  offs: number = 0;
  numSendAgree: number = 0;
  userInf: any;
  agreeNum: number = 0;
  unreadUserMessage: any;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  iReadUserMessage: boolean = false;

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
    private dataService: DataService,
    private counterService: CounterService
  ) { }

  async ngOnInit(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.getUserSubscribersCount();
      this.getUserSubscriptionsCount();
      this.getUserDiscussioCount();
      this.getUserNewMessage();
      await this.getUpdateUserMessage();
      this.loading = false;
    } else {
      console.log('Авторизуйтесь')
    }
  }

  async getUpdateUserMessage() {
    this.updateComponent.iReadUserMessage$.subscribe(async () => {
      this.iReadUserMessage = true;
      if (this.iReadUserMessage === true) {
        this.counterUserNewMessage = 0;
      }
    });
  }

  // перевірка підписників користувача
  async getUserSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    this.counterService.counterUserSubscribers$.subscribe(data => {
      const counterUserSubscribers: any = data;
      this.counterUserSubscribers = counterUserSubscribers.status;
      // console.log('кількість підписників', this.counterUserSubscribers)
    });
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    this.counterService.counterUserSubscriptions$.subscribe(data => {
      const counterUserSubscriptions: any = data;
      this.counterUserSubscriptions = counterUserSubscriptions.status;
      // console.log('кількість підписок', this.counterUserSubscriptions)
    });
  }

  // перевірка дискусій користувача
  async getUserDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    this.counterService.counterUserDiscussio$.subscribe(data => {
      const counterUserDiscussio: any = data;
      this.counterUserDiscussio = counterUserDiscussio.status;
      // console.log('кількість дискусій', this.counterUserDiscussio)
    });
  }

  // перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    // await this.counterService.getUserNewMessage();
    this.counterService.counterUserNewMessage$.subscribe(data => {
      const counterUserNewMessage: any = data;
      this.counterUserNewMessage = counterUserNewMessage.status;
      // console.log('кількість повідомлень користувача', this.counterUserNewMessage)
    });
  }
}
