import { Component, ElementRef, LOCALE_ID, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FilterService } from '../../filter.service';
import { HouseInfo } from 'src/app/interface/info';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import * as ServerConfig from 'src/app/config/path-config';
import { PaginationConfig } from 'src/app/config/paginator';
import { GestureService } from 'src/app/services/gesture.service';
import { animations } from '../../../interface/animation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-cards',
  templateUrl: './all-cards.component.html',
  styleUrls: ['./all-cards.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
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

export class AllCardsComponent implements OnInit {

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
  // параметри оселі
  filteredFlats: HouseInfo[] | undefined;
  selectedFlat: HouseInfo | any;
  // статуси
  loading = true;
  statusMessage: any;
  indexPage: number = 0;
  isLoadingImg: boolean = false;

  lastScrollTop = 0;
  shownCard: string | undefined;

  @ViewChild('findCards') findCardsElement!: ElementRef;
  authorization: boolean = false;


  constructor(
    private filterService: FilterService,
    private sharedService: SharedService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSearchInfo();
    this.getShowedCards();
  }

  getShowedCards() {
    this.filterService.showedCards$.subscribe(showedCards => {
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

  async getSearchInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
    this.filterService.filterChange$.subscribe(async () => {
      const filterValue = this.filterService.getFilterValue();
      const optionsFound = this.filterService.getOptionsFound();
      if (filterValue && optionsFound && optionsFound !== 0) {
        this.getFilteredData(filterValue, optionsFound);
      } else {
        this.getFilteredData(undefined, 0);
      }
    })
  }

  getFilteredData(filterValue: any, optionsFound: number) {
    if (filterValue) {
      this.filteredFlats = filterValue;
      this.optionsFound = optionsFound;
      this.loading = false;
    } else {
      this.optionsFound = 0;
      this.filteredFlats = undefined;
      this.selectedFlat = undefined;
      this.loading = false;
    }
  }

  selectFlat(flat: HouseInfo) {
    this.selectedFlat = flat;
    this.filterService.pickHouse(flat);
    this.router.navigate(['/search-house/house']);
  }

  calculateCardIndex(index: number): number {
    const length = this.filteredFlats?.length || 0;
    return (index + length) % length;
  }
}


