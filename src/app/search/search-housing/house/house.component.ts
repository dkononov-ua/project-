import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from '../../filter.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/shared/server-config';

interface FlatInfo {
  region: string;
  city: string;
  rooms: string;
  area: string;
  repair_status: string;
  selectedKitchen_area: string;
  balcony: string;
  bunker: string;
  animals: string;
  distance_metro: string;
  distance_stop: string;
  distance_green: string;
  distance_shop: string;
  distance_parking: string;
  limit: string;
  country: string;
  price: any;
  price_m: any;
  id: number;
  name: string;
  photos: string[];
  img: string;
  about: string;
  apartment: string;
  family: string;
  flat_id: string;
  flat_index: string;
  floor: string;
  houseNumber: string;
  kitchen_area: string;
  man: string;
  metro: string;
  price_y: string;
  street: string;
  students: string;
  woman: string;
  option_pay: number;
}
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

  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  path_logo = path_logo;
  loading = true;

  offs: number = 0;
  pageEvent: PageEvent = {
    length: 0,
    pageSize: 5,
    pageIndex: 0
  };

  isSubscribed: boolean = false;
  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  subscriptionMessageTimeout: Subject<void> = new Subject<void>();

  private filterSubscription: Subscription | undefined;
  flatInfo: FlatInfo[] = [];
  filteredFlats: FlatInfo[] | undefined;
  selectedFlat: FlatInfo | any;
  flatImages: any[] = [];
  selectedFlatPhotos: string[] = [];
  currentPhotoIndex: number = 0;
  isCarouselAnimating!: boolean;
  limit: number = 0;
  additionalLoadLimit: number = 5;
  localStorageKey!: string;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  currentCardIndex: number = 0;
  locationLink: any = '';
  location: string | null = null;
  selectedFlatRegion: string = '';
  selectedFlatCity: string = '';
  selectedFlatStreet: string = '';
  selectedFlatHouseNumber: string = '';
  selectedFlatFlatIndex: string = '';
  optionsFound: number = 0;

  options: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Новий',
    2: 'Добрий',
    3: 'Задовільний',
    4: 'Поганий',
    5: 'Класичний балкон',
    6: 'Французький балкон',
    7: 'Лоджія',
    8: 'Тераса',
    9: 'Веранда',
  }

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    5: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  checkBox: { [key: number]: string } = {
    0: 'Вибір не зроблено',
    1: 'Так',
    2: 'Ні',
  }

  option_pay: { [key: number]: string } = {
    0: 'Щомісяця',
    1: 'Подобово',
  }

  animals: { [key: number]: string } = {
    0: 'Без тварин',
    1: 'Можна з тваринами',
    2: 'Тільки котики',
    3: 'Тільки песики',
  }

  statusSubscriptionMessage: boolean | undefined;
  statusMessage: any;

  openCard: boolean = false;
  hideCard: boolean = true;
  openMenu: boolean = true;
  hideMenu: boolean = false;

  indexPage: number = 1;
  card_info : boolean = false;

  openInfoUser () {
    this.card_info = true;
  }


  opensCard() {
    this.openCard = !this.openCard;
    this.hideCard = !this.hideCard;

    this.openMenu = !this.openMenu;
    this.hideMenu = !this.hideMenu;
  }

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.getSearchInfo()
  }

  async getSearchInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.filterSubscription = this.filterService.filterChange$.subscribe(async () => {
        const filterValue = this.filterService.getFilterValue();
        const optionsFound = this.filterService.getOptionsFound();
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

  selectFlat(flat: FlatInfo) {
    this.currentPhotoIndex = 0;
    this.indexPage = 2;
    this.currentCardIndex = this.filteredFlats!.indexOf(flat);
    this.selectedFlat = flat;
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  onPrevCard() {
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.checkSubscribe();
    this.generateLocationUrl();
  }

  onNextCard() {
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
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

    const dialogRef = this.dialog.open(PhotoGalleryComponent, {
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

  openMap () {
    window.open(this.locationLink, '_blank');
  }

  checkSubscribe(): void {
    const selectedFlat = this.selectedFlat.flat_id;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const payload = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      this.http.post(serverPath + '/subs/checkSubscribe', payload)
        .subscribe((response: any) => {
          this.statusMessage = response.status;
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
}

