import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from '../../filter.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  selector: 'app-housing-search',
  templateUrl: './housing-search.component.html',
  styleUrls: ['./housing-search.component.scss'],
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

export class HousingSearchComponent implements OnInit {
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

  aboutDistance: { [key: number]: string } = {
    0: 'Немає',
    5: 'На території будинку',
    100: '100м',
    300: '300м',
    500: '500м',
    1000: '1км',
  }

  statusSubscriptionMessage: boolean | undefined;
  statusMessage: any;

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit(): void {
    this.subscriptionMessageTimeout.subscribe(() => {
      setTimeout(() => {
        this.subscriptionMessage = undefined;
      }, 2000);
    });

    this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
      const filterValue = this.filterService.getFilterValue();
      if (filterValue) {
        this.getFilteredData(filterValue);
      }
    });

    if (this.filteredFlats && this.filteredFlats.length > 0) {
      this.selectedFlat = this.filteredFlats[this.currentCardIndex];
      this.locationLink = this.generateLocationUrl();
    }
  }

  getFilteredData(filterValue: any) {
    this.filteredFlats = filterValue;
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
  }

  selectFlat(flat: FlatInfo) {
    this.selectedFlat = flat;
    this.currentPhotoIndex = 0;
    this.currentCardIndex = this.filteredFlats!.indexOf(flat);
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

  loadMore(): void {
    this.limit += 5
    const url = `http://localhost:3000/search/flat?limit=${this.limit}`;
    this.http.get<{ flat_inf: FlatInfo[], flat_img: any[] }>(url).subscribe((data) => {
      const { flat_inf, flat_img } = data;
      if (flat_inf && flat_img) {
        flat_img.forEach((i) => {
          this.flatImages.push(i)
        })
        this.flatInfo = flat_inf;
        const additionalFlats = flat_inf;
        this.filteredFlats = [...this.filteredFlats!, ...additionalFlats];
      }
    });
  }

  openFullScreenImage(photos: string[]): void {
    const sanitizedPhotos: SafeUrl[] = photos.map(photo =>
      this.sanitizer.bypassSecurityTrustUrl('http://localhost:3000/img/flat/' + photo)
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

    if (this.selectedFlat) {
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
    }

    this.locationLink = locationUrl;
    return locationUrl;
  }

  onSubmitSbs(): void {
    const selectedFlat = this.selectedFlat.flat_id;
    const userJson = localStorage.getItem('user');

    if (userJson) {
      const payload = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      this.http.post('http://localhost:3000/subs/subscribe', payload)
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

  checkSubscribe(): void {
    const selectedFlat = this.selectedFlat.flat_id;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const payload = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      this.http.post('http://localhost:3000/subs/checkSubscribe', payload)
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
