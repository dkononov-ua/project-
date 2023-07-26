import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FilterUserService } from '../../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';

interface UserInfo {
  animals: string | undefined;
  area_of: number | undefined;
  area_to: number | undefined;
  balcony: string | undefined;
  bunker: string | undefined;
  city: string | undefined;
  country: string | undefined;
  day_counts: number | undefined;
  days: number | undefined;
  distance_green: number | undefined;
  distance_metro: number | undefined;
  distance_parking: number | undefined;
  distance_shop: number | undefined;
  distance_stop: number | undefined;
  family: boolean | undefined;
  firstName: string | undefined;
  flat: string | undefined;
  house: string | undefined;
  img: string | undefined;
  lastName: string | undefined;
  looking_man: boolean | undefined;
  looking_woman: boolean | undefined;
  man: boolean | undefined;
  mounths: number | undefined;
  option_pay: number | undefined;
  price_of: number | undefined;
  price_to: number | undefined;
  purpose_rent: number | undefined;
  region: string | undefined;
  repair_status: string | undefined;
  room: boolean | undefined;
  rooms_of: number | undefined;
  rooms_to: number | undefined;
  students: boolean | undefined;
  user_id: string | undefined;
  weeks: number | undefined;
  woman: boolean | undefined;
  years: number | undefined;
}

@Component({
  selector: 'app-tenants-search',
  templateUrl: './tenants-search.component.html',
  styleUrls: ['./tenants-search.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('1500ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
  ]
})

export class TenantsSearchComponent implements OnInit {

  isSubscribed: boolean = false;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  subscriptionMessageTimeout: Subject<void> = new Subject<void>();
  private filterSubscription: Subscription | undefined;
  userInfo: UserInfo[] = [];
  filteredUsers: UserInfo[] | undefined;
  selectedUser: UserInfo | any;
  filterForm: FormGroup;
  limit: number = 0;
  additionalLoadLimit: number = 5;
  offset: number = 0;
  localStorageKey!: string;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  currentCardIndex: number = 0;
  cards: UserInfo[] = [];
  statusSubscriptionMessage: boolean | undefined;
  statusMessage: any;
  selectedFlatId!: string | null;


  purpose: { [key: number]: string } = {
    0: 'Переїзд',
    1: 'Відряджання',
    2: 'Подорож',
    3: 'Пожити в іншому місті',
    4: 'Навчання',
    5: 'Особисті причини',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    5: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
  }

  animals: { [key: number]: string } = {
    0: 'Без тварин',
    1: 'З котячими',
    2: 'З собачими',
    3: 'З собачими/котячими',
    4: 'Є багато різного',
    5: 'Щось цікавіше',
  }

  constructor(
    private filterService: FilterUserService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private selectedFlatService: SelectedFlatService
  ) {
    this.filterForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.subscriptionMessageTimeout.subscribe(() => {
          setTimeout(() => {
            this.subscriptionMessage = undefined;
          }, 2000);
        });

        this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
          const filterValue = this.filterService.getFilterValue();
          if (filterValue) {
            this.updateFilteredData(filterValue);
          }
        });
      }
    });
  }

  getDefaultImage(photo: string | undefined | null): string {
    if (!photo) {
      return 'http://localhost:3000/img/flat/housing_default.svg';
    } else {
      return this.getImageUrl(photo);
    }
  }

  selectUser(user: UserInfo) {
    this.selectedUser = this.filteredUsers![0];
    this.selectedUser = user;

    setTimeout(() => {
      this.checkSubscribe();
    }, 100);
  }

  updateFilteredData(filterValue: any) {
    this.filterForm.patchValue(filterValue);
    this.filteredUsers = filterValue;
  }

  getImageUrl(fileName: string | string[]): string {
    if (typeof fileName === 'string') {
      return 'http://localhost:3000/img/flat/' + fileName;
    } else if (Array.isArray(fileName) && fileName.length > 0) {
      return 'http://localhost:3000/img/flat/' + fileName[0];
    }
    return 'http://localhost:3000/img/flat/housing_default.svg';
  }

  private updateSelectedUser() {
    this.selectedUser = this.filteredUsers![this.currentCardIndex];
  }

  onPrevCard() {
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
    this.checkSubscribe();
    this.updateSelectedUser();
  }

  onNextCard() {
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
    this.checkSubscribe();
    this.updateSelectedUser();
  }


  private calculateCardIndex(index: number): number {
    const length = this.filteredUsers?.length || 0;
    return (index + length) % length;
  }

  loadMore(): void {
    this.limit += 5
    const url = `http://localhost:3000/search/user?limit=${this.limit}`;
    this.http.get<{ user_inf: UserInfo[] }>(url).subscribe((data) => {
      const { user_inf } = data;
      if (user_inf) {
        this.userInfo = user_inf;
        const additionalUsers = user_inf;
        this.filteredUsers = [...this.filteredUsers!, ...additionalUsers];
      }
    });
  }

  onSubmitSbs(): void {
    const selectedFlatID = this.selectedFlatId;
    const selectedUserID = this.selectedUser.user_id;
    const userJson = localStorage.getItem('user');

    if (userJson) {
      const data = { auth: JSON.parse(userJson), user_id: selectedUserID, flat_id: selectedFlatID };
      this.http.post('http://localhost:3000/usersubs/subscribe', data)
        .subscribe((response: any) => {
          console.log(response);
          this.subscriptionMessage = response.status;
          this.isSubscribed = true;
          this.checkSubscribe();
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  checkSubscribe(): void {
    const selectedFlatID = this.selectedFlatId;
    const selectedUserID = this.selectedUser.user_id;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const data = { auth: JSON.parse(userJson), user_id: selectedUserID, flat_id: selectedFlatID };
      this.http.post('http://localhost:3000/usersubs/checkSubscribe', data)
        .subscribe((response: any) => {
          console.log(response.status)

          this.statusMessage = response.status;
          this.statusSubscriptionMessage = true;
          console.log(this.statusMessage)

          if (response.status === 'Ви успішно відписались') {
            this.isSubscribed = true;
          } else {
            this.isSubscribed = false;
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

}
