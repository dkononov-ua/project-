import { regions } from '../../data/data-city';
import { cities } from '../../data/data-city';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FilterUserService } from '../filter-user.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { PageEvent } from '@angular/material/paginator';
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';
import { UserConfig } from '../../interface/param-config'
import { UserInfoSearch } from '../../interface/info'
import { animations } from '../../interface/animation';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { CounterService } from 'src/app/services/counter.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-search-tenant',
  templateUrl: './search-tenant.component.html',
  styleUrls: ['../search.term.scss'],
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

export class SearchTenantComponent implements OnInit {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // пагінатор
  offs = PaginationConfig.offs;
  optionsFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;

  userInfo: UserInfoSearch = UserConfig;

  filteredCities: any[] | undefined;
  filteredRegions: any[] | undefined;
  selectedRegion!: string;
  selectedCity!: string;
  regions = regions;
  cities = cities;
  minValue: number = 0;
  maxValue: number = 100000;
  loading = true;
  timer: any;
  searchQuery: string | undefined;
  minValueDays: number = 0;
  maxValueDays: number = 31;
  minValueWeeks: number = 0;
  maxValueWeeks: number = 4;
  minValueMonths: number = 0;
  maxValueMonths: number = 11;
  minValueYears: number = 0;
  maxValueYears: number = 5;
  minValueKitchen: number = 0;
  maxValueKitchen: number = 100;
  minValueFloor: number = -3;
  maxValueFloor: number = 47;
  isSearchTermCollapsed: boolean = false;
  filteredUsers!: [any];
  searchTimer: any;
  flats: any[] | undefined;
  flatInfo: any[] | undefined;
  filteredFlats?: any;
  selectedFlatId!: string | null;
  houseData: any;
  filter_group: number = 1;
  openUser: boolean = false;
  acces_subs: number = 1;

  card_info: number = 0;
  indexPage: number = 1;
  shownCard: any;
  myData: boolean = false;
  startX = 0;
  blockBtnStatus: boolean = false;
  authorizationHouse: boolean = false;
  filterSwitchNext() {
    if (this.filter_group < 4) {
      this.filter_group++;
    }
  }

  filterSwitchPrev() {
    if (this.filter_group > 1) {
      this.filter_group--;
    }
  }

  calculateTotalDays(): number {
    const days = this.userInfo.days || 0;
    const weeks = this.userInfo.weeks || 0;
    const months = this.userInfo.months || 0;
    const years = this.userInfo.years || 0;
    const totalDays = days + weeks * 7 + months * 30 + years * 365;
    return totalDays;
  }

  saveDayCounts(): void {
    const totalDays = this.calculateTotalDays();
    this.userInfo.day_counts = totalDays > 0 ? totalDays.toString() : '';
  }

  onDayCountsChange(): void {
    this.saveDayCounts();
  }

  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }
  counterHouseSubscriptions: any;

  isMobile = false;
  filterValue: string = '';
  goBack(): void {
    this.location.back();
  }
  constructor(
    private filterUserService: FilterUserService,
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private counterService: CounterService,
    private sharedService: SharedService,
  ) {
    this.getBtnStatus();
    this.getSelectedFlatId();
    this.getHouseAcces();
  }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    // перевірка який пристрій
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.getSearchInfo();
    this.getShowedCards();
    this.loading = false;
  }

  getSelectedFlatId() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (!this.selectedFlatId) {
        this.authorizationHouse = false;
      } else {
        this.authorizationHouse = true;
      }
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

  // перевірка на доступи якщо немає необхідних доступів приховую розділи меню
  async getHouseAcces(): Promise<void> {
    this.houseData = localStorage.getItem('houseData');
    if (this.houseData) {
      const parsedHouseData = JSON.parse(this.houseData);
      this.houseData = parsedHouseData;
      // console.log(this.houseData)
      if (this.houseData.acces) {
        this.acces_subs = this.houseData.acces.acces_subs;
      } else {
        await this.getHouseSubscriptionsCount();
      }
    } else {
      this.acces_subs = 0
    }
  }

  async getSearchInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.filterUserService.filterChange$.subscribe(async () => {
        const optionsFound = this.filterUserService.getOptionsFound();
        if (optionsFound && optionsFound !== 0) {
          this.optionsFound = optionsFound;
          this.filterUserService.blockBtn(false)
        } else {
          this.optionsFound = Number(optionsFound);
        }
      })
    } else {
      console.log('Авторизуйтесь')
    }
  }

  getBtnStatus() {
    this.filterUserService.blockBtnStatus$.subscribe(blockBtnStatus => {
      this.blockBtnStatus = blockBtnStatus;
      // console.log(this.blockBtnStatus)
    });
  }

  getShowedCards() {
    this.filterUserService.showedCards$.subscribe(showedCards => {
      if (showedCards !== '') {
        this.shownCard = showedCards;
      }
    });
  }

  onSortSelected(value: string) {
    this.filterValue = value;
    this.router.navigate(['/search-tenants/all-cards']);
    this.filterUserService.sortTenants(value)
  }

}

