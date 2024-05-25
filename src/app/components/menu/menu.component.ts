import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UpdateComponentService } from 'src/app/services/update-component.service';
import * as ServerConfig from 'src/app/config/path-config';
import { CounterService } from 'src/app/services/counter.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { animations } from '../../interface/animation';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(120%)' }),
        animate('{{delay}}ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms ease-in-out', style({ transform: 'translateX(120%)' }))
      ]),
    ]),
    animations.top,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
  ],
})

export class MenuComponent {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  disabledBtn: boolean = false;
  animationDelay(index: number): string {
    return (600 + 100 * index).toString();
  }

  statusMessage: any;
  loginCheck: boolean = false;

  linkOpen: boolean[] = [false, false, false, false, false];
  menu: boolean[] = [false, false, false, false, false];

  toggleAllMenu(index: number) {
    this.linkOpen[index] = !this.linkOpen[index];
    this.disabledBtn = true;
    if (this.menu[index]) {
      setTimeout(() => {
        this.menu[index] = !this.menu[index];
        this.disabledBtn = false;
      }, 600);
    } else {
      this.menu[index] = !this.menu[index];
      this.disabledBtn = false;
    }
  }

  selectedFlatId: any;
  counterSubs: any;
  counterSubscriptions: any;
  counterAcceptSubs: any;
  counterUserSubs: any;
  counterUserDiscuss: any;
  numSendAgree: number = 0;
  userInf: any;
  agreeNum: number = 0;
  loading: boolean = false;
  dataUpdated = false;
  houseData: any;
  acces_added: number = 1;
  acces_admin: number = 1;
  acces_agent: number = 1;
  acces_agreement: number = 1;
  acces_citizen: number = 1;
  acces_comunal: number = 1;
  acces_comunal_indexes: number = 1;
  acces_discuss: number = 1;
  acces_filling: number = 1;
  acces_flat_chats: number = 1;
  acces_flat_features: number = 1;
  acces_services: number = 1;
  acces_subs: number = 1;

  counterHouseSubscribers: any;
  counterHouseSubscriptions: any;
  counterHouseDiscussio: any;
  unreadHouseMessage: any;
  iReadHouseMessage: boolean = false;

  unreadUserMessage: any;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterHouseNewMessage: any;
  counterUserNewMessage: any;
  iReadUserMessage: boolean = false;
  counterUserNewAgree: any;
  authorization: boolean = false;

  constructor(
    private http: HttpClient,
    private updateComponent: UpdateComponentService,
    private counterService: CounterService,
    private router: Router,
    private sharedService: SharedService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
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
      const houseData = localStorage.getItem('houseData');
      if (houseData) {
        const parsedHouseData = JSON.parse(houseData);
        this.houseData = parsedHouseData;
        this.selectedFlatId = parsedHouseData.flat.flat_id;
        if (this.selectedFlatId) {
          this.getHouseAcces();
          await this.getHouseSubscribersCount();
          await this.getHouseSubscriptionsCount();
          await this.getHouseDiscussioCount();
          await this.getHouseNewMessage();
          await this.getUpdateHouseMessage();
          this.loading = false;
        }
      } else {
        // console.log('Оберіть оселю')
      }
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

  // перевірка підписників оселі
  async getHouseSubscribersCount() {
    // console.log('Відправляю запит на сервіс кількість підписників',)
    await this.counterService.getHouseSubscribersCount(this.selectedFlatId);
    this.counterService.counterHouseSubscribers$.subscribe(data => {
      const counterHouseSubscribers: any = data;
      this.counterHouseSubscribers = counterHouseSubscribers.status;
      // console.log('кількість підписників', this.counterHouseSubscribers)
    });
  }

  // перевірка підписок оселі
  async getHouseSubscriptionsCount() {
    // console.log('Відправляю запит на сервіс кількість підписок',)
    await this.counterService.getHouseSubscriptionsCount(this.selectedFlatId);
    this.counterService.counterHouseSubscriptions$.subscribe(data => {
      const counterHouseSubscriptions: any = data;
      this.counterHouseSubscriptions = counterHouseSubscriptions.status;
      // console.log('кількість підписок', this.counterHouseSubscriptions)
    });
  }

  // перевірка дискусій оселі
  async getHouseDiscussioCount() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getHouseDiscussioCount(this.selectedFlatId);
    this.counterService.counterHouseDiscussio$.subscribe(data => {
      const counterHouseDiscussio: any = data;
      if (counterHouseDiscussio.status === 'Немає доступу') {
        this.counterHouseDiscussio = null;
      } else {
        this.counterHouseDiscussio = counterHouseDiscussio.status;
      }
      // console.log('кількість дискусій', this.counterHouseDiscussio)
    });
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

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  getHouseAcces(): void {
    if (this.houseData.acces) {
      this.acces_added = this.houseData.acces.acces_added;
      this.acces_admin = this.houseData.acces.acces_admin;
      this.acces_agent = this.houseData.acces.acces_agent;
      this.acces_agreement = this.houseData.acces.acces_agreement;
      this.acces_citizen = this.houseData.acces.acces_citizen;
      this.acces_comunal = this.houseData.acces.acces_comunal;
      this.acces_comunal_indexes = this.houseData.acces.acces_comunal_indexes;
      this.acces_discuss = this.houseData.acces.acces_discuss;
      this.acces_filling = this.houseData.acces.acces_filling;
      this.acces_flat_chats = this.houseData.acces.acces_flat_chats;
      this.acces_flat_features = this.houseData.acces.acces_flat_features;
      this.acces_services = this.houseData.acces.acces_services;
      this.acces_subs = this.houseData.acces.acces_subs;
    }
  }

  // перевірка на нові повідомлення оселі
  async getHouseNewMessage() {
    // console.log('Відправляю запит на сервіс кількість дискусій',)
    await this.counterService.getHouseNewMessage(this.selectedFlatId);
    this.counterService.counterHouseNewMessage$.subscribe(data => {
      const counterHouseNewMessage: any = data;
      this.counterHouseNewMessage = counterHouseNewMessage.status;
      // console.log('кількість повідомлень оселі', this.counterHouseNewMessage)
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

  // повідомлення оселі було прочитано
  async getUpdateHouseMessage() {
    this.updateComponent.iReadHouseMessage$.subscribe(async () => {
      this.iReadHouseMessage = true;
      if (this.iReadHouseMessage === true) {
        this.counterHouseNewMessage = 0;
      }
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

  logout() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    this.statusMessage = 'Виходимо з аккаунту';
    setTimeout(() => {
      this.statusMessage = '';
      this.loading = true;
      setTimeout(() => {
        location.reload();
      }, 1500);
    }, 1500);
  }
}

