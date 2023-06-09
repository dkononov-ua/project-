import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterService } from '../filter.service';
import { Observable, Subject } from 'rxjs';
declare const L: any;

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

export class HousingSearchComponent implements OnInit, AfterViewInit {
  isSubscribed: boolean = false;


  showSubscriptionMessage: boolean = false;
  subscriptionMessage: string | undefined;
  subscriptionMessageTimeout: Subject<void> = new Subject<void>();

  private filterSubscription: Subscription | undefined;
  flatInfo: FlatInfo[] = [];
  filteredFlats: FlatInfo[] | undefined;
  selectedFlat: FlatInfo | any;
  filterForm: FormGroup;
  flatImages: any[] = [];
  selectedFlatPhotos: string[] = [];
  currentFlatPhotos: string[] = [];
  currentPhotoIndex: number = 0;
  isCarouselAnimating!: boolean;
  limit: number = 0;
  additionalLoadLimit: number = 5;
  offset: number = 0;
  localStorageKey!: string;
  showFullScreenImage = false;
  fullScreenImageUrl = '';
  photoChangeData: any;
  currentCardIndex: number = 0;
  cards: FlatInfo[] = [];
  public locationLink: string = '';
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

  constructor(
    private filterService: FilterService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.filterForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.subscriptionMessageTimeout.subscribe(() => {
      setTimeout(() => {
        this.subscriptionMessage = undefined; // Очищення повідомлення
      }, 2000);
    });

    this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
      const filterValue = this.filterService.getFilterValue();
      if (filterValue) {
        this.updateFilteredData(filterValue);
      }
    });

    this.filterService.photoChange$.subscribe((data: any[]) => {
      this.photoChangeData = data;
      this.updateCardPhotos();
    });

    this.locationLink = this.generateLocationUrl();

  }

  ngAfterViewInit(): void {
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker: any;

    function onMapClick(e: { latlng: { toString: () => string; }; }) {
      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker(e.latlng).addTo(map)
        .bindPopup('Selected Location: ' + e.latlng.toString())
        .openPopup();
    }

    map.on('click', onMapClick);

  }

  private updateCardPhotos(): void {
    if (this.photoChangeData && this.photoChangeData.flat_img) {
      const filteredCards = this.filteredFlats;
      this.flatImages = [];
      this.photoChangeData.flat_img.forEach((i: any) => {
        this.flatImages.push(i);
      });
      this.flatInfo = this.photoChangeData.flat_inf;
    }
  }

  getDefaultImage(photo: string | undefined | null): string {
    if (!photo) {
      return 'http://localhost:3000/img/flat/housing_default.svg';
    } else {
      return this.getImageUrl(photo);
    }
  }

  updateSelectedFlatPhotos() {
    const selectedFlatId = this.selectedFlat?.flat_id;
    const selectedFlatImages = this.flatImages.find(flatImage => flatImage.flat_id === selectedFlatId)?.img || [];
    this.selectedFlatPhotos = selectedFlatImages;
  }

  updateCurrentPhotoIndex(index: number) {
    this.currentPhotoIndex = index;
  }

  selectFlat(flat: FlatInfo) {
    this.selectedFlat = this.filteredFlats![0];
    this.selectedFlat = flat;

    setTimeout(() => {
      this.updateSelectedFlatPhotos();
      this.updateCurrentPhotoIndex(0);

      this.currentFlatPhotos = [...this.selectedFlatPhotos];
      this.selectedFlatRegion = flat.region || '';
      this.selectedFlatCity = flat.city || '';
      this.selectedFlatStreet = flat.street || '';
      this.selectedFlatHouseNumber = flat.houseNumber || '';
      this.selectedFlatFlatIndex = flat.flat_index || '';
      this.locationLink = this.generateLocationUrl();
    }, 100);
  }

  updateFilteredData(filterValue: any) {
    this.filterForm.patchValue(filterValue);
    console.log(filterValue)
    this.filteredFlats = filterValue;
    this.updateSelectedFlatPhotos();
  }

  getFlatImageUrl(flat: FlatInfo): any {
    let imageUrl = '';

    const flatImage = this.flatImages.find(flatImage => flatImage.flat_id === flat.flat_id);
    if (flatImage) {
      if (!flatImage.img[0] === undefined === null) {
        imageUrl = 'http://localhost:3000/housing_default.svg';
      } else {
        imageUrl = this.getImageUrl(flatImage.img[0]);
      }
    }

    return imageUrl;
  }

  getImageUrl(fileName: string | string[]): string {
    if (typeof fileName === 'string') {
      return 'http://localhost:3000/img/flat/' + fileName;
    } else if (Array.isArray(fileName) && fileName.length > 0) {
      return 'http://localhost:3000/img/flat/' + fileName[0];
    }
    return 'http://localhost:3000/img/flat/housing_default.svg';
  }

  private updateSelectedFlat() {
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.updateSelectedFlatPhotos();
    this.currentFlatPhotos = [...this.selectedFlatPhotos];
    this.updateCurrentPhotoIndex(0);
  }

  onPrevCard() {
    if (!this.isCarouselAnimating) {
      this.isCarouselAnimating = true;
      this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);

      setTimeout(() => {
        this.updateSelectedFlat();
        this.updateCurrentPhotoIndex(0);
        this.currentFlatPhotos = [...this.selectedFlatPhotos];
        this.isCarouselAnimating = false;
      }, 100);
    }
  }

  onNextCard() {
    if (!this.isCarouselAnimating) {
      this.isCarouselAnimating = true;
      this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);

      setTimeout(() => {
        this.updateSelectedFlat();
        this.updateCurrentPhotoIndex(0);
        this.currentFlatPhotos = [...this.selectedFlatPhotos];
        this.isCarouselAnimating = false;
      }, 100);
    }
  }

  private calculateCardIndex(index: number): number {
    const length = this.filteredFlats?.length || 0;
    return (index + length) % length;
  }

  loadMore(): void {
    this.limit += 5
    const url = `http://localhost:3000/search/flat?limit=${this.limit}`;
    this.http.get<{ flat_inf: FlatInfo[], flat_img: any[] }>(url).subscribe((data) => {
      console.log(data)
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

  openFullScreenImage(imageUrl: string): void {
    this.showFullScreenImage = true;
    this.fullScreenImageUrl = imageUrl;
  }

  closeFullScreenImage(): void {
    this.showFullScreenImage = false;
    this.fullScreenImageUrl = '';
  }

  generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.selectedFlatRegion || '';
    const city = this.selectedFlatCity || '';
    const street = this.selectedFlatStreet || '';
    const houseNumber = this.selectedFlatHouseNumber || '';
    const flatIndex = this.selectedFlatFlatIndex || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);

    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;

    return locationUrl;
  }

  handleContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const carouselElement = document.getElementById('carouselExampleIndicators');

    if (!carouselElement?.contains(target)) {
      this.resetCarousel();
    }
  }

  resetCarousel() {
    const firstSlideIndicator = document.querySelector('#carouselExampleIndicators .carousel-indicators button');
    if (firstSlideIndicator) {
      (firstSlideIndicator as HTMLButtonElement).click();
    }
  }

  onSubmitSbs(): void {
    const selectedFlat = this.selectedFlat.flat_id;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const payload = { auth: JSON.parse(userJson), flat_id: selectedFlat };
      console.log(JSON.parse(userJson));
      console.log(selectedFlat);
      this.http.post('http://localhost:3000/subs/subscribe', payload)
        .subscribe((response: any) => {
          console.log(response);
          this.subscriptionMessage = response.status;
          this.showSubscriptionMessage = true;
          if (response.status === 'Ви успішно підписались') {
            this.isSubscribed = true; // Встановлюємо isSubscribed на true, якщо користувач підписаний
          } else if (response.status === 'Ви успішно відписались') {
            this.isSubscribed = false; // Встановлюємо isSubscribed на false, якщо користувач відписаний
          }
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



}
