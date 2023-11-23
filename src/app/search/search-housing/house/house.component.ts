import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FilterService } from '../../filter.service';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HouseInfo } from 'src/app/interface/info';
import { SharedService } from 'src/app/services/shared.service';

// власні імпорти інформації
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { purpose, aboutDistance, option_pay, animals, options, checkBox } from 'src/app/data/search-param';
import { PaginationConfig } from 'src/app/config/paginator';
import { GalleryComponent } from 'src/app/components/gallery/gallery.component';
@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
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
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  locationLink: any = '';
  currentCardIndex: number = 0;
  currentPhotoIndex: number = 0;

  // статуси
  loading = true;
  isSubscribed: boolean = false;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  statusSubscriptionMessage: boolean | undefined;
  subscriptionStatus: any;
  statusMessage: any;

  card_info: number = 0;
  indexPage: number = 1;
  reviews: any;
  numberOfReviews: any;
  ratingOwner: number | undefined;
  isCopiedMessage!: string;


  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getSearchInfo()
  }

  async getSearchInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.filterService.filterChange$.subscribe(async () => {
        const filterValue = this.filterService.getFilterValue();
        const optionsFound = this.filterService.getOptionsFound();
        this.card_info = this.filterService.getCardInfo();
        this.indexPage = this.filterService.getIndexPage();
        if (filterValue && optionsFound && optionsFound !== 0) {
          console.log(filterValue)
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
      this.selectedFlat = this.filteredFlats![0];
      this.locationLink = this.generateLocationUrl();
      this.checkSubscribe();
      this.loading = false;
    } else {
      this.optionsFound = 0;
      this.filteredFlats = undefined;
      this.selectedFlat = undefined;
      this.loading = false;
    }
  }

  selectFlat(flat: HouseInfo) {
    this.currentPhotoIndex = 0;
    this.indexPage = 2;
    this.passIndexPage();
    this.currentCardIndex = this.filteredFlats!.indexOf(flat);
    this.selectedFlat = flat;
    this.getRating(this.selectedFlat)
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  // передача отриманих даних до сервісу а потім виведення на картки карток
  passIndexPage() {
    this.filterService.updatePage(this.card_info, this.indexPage);
  }

  onPrevCard() {
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.getRating(this.selectedFlat)
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  onNextCard() {
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.getRating(this.selectedFlat)
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  prevPhoto() {
    this.currentPhotoIndex--;
  }

  nextPhoto() {
    this.currentPhotoIndex++;
  }

  calculateCardIndex(index: number): number {
    const length = this.filteredFlats?.length || 0;
    return (index + length) % length;
  }

  openFullScreenImage(photos: string[]): void {
    const sanitizedPhotos: SafeUrl[] = photos.map(photo =>
      this.sanitizer.bypassSecurityTrustUrl(serverPath + '/img/flat/' + photo)
    );

    const dialogRef = this.dialog.open(GalleryComponent, {
      data: {
        photos: sanitizedPhotos,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  closeFullScreenImage(): void {
    this.showFullScreenImage = false;
    this.fullScreenImageUrl = '';
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

  onSubmitSbs(): void {
    const selectedFlat = this.selectedFlat.flat_id;
    const userJson = localStorage.getItem('user');

    if (userJson) {
      const payload = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      this.http.post(serverPath + '/subs/subscribe', payload)
        .subscribe((response: any) => {
          this.subscriptionMessage = response.status;
          this.isSubscribed = true;
          this.checkSubscribe();
          setTimeout(() => {
            this.showSubscriptionMessage = false;
          }, 2000);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  openMap() {
    window.open(this.locationLink, '_blank');
  }

  checkSubscribe(): void {
    const selectedFlat = this.selectedFlat.flat_id;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const payload = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      this.http.post(serverPath + '/subs/checkSubscribe', payload)
        .subscribe((response: any) => {
          this.subscriptionStatus = response.status;
          this.statusSubscriptionMessage = true;
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

  // скарга на оселю
  async reportHouse(flat: any): Promise<void> {
    console.log(flat)
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
    console.log(selectedFlat.rating);
    if (selectedFlat && Array.isArray(selectedFlat.rating)) {
      let totalMarkTenant = 0;
      this.numberOfReviews = selectedFlat.rating.length;
      selectedFlat.rating.forEach((item: { mark: number }) => {
        if (item.mark) {
          totalMarkTenant += item.mark;
          this.ratingOwner = totalMarkTenant;
          console.log(this.ratingOwner);
        }
      });

      console.log('Кількість відгуків:', this.numberOfReviews);
    } else if (selectedFlat.rating === false) {
      this.ratingOwner = 0;
    }
  }

}

