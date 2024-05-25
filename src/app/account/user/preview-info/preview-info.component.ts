import { Component, OnInit } from '@angular/core';
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
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-preview-info',
  templateUrl: './preview-info.component.html',
  styleUrls: ['./preview-info.component.scss'],
  animations: [
    animations.right2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.top1,
    animations.swichCard,
  ],
})
export class PreviewInfoComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
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

  totalDays: any;

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
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private counterService: CounterService,
    private location: Location,
    private sharedService: SharedService,
  ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  async ngOnInit(): Promise<void> {

    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      if (this.serverPath) {

      }
    })

    this.loading = true;
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
    });
    this.getInfoUser()
    this.getInfo(),
      setTimeout(() => {
        this.loading = false;
      }, 200);

    const counterUserSubscribers = localStorage.getItem('counterUserSubscribers')
    if (counterUserSubscribers) {
      this.counterUserSubscribers = counterUserSubscribers;
    }
    const counterUserDiscussio = localStorage.getItem('counterUserDiscussio')
    if (counterUserDiscussio) {
      this.counterUserDiscussio = counterUserDiscussio;
    }
    const counterUserSubscriptions = localStorage.getItem('counterUserSubscriptions')
    if (counterUserSubscriptions) {
      this.counterUserSubscriptions = counterUserSubscriptions;
    }

    const counterUserNewAgree = localStorage.getItem('counterUserNewAgree');
    if (counterUserNewAgree) {
      this.counterUserNewAgree = JSON.parse(counterUserNewAgree).total;
    } else {
      this.counterUserNewAgree = '0';
    }

    this.getUserNewMessage();
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

  async calculateTotalDays(): Promise<number> {
    const days = this.userInfo.days || 0;
    const weeks = this.userInfo.weeks || 0;
    const months = this.userInfo.mounths || 0;
    const years = this.userInfo.years !== undefined ? this.userInfo.years : 0;
    const totalDays = days + weeks * 7 + months * 30 + years * 365;
    this.totalDays = totalDays;
    return totalDays;
  }

  getInfoUser() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoUser().subscribe(
        (response: any) => {
          // console.log(response)
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
          if (response.img && response.img.length > 0) {
            this.userImg = response.img[0].img;
          }
          this.getRatingTenant();
          this.getRatingOwner();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // пошукові параметри орендара
  async getInfo(): Promise<any> {
    this.loading = true;

    localStorage.removeItem('searchInfoUserData')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(this.serverPath + '/features/get', { auth: JSON.parse(userJson) })
        .subscribe(async (response: any) => {
          localStorage.setItem('searchInfoUserData', JSON.stringify(response.inf));
          const searchInfoUserData = localStorage.getItem('searchInfoUserData');
          if (searchInfoUserData !== null) {
            this.searchInfoUserData = JSON.parse(searchInfoUserData);
            // console.log(this.searchInfoUserData)
            this.userInfo.price_of = this.searchInfoUserData.price_of === "0.01" ? -1 : this.searchInfoUserData.price_of;
            this.userInfo.price_to = this.searchInfoUserData.price_to === "0.01" ? -1 : this.searchInfoUserData.price_to;
            this.userInfo.region = this.searchInfoUserData.region;
            this.userInfo.city = this.searchInfoUserData.city;
            this.userInfo.rooms_of = this.searchInfoUserData.rooms_of;
            this.userInfo.rooms_to = this.searchInfoUserData.rooms_to;
            this.userInfo.area_of = this.searchInfoUserData.area_of === "0.00" ? '' : this.searchInfoUserData.area_of;
            this.userInfo.area_to = this.searchInfoUserData.area_to === "100000.00" ? '' : this.searchInfoUserData.area_to;
            this.userInfo.repair_status = this.searchInfoUserData.repair_status;
            this.userInfo.bunker = this.searchInfoUserData.bunker;
            this.userInfo.balcony = this.searchInfoUserData.balcony;
            this.userInfo.animals = this.searchInfoUserData.animals;
            this.userInfo.distance_metro = this.searchInfoUserData.distance_metro;
            this.userInfo.distance_stop = this.searchInfoUserData.distance_stop;
            this.userInfo.distance_green = this.searchInfoUserData.distance_green;
            this.userInfo.distance_shop = this.searchInfoUserData.distance_shop;
            this.userInfo.distance_parking = this.searchInfoUserData.distance_parking;
            this.userInfo.option_pay = this.searchInfoUserData.option_pay;
            this.userInfo.day_counts = this.searchInfoUserData.day_counts;
            this.userInfo.purpose_rent = this.searchInfoUserData.purpose_rent;
            this.userInfo.house = this.searchInfoUserData.house;
            this.userInfo.flat = this.searchInfoUserData.flat;
            this.userInfo.room = this.searchInfoUserData.room;
            this.userInfo.looking_woman = this.searchInfoUserData.looking_woman;
            this.userInfo.looking_man = this.searchInfoUserData.looking_man;
            this.userInfo.agree_search = this.searchInfoUserData.agree_search;
            this.userInfo.students = this.searchInfoUserData.students;
            this.userInfo.woman = this.searchInfoUserData.woman;
            this.userInfo.man = this.searchInfoUserData.man;
            this.userInfo.family = this.searchInfoUserData.family;
            this.userInfo.days = this.searchInfoUserData.days;
            this.userInfo.weeks = this.searchInfoUserData.weeks;
            this.userInfo.mounths = this.searchInfoUserData.mounths;
            this.userInfo.years = this.searchInfoUserData.years;
            this.userInfo.about = this.searchInfoUserData.about;
            await this.calculateTotalDays()
          } else {
            this.searchInfoUserData = {};
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      // console.log('user not found');
    }
  }

  useDefaultImage(event: any): void {
    event.target.src = '../../../../assets/user_default.svg';
  }

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

  logout() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    this.sharedService.setStatusMessage('Виходимо з аккаунту');
    setTimeout(() => {
      this.loading = true;
      this.sharedService.setStatusMessage('');
      setTimeout(() => {
        location.reload();
      }, 1500);
    }, 1500);
  }

}
