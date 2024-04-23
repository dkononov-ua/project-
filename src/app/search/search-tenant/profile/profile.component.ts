import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { FilterUserService } from '../../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { GestureService } from 'src/app/services/gesture.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA' },],
  animations: [
    trigger('cardSwipe', [
      transition('void => *', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('left => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(-100%)' })),
      ]),
      transition('right => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ]
})

export class ProfileComponent implements OnInit {

  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;
  // шляхи до серверу
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  // рейтинг орендара
  ratingTenant: number | undefined;
  // параметри користувача
  isSubscribed: boolean = false;
  subscriptionMessage: string | undefined;
  userInfo: UserInfo[] = [];
  filteredUsers: UserInfo[] | undefined;
  selectedUser: UserInfo | any;
  // параметри оселі
  selectedFlatId!: string | null;
  // статуси
  currentCardIndex: number = 0;
  subscriptionStatus: any;
  statusMessage: any;
  loading = true;
  optionsFound: number = 0;
  card_info: number = 0;
  indexPage: number = 1;
  numberOfReviews: any;
  totalDays: any;
  reviews: any;
  cardSwipeState: string = '';
  cardDirection: string = 'Discussio';
  card1: boolean = true;
  card2: boolean = false;
  startX = 0;
  isLoadingImg: boolean = false;

  constructor(
    private filterService: FilterUserService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getSelectedFlat();
    this.getUser();
  }

  getUser() {
    this.filterService.user$.subscribe(user => {
      // console.log(house);
      if (user) {
        this.selectUser(user);
      }
    });
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }

  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'left') {
      this.cardDirection = 'Наступна';
      this.cardSwipeState = 'left';
      setTimeout(() => {
        this.card1 = !this.card1;
        this.card2 = !this.card2;
        this.onNextCard();
        this.cardSwipeState = 'endLeft';
        setTimeout(() => {
          this.cardDirection = '';
        }, 590);
      }, 10);
    } else {
      this.cardDirection = 'Попередня';
      this.cardSwipeState = 'right';
      setTimeout(() => {
        this.card1 = !this.card1;
        this.card2 = !this.card2;
        this.onPrevCard();
        this.cardSwipeState = 'endRight';
        setTimeout(() => {
          this.cardDirection = '';
        }, 590);
      }, 10);
    }
  }

  toggleIndexPage() {
    if (this.indexPage === 1) {
      this.indexPage = 2;
    } else {
      this.indexPage = 1;
    }
  }

  async getSelectedFlat() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getSearchInfo();
      } else {
        console.log('Немає обраної оселі')
        this.loading = false;
      }
    });
  }

  async getSearchInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.filterService.filterChange$.subscribe(async () => {
        const filterValue = this.filterService.getFilterValue();
        const optionsFound = this.filterService.getOptionsFound();
        if (filterValue && optionsFound && optionsFound !== 0) {
          this.getFilteredData(filterValue, optionsFound);
        } else {
          this.getFilteredData(undefined, 0);
        }
      })
    } else {
      console.log('Авторизуйтесь')
    }
  }

  getFilteredData(filterValue: any, optionsFound: number) {
    if (filterValue) {
      this.filteredUsers = filterValue;
      this.optionsFound = optionsFound;
      // this.selectedUser = this.filteredUsers![0];
      this.loading = false;
    } else {
      this.optionsFound = 0;
      this.filteredUsers = undefined;
      this.selectedUser = undefined;
      this.loading = false;
    }
  }

  selectUser(user: UserInfo) {
    this.reviews = [];
    this.indexPage = 1;
    this.currentCardIndex = this.filteredUsers!.indexOf(user);
    this.selectedUser = user;
    this.getRating(this.selectedUser)
    this.checkSubscribe();
    this.calculateTotalDays()
  }

  onPrevCard() {
    this.reviews = [];
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
    this.selectedUser = this.filteredUsers![this.currentCardIndex];
    this.getRating(this.selectedUser)
    this.checkSubscribe();
    this.calculateTotalDays()
  }

  onNextCard() {
    this.reviews = [];
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
    this.selectedUser = this.filteredUsers![this.currentCardIndex];
    this.getRating(this.selectedUser)
    this.checkSubscribe();
    this.calculateTotalDays()
  }

  private calculateCardIndex(index: number): number {
    const length = this.filteredUsers?.length || 0;
    return (index + length) % length;
  }

  calculateTotalDays(): number {
    const days = this.selectedUser.days || 0;
    const weeks = this.selectedUser.weeks || 0;
    const months = this.selectedUser.months || 0;
    const years = this.selectedUser.years || 0;
    const totalDays = days + weeks * 7 + months * 30 + years * 365;
    this.totalDays = totalDays;
    return totalDays;
  }

  // Підписуюсь
  async getSubscribe(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedUser.user_id && this.selectedFlatId) {
      const data = { auth: JSON.parse(userJson), user_id: this.selectedUser.user_id, flat_id: this.selectedFlatId };
      try {
        const response: any = await this.http.post(serverPath + '/usersubs/subscribe', data).toPromise();
        // console.log(response)
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 0;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 1;
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Перевіряю підписку
  async checkSubscribe(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedUser.user_id && this.selectedFlatId) {
      const data = { auth: JSON.parse(userJson), user_id: this.selectedUser.user_id, flat_id: this.selectedFlatId };
      try {
        const response: any = await this.http.post(serverPath + '/usersubs/checkSubscribe', data).toPromise();
        // console.log(response.status)
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 0;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 1;
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      // Обробка результату в компоненті
      if (result.status === true) {
        this.statusMessage = 'Скаргу надіслано';
        setTimeout(() => {
          this.statusMessage = '';
        }, 2000);
      } else {
        this.statusMessage = 'Помилка';
        setTimeout(() => {
          this.statusMessage = '';
        }, 2000);
      }
    });
  }

  async getRating(selectedUser: any): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      if (response && Array.isArray(response.status)) {
        this.reviews = response.status;
        let totalMarkTenant = 0;
        this.numberOfReviews = response.status.length;
        response.status.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkTenant += item.info.mark;
          }
        });
        // Після того як всі оцінки додані, ділимо загальну суму на кількість оцінок
        if (this.numberOfReviews > 0) {
          this.ratingTenant = totalMarkTenant / this.numberOfReviews;
        } else {
          this.ratingTenant = 0;
        }
        // console.log('Кількість відгуків:', this.numberOfReviews);
      } else {
        this.reviews = undefined;
        this.numberOfReviews = 0;
        this.ratingTenant = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }


}

