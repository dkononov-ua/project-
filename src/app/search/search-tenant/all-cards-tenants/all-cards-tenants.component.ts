import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { FilterUserService } from '../../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { purpose, aboutDistance, option_pay, animals } from 'src/app/data/search-param';
import { UserInfo } from 'src/app/interface/info';
import { GestureService } from 'src/app/services/gesture.service';
import { animations } from '../../../interface/animation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-cards-tenants',
  templateUrl: './all-cards-tenants.component.html',
  styleUrls: ['./all-cards-tenants.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA' },],
  animations: [
    animations.right2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
    animations.top,
  ],
})

export class AllCardsTenantsComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  shownCard: string | undefined;
  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;
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
  indexPage: number = 0;
  numberOfReviews: any;
  totalDays: any;
  reviews: any;
  cardSwipeState: string = '';
  cardDirection: string = 'Discussio';
  card1: boolean = true;
  card2: boolean = false;
  startX = 0;
  isLoadingImg: boolean = false;
  @ViewChild('findCards') findCardsElement!: ElementRef;
  authorizationHouse: boolean = false;

  constructor(
    private filterService: FilterUserService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private sharedService: SharedService,
    private router: Router,
    private filterUserService: FilterUserService,

  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectedFlat();
    this.getShowedCards();
  }

  getShowedCards() {
    this.filterUserService.showedCards$.subscribe(showedCards => {
      if (showedCards !== '') {
        this.shownCard = showedCards;
      }
    });
  }

  onScroll(event: Event): void {
    const element = this.findCardsElement.nativeElement;
    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atTop) {
      // console.log(atTop)
      // this.filterService.loadCards('prev')
    } else if (atBottom) {
      // console.log(atBottom)
      this.filterService.loadCards('next')
    }
  }

  async getSelectedFlat() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (!this.selectedFlatId) {
        this.authorizationHouse = false;
      } else {
        this.authorizationHouse = true;
      }
      this.getSearchInfo();
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
      // console.log(this.filteredUsers)
      this.optionsFound = optionsFound;
      if (!this.selectedUser) {
        this.selectedUser = this.filteredUsers![0];
      }
      this.loading = false;
    } else {
      this.optionsFound = 0;
      this.filteredUsers = undefined;
      this.selectedUser = undefined;
      this.loading = false;
    }
  }

  selectUser(user: UserInfo) {
    this.selectedUser = user;
    // console.log(user)
    this.filterService.pickUser(user);
    this.router.navigate(['/search-tenants/tenants']);
  }

  private calculateCardIndex(index: number): number {
    const length = this.filteredUsers?.length || 0;
    return (index + length) % length;
  }











}


