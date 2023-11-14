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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(100%)' }))
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
  indexPage: number = 1;
  optionsFound: number = 0;

  card_info: boolean = false;
  openInfoUser() {
    this.card_info = true;
  }

  constructor(
    private filterService: FilterUserService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.getSelectedFlat();
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
      this.selectedUser = this.filteredUsers![0];
      this.loading = false;
    } else {
      this.optionsFound = 0;
      this.filteredUsers = undefined;
      this.selectedUser = undefined;
      this.loading = false;
    }
  }

  selectUser(user: UserInfo) {
    this.selectedUser = this.filteredUsers![0];
    this.selectedUser = user;
    this.checkSubscribe();
    this.indexPage = 2;
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
          this.subscriptionStatus = response.status;
          this.isSubscribed = true;
          if (this.subscriptionStatus === 'Ви успішно відписались') {
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
}

