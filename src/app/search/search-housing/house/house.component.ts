import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FilterService } from '../../filter.service';
import { HouseInfo } from 'src/app/interface/info';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals, options, checkBox } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { GestureService } from 'src/app/services/gesture.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardSwipe', [
      transition('void => *', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('left => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
      transition('right => *', [
        style({ transform: 'translateX(0%)' }),
        animate('600ms 0ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ]
})

export class HouseComponent implements OnInit {

  // розшифровка пошукових параметрів
  purpose = purpose;
  aboutDistance = aboutDistance;
  option_pay = option_pay;
  animals = animals;
  options = options;
  checkBox = checkBox;
  // шляхи до серверу
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  // пагінатор
  offs = PaginationConfig.offs;
  optionsFound = PaginationConfig.counterFound;
  currentPage = PaginationConfig.currentPage;
  totalPages = PaginationConfig.totalPages;
  pageEvent = PaginationConfig.pageEvent;
  // параметри оселі
  filteredFlats: HouseInfo[] | undefined;
  selectedFlat: HouseInfo | any;
  locationLink: any = '';
  currentCardIndex: number = 0;
  currentPhotoIndex: number = 0;
  // статуси
  loading = true;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  statusSubscriptionMessage: boolean | undefined;
  subscriptionStatus: any;
  statusMessage: any;
  indexPage: number = 1;
  reviews: any;
  numberOfReviews: any;
  ratingOwner: number | undefined;
  isCopiedMessage!: string;
  cardSwipeState: string = '';
  cardDirection: string = 'Discussio';
  card1: boolean = true;
  card2: boolean = false;
  startX = 0;
  photoViewing: boolean = false;
  isLoadingImg: boolean = false;

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private sharedService: SharedService,
  ) {  }

  ngOnInit(): void {
    this.getSearchInfo();
    this.getHouse()
  }

  getHouse() {
    this.filterService.house$.subscribe(house => {
      // console.log(house);
      if (house) {
        this.selectFlat(house);
      }
    });
  }

  selectFlat(flat: HouseInfo) {
    this.reviews = [];
    this.currentPhotoIndex = 0;
    this.indexPage = 1;
    this.currentCardIndex = this.filteredFlats!.indexOf(flat);
    this.selectedFlat = flat;
    this.getRating(this.selectedFlat)
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  onPanStartImg(event: any): void {
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

  onPanEndImg(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwipedImg('right');
      } else {
        this.onSwipedImg('left');
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
  // оброблюю свайп фото
  onSwipedImg(direction: string | undefined): void {
    if (direction === 'right') {
      this.prevPhoto();
    } else {
      this.nextPhoto();
    }
  }

  toggleIndexPage() {
    if (this.indexPage === 1) {
      this.indexPage = 2;
    } else {
      this.indexPage = 1;
    }
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
      this.filteredFlats = filterValue;
      this.optionsFound = optionsFound;
      // this.selectedFlat = this.filteredFlats![0];
      // this.locationLink = this.generateLocationUrl();
      // this.checkSubscribe();
      this.loading = false;
    } else {
      this.optionsFound = 0;
      this.filteredFlats = undefined;
      this.selectedFlat = undefined;
      this.loading = false;
    }
  }

  onPrevCard() {
    this.reviews = [];
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.getRating(this.selectedFlat)
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  onNextCard() {
    this.reviews = [];
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.getRating(this.selectedFlat)
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  prevPhoto() {
    const length = this.selectedFlat.img?.length || 0;
    if (this.currentPhotoIndex !== 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    const length = this.selectedFlat.img?.length || 0;
    if (this.currentPhotoIndex < length) {
      this.currentPhotoIndex++;
    }
  }

  calculateCardIndex(index: number): number {
    const length = this.filteredFlats?.length || 0;
    return (index + length) % length;
  }

  async generateLocationUrl() {
    let locationUrl = '';
    if (this.selectedFlat && this.selectedFlat.region) {
      const baseUrl = 'https://www.google.com/maps/place/';
      const region = this.selectedFlat.region || '';
      const city = this.selectedFlat.city || '';
      const street = this.selectedFlat.street || '';
      const houseNumber = this.selectedFlat.houseNumber || '';
      const flatIndex = this.selectedFlat.flatIndex || '';
      const encodedRegion = encodeURIComponent(region);
      const encodedCity = encodeURIComponent(city);
      const encodedStreet = encodeURIComponent(street);
      const encodedHouseNumber = encodeURIComponent(houseNumber);
      const encodedFlatIndex = encodeURIComponent(flatIndex);
      locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
      this.locationLink = locationUrl;
      return locationUrl;
    } else {
      this.locationLink = null;
      return locationUrl;
    }
  }

  // Підписуюсь
  async getSubscribe(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlat.flat_id) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlat.flat_id };
      try {
        const response: any = await this.http.post(serverPath + '/subs/subscribe', data).toPromise();
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

  openMap() { window.open(this.locationLink, '_blank'); }

  // Перевіряю підписку
  async checkSubscribe(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlat.flat_id) {
      const data = { auth: JSON.parse(userJson), flat_id: this.selectedFlat.flat_id };
      try {
        const response: any = await this.http.post(serverPath + '/subs/checkSubscribe', data).toPromise();
        // console.log(response.status)
        if (response.status === 'Ви успішно відписались') {
          this.subscriptionStatus = 1;
        } else if (response.status === 'Ви в дискусії') {
          this.subscriptionStatus = 2;
        } else {
          this.subscriptionStatus = 0;
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

  // скарга на оселю
  async reportHouse(flat: any): Promise<void> {
    this.sharedService.reportHouse(flat);
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

  // отримую рейтинг власника оселі
  async getRating(selectedFlat: any): Promise<any> {
    if (selectedFlat && Array.isArray(selectedFlat.rating)) {
      let totalMarkOwner = 0;
      this.numberOfReviews = selectedFlat.rating.length;
      selectedFlat.rating.forEach((item: { mark: number }) => {
        if (item.mark) {
          this.reviews = selectedFlat.rating;
          totalMarkOwner += item.mark;
          this.ratingOwner = totalMarkOwner;
        }
      });
      if (this.numberOfReviews > 0) {
        this.ratingOwner = totalMarkOwner / this.numberOfReviews;
      } else {
        this.ratingOwner = 0;
      }
    } else {
      this.ratingOwner = 0;
      this.numberOfReviews = 0;
    }
  }
}

