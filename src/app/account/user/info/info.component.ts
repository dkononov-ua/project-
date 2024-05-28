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

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA' },],
  styleUrls: ['./info.component.scss'],
  animations: [
    animations.right2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class InfoComponent implements OnInit {

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
  counterUserSubscribers: string = '0';
  counterUserDiscussio: string = '0';
  counterUserSubscriptions: string = '0';
  counterUserNewAgree: string = '0';
  counterUserNewMessage: any;
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

  ngOnInit(): void {
    // Assuming this.serverPath is of type Observable<string>
    this.getInfoUser();
    const counterUserSubscribers = localStorage.getItem('counterUserSubscribers')
    if (counterUserSubscribers) { this.counterUserSubscribers = counterUserSubscribers; }
    const counterUserDiscussio = localStorage.getItem('counterUserDiscussio')
    if (counterUserDiscussio) { this.counterUserDiscussio = counterUserDiscussio; }
    const counterUserSubscriptions = localStorage.getItem('counterUserSubscriptions')
    if (counterUserSubscriptions) { this.counterUserSubscriptions = counterUserSubscriptions; }
    const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
    if (counterUserNewAgree) { this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total; } else {
      this.counterUserNewAgree = '0';
    }
    this.getUserNewMessage();
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
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

  getInfoUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe(
        (response) => {
          if (response.status === true) {
            // console.log(response);
            this.agreeNum = response.agree;
            localStorage.setItem('counterUserNewAgree', JSON.stringify(this.agreeNum));
            this.userInfo.user_id = response.inf?.user_id || '';
            this.userInfo.firstName = response.inf?.firstName || '';
            this.userInfo.lastName = response.inf?.lastName || '';
            this.userInfo.surName = response.inf?.surName || '';
            this.userInfo.mail = response.cont.mail || '';
            this.userInfo.dob = response.inf?.dob || '';
            this.userInfo.tell = response.cont?.tell || '';
            this.userInfo.telegram = response.cont?.telegram || '';
            this.userInfo.facebook = response.cont?.facebook || '';
            this.userInfo.instagram = response.cont?.instagram || '';
            this.userInfo.viber = response.cont?.viber || '';
            this.userInfo.checked = response.inf?.checked || 0;
            this.userInfo.realll = response.inf?.realll || 0;
            if (response.img && response.img.length > 0) {
              this.userImg = response.img[0].img;
            }
            this.getInfo();
            this.getRatingTenant();
            this.getRatingOwner();
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

  // пошукові параметри користувача
  async getInfo(): Promise<any> {
    // localStorage.removeItem('statusUserData')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) }).toPromise() as any[];
        if (response.status === true) {
          this.statusInfo = {
            house: response.inf.house,
            flat: response.inf.flat,
            room: response.inf.room,
            looking_woman: response.inf.looking_woman,
            looking_man: response.inf.looking_man,
            agree_search: response.inf.agree_search,
            students: response.inf.students,
            woman: response.inf.woman,
            man: response.inf.man,
            family: response.inf.family,
            date: response.inf.data,
            checked: this.userInfo.checked,
            realll: this.userInfo.realll
          };
          this.statusDataService.setStatusData(this.statusInfo);
        }
      } catch (error) {
        console.log(error)
      }
    } else {
    }
  }

  // пошукові параметри користувача
  // async getInfo(): Promise<any> {
  //   localStorage.removeItem('searchInfoUserData')
  //   const userJson = localStorage.getItem('user');
  //   if (userJson) {
  //     this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) })
  //       .subscribe((response: any) => {
  //         localStorage.setItem('searchInfoUserData', JSON.stringify(response.inf));
  //       }, (error: any) => {
  //         console.error(error);
  //       });
  //   } else {
  //     // console.log('user not found');
  //   }
  // }

  //Запитую рейтинг орендаря
  async getRatingTenant(): Promise<any> {
    const response = await this.sharedService.getRatingTenant(this.userInfo.user_id);
    // console.log(response);
    this.ratingTenant = response.ratingTenant;
    this.numberOfReviewsTenant = response.numberOfReviewsTenant;
  }

  //Запитую рейтинг власника
  async getRatingOwner(): Promise<any> {
    const response = await this.sharedService.getRatingOwner(this.userInfo.user_id);
    // console.log(response);
    this.ratingOwner = response.ratingOwner;
    this.numberOfReviewsOwner = response.numberOfReviewsOwner;
  }

  // Копіювання параметрів
  copyId() { this.copyToClipboard(this.userInfo.user_id, 'ID скопійовано'); }
  copyTell() { this.copyToClipboard(this.userInfo.tell, 'Телефон скопійовано'); }
  copyMail() { this.copyToClipboard(this.userInfo.mail, 'Пошту скопійовано'); }
  copyViber() { this.copyToClipboard(this.userInfo.viber, 'Viber номер скопійовано'); }
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => { this.isCopiedMessage = message; setTimeout(() => { this.isCopiedMessage = ''; }, 2000); })
        .catch((error) => { this.isCopiedMessage = ''; });
    }
  }

  // створення чату техпідтримки в самому діскусіо
  async checkChatExistAndOpen(): Promise<void> {
    try {
      const chatExists = await this.sendMessageService.checkChatExistence(1);
      if (chatExists) {
        this.sendMessageService.openChat();
      } else {
        this.sendMessageService.createChat();
      }
    } catch (error) {
      console.error(error);
    }
  }


}
