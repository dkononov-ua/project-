import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import * as ServerConfig from 'src/app/config/path-config';
import { UserInfo } from '../../../interface/info';
import { UsereSearchConfig } from '../../../interface/param-config';
import { Options, Distance, Animals, CheckBox, OptionPay, Purpose } from '../../../interface/name';
import { animations } from '../../../interface/animation';
import { ActivatedRoute } from '@angular/router';
import { CounterService } from 'src/app/services/counter.service';
import { Location } from '@angular/common';
import { SendMessageService } from 'src/app/chat/send-message.service';
import { SharedService } from 'src/app/services/shared.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
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
    animations.swichCard,
  ],
})
export class UserPageComponent implements OnInit {




  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath!: string;
  // ***

  indexPage: number = 0;
  userImg: any;
  loading: boolean = false;
  public selectedFlatId: any | null;
  searchInfoUserData: any;
  ratingTenant: number | undefined;
  ratingOwner: number | undefined;
  isCopiedMessage!: string;
  userInfo: UserInfo = UsereSearchConfig;
  options: { [key: number]: string } = Options;
  aboutDistance: { [key: number]: string } = Distance;
  animals: { [key: string]: string } = Animals;
  option_pay: { [key: number]: string } = OptionPay;
  purpose: { [key: number]: string } = Purpose;
  statusMessage: string | undefined;

  agreeNum: number = 0;
  page: any;
  counterUserSubscribers: any;
  counterUserSubscriptions: any;
  counterUserDiscussio: any;
  counterUserNewMessage: any;
  counterUserNewAgree: any;

  userMenu: boolean = false;
  isLoadingImg: boolean = false;
  numberOfReviewsTenant: any;
  numberOfReviewsOwner: any;
  statusInfo: any;

  openUserMenu() {
    if (this.userMenu) {
      setTimeout(() => {
        this.userMenu = false;
      }, 600);
    } else {
      this.userMenu = true;
    }
  }

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  goBack(): void {
    this.location.back();
  }
  isMobile: boolean = false;
  authorization: boolean = false;

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private counterService: CounterService,
    private location: Location,
    private sendMessageService: SendMessageService,
    private statusDataService: StatusDataService,
  ) {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      // console.log(this.serverPath)
    })
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  async ngOnInit(): Promise<void> {
    this.getInfoUser();
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
      await this.getUserSubscribersCount();
      await this.getUserSubscriptionsCount();
      await this.getUserDiscussioCount();
      this.getCounterAgree();
    } else {
      this.authorization = false;
    }

  }

  getCounterAgree() {
    const userJson = localStorage.getItem('user');
    // console.log(localStorage.getItem('user'))
    if (userJson) {
      const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
      if (counterUserNewAgree) {
        this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
        // console.log(counterUserNewAgree)
      } else {
        this.counterUserNewAgree = 0;
      }
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

  getInfoUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe(
        (response) => {
          if (response.status === true) {
            this.statusDataService.setUserData(response.cont, 0);
          } else {
            console.log('Авторизуйтесь')
            this.sharedService.logout();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

}
