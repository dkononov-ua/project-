import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { FilterUserService } from '../../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/shared/server-config';
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
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('1500ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('1400ms 300ms ease-in-out', style({ transform: 'translateX(0)' }))
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

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

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
    3: 'Навчання',
    4: 'Особисті причини',
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

  openCard: boolean = false;
  hideCard: boolean = true;
  openMenu: boolean = true;
  hideMenu: boolean = false;

  opensCard () {
    this.openCard = !this.openCard;
    this.hideCard = !this.hideCard;

    this.openMenu = !this.openMenu;
    this.hideMenu = !this.hideMenu;
  }

  constructor(
    private filterService: FilterUserService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService
  ) {
    this.filterForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getSelectedFlat();
  }

  getSelectedFlat() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId !== null) {
        this.getSearchInfo();
      } else {
        console.log('Немає обраної оселі')
      }
    });
  }

  getSearchInfo() {
    this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
      const filterValue = this.filterService.getFilterValue();
      if (filterValue) {
        this.selectedUser = null;
        this.updateFilteredData(filterValue);
        this.selectedUser = this.filteredUsers![0];
        this.checkSubscribe();
      }
    });
  }

  selectUser(user: UserInfo) {
    this.selectedUser = this.filteredUsers![0];
    this.selectedUser = user;
    setTimeout(() => {
      this.checkSubscribe();
    }, 50);
  }

  updateFilteredData(filterValue: any) {
    this.filterForm.patchValue(filterValue);
    this.filteredUsers = filterValue;
    this.selectedUser = this.filteredUsers![this.currentCardIndex];
    this.updateSelectedUser;
  }

  private updateSelectedUser() {
    this.selectedUser = this.filteredUsers![this.currentCardIndex];
    this.checkSubscribe();
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

  onSubmitSbs(): void {
    const selectedFlatID = this.selectedFlatId;
    const selectedUserID = this.selectedUser.user_id;
    const userJson = localStorage.getItem('user');

    if (userJson) {
      const data = { auth: JSON.parse(userJson), user_id: selectedUserID, flat_id: selectedFlatID };
      this.http.post(serverPath + '/usersubs/subscribe', data)
        .subscribe((response: any) => {
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
      this.http.post(serverPath + '/usersubs/checkSubscribe', data)
        .subscribe((response: any) => {
          this.statusMessage = response.status;
          this.isSubscribed = true;
          if (this.statusMessage === 'Ви успішно відписались') {
            this.isSubscribed = false;
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
