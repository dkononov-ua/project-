import { Component, OnInit } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';
import { IsAccountOpenService } from 'src/app/services/is-account-open.service';
import { UpdateComponentService } from 'src/app/services/update-component.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})



export class UserComponent implements OnInit {

  statusMessage: any;
  loginCheck: boolean = false;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  counterUserSubs: any;
  counterUserDiscuss: any;
  userInf: any;
  agreeNum: number = 0;
  loading: boolean = false;

  unreadUserMessage: any;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  iReadUserMessage: boolean = false;
  counterUserNewAgree: any;
  authorization: boolean = false;

  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }
  
  constructor(
    private isAccountOpenService: IsAccountOpenService,
    private counterService: CounterService,
    private updateComponent: UpdateComponentService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sendAccountIsOpen();
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.loginCheck = true;
      this.authorization = true;
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserDiscussioCount();
      await this.getUserNewMessage();
      await this.getUpdateUserMessage();
      this.getCounterAgree();
    } else {
      this.authorization = false;
    }
  }

  getCounterAgree() {
    const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
    if (counterUserNewAgree) {
      this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
    } else {
      this.counterUserNewAgree = 0;
    }
  }

  // перевірка підписників користувача
  async getUserSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    await this.counterService.getUserSubscribersCount();
    this.counterService.counterUserSubscribers$.subscribe(data => {
      const counterUserSubscribers: any = data;
      if (counterUserSubscribers.status === 'Немає доступу') {
        this.counterUserSubscribers = null;
      } else {
        this.counterUserSubscribers = counterUserSubscribers;
      }
      // console.log('кількість підписників', this.counterUserSubscribers)
    });
  }

  // перевірка підписок користувача
  async getUserSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    await this.counterService.getUserSubscriptionsCount();
    this.counterService.counterUserSubscriptions$.subscribe(data => {
      const counterUserSubscriptions: any = data;
      if (counterUserSubscriptions.status === 'Немає доступу') {
        this.counterUserSubscriptions = null;
      } else {
        this.counterUserSubscriptions = counterUserSubscriptions;
      }
      // console.log('кількість підписників', this.counterUserSubscriptions)
    });
  }

  // перевірка дискусій користувача
  async getUserDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getUserDiscussioCount();
    this.counterService.counterUserDiscussio$.subscribe(data => {
      const counterUserDiscussio: any = data;
      this.counterUserDiscussio = counterUserDiscussio;
      // console.log('кількість дискусій', this.counterUserDiscussio)
    });
  }

  // перевірка на нові повідомлення користувача
  async getUserNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getUserNewMessage();
    this.counterService.counterUserNewMessage$.subscribe(data => {
      const counterUserNewMessage: any = data;
      this.counterUserNewMessage = counterUserNewMessage.status;
      // console.log('кількість повідомлень користувача', this.counterUserNewMessage)
    });
  }

  // повідомлення користувача було прочитано
  async getUpdateUserMessage() {
    this.updateComponent.iReadUserMessage$.subscribe(async () => {
      this.iReadUserMessage = true;
      if (this.iReadUserMessage === true) {
        this.counterUserNewMessage = 0;
      }
    });
  }

  sendAccountIsOpen() {
    this.isAccountOpenStatus = true;
    this.isAccountOpenService.setIsAccountOpen(this.isAccountOpenStatus);
  }
}
