import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterService } from './filter.service';

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
  id: number;
  name: string;
  photos: string[];
  img: string;
}

interface FlatImage {
  flat_id: string;
  img: string[];
}

interface Flat {
  flat_img: any;
}

interface FlatInfo {
  flat_id: number;
  flat_img: string;
}

@Component({
  selector: 'app-housing-search',
  templateUrl: './housing-search.component.html',
  styleUrls: ['./housing-search.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(130%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
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
  limit: number = 10;
  additionalLoadLimit: number = 5;
  offset: number = 0;
  localStorageKey!: string;


  constructor(
    private filterService: FilterService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.filterForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    const url = 'http://localhost:3000/search/flat';
    this.fetchFlatData(url);

    if (this.filterForm) {
      this.filterForm.valueChanges.subscribe(() => {
      });
    }

    this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
      const filterValue = this.filterService.getFilterValue();
      if (filterValue) {
        this.updateFilteredData(filterValue);
      }

    });

    const selectedFlat = localStorage.getItem(this.localStorageKey);
    if (selectedFlat) {
      this.selectedFlat = JSON.parse(selectedFlat) as FlatInfo; // Додано типізацію
      this.updateSelectedFlatPhotos();
    }
  }

  handleFilteredFlats(filterValue: FlatInfo[] | undefined) {
    console.log(filterValue);
    this.filteredFlats = filterValue;
    if (filterValue && filterValue.length > 0) {
      this.selectedFlat = filterValue[0];
    } else {
      this.selectedFlat = undefined;
    }
  }

  getDefaultImage(photo: string | undefined | null): string {
    if (!photo) {
      return 'http://localhost:3000/img/flat/housing_default.svg';
    } else {
      return this.getImageUrl(photo);
    }
  }

  fetchFlatData(url: string) {
    this.http.get<{ flat_inf: FlatInfo[], flat_img: any[] }>(url).subscribe((data) => {
      const { flat_inf, flat_img } = data;
      if (flat_inf && flat_img) {
        this.flatInfo = flat_inf;
        this.flatImages = flat_img;
        this.selectedFlat = this.flatInfo[0];
        this.updateSelectedFlatPhotos();
      }
    });
  }

  updateSelectedFlatPhotos() {
    const selectedFlatId = this.selectedFlat?.flat_id;
    const selectedFlatImages = this.flatImages.find(flatImage => flatImage.flat_id === selectedFlatId)?.img || [];
    this.selectedFlatPhotos = selectedFlatImages;
  }

  updateCurrentPhotoIndex(index: number) {
    this.currentPhotoIndex = index;
  }

  getFlatPhotos(flat: FlatInfo): string[] {
    console.log(flat.photos);
    return flat.photos || [];
  }

  selectFlat(flat: FlatInfo) {
    const selectedFlatId = this.selectedFlat?.flat_id;
    const selectedFlatImages = this.flatImages.find(flatImage => flatImage.flat_id === selectedFlatId)?.img || [];
    this.selectedFlatPhotos = selectedFlatImages;
    this.selectedFlat = flat;
    this.updateSelectedFlatPhotos();
    this.currentFlatPhotos = [...this.selectedFlatPhotos];
    this.updateCurrentPhotoIndex(0);
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.selectedFlat));
  }

  updateFilteredFlats() {
    if (this.filteredFlats) {
      this.filteredFlats = [...this.filteredFlats]; // Створити копію списку обраних осель
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.selectedFlat));
  }

  resetSelectedFlat() {
    // Видалення обраної оселі з localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.selectedFlat));
  }

  updateFilteredData(filterValue: any) {
    this.filterForm.patchValue(filterValue);
    this.filteredFlats = filterValue;
    this.selectedFlat = this.filteredFlats![0];
  }

  filterValue() {
    return this.filterForm.value;
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

  currentCardIndex: number = 0;
  cards: FlatInfo[] = [];

  onPrevCard() {
    if (!this.isCarouselAnimating) {
      this.isCarouselAnimating = true;
      this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
      this.updateSelectedFlat();
      this.updateCurrentPhotoIndex(0);
      this.currentFlatPhotos = [...this.selectedFlatPhotos];

      setTimeout(() => {
        this.isCarouselAnimating = false;
      }, 100);
    }
  }

  onNextCard() {
    if (!this.isCarouselAnimating) {
      this.isCarouselAnimating = true;
      this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
      this.updateSelectedFlat();
      this.updateCurrentPhotoIndex(0);
      this.currentFlatPhotos = [...this.selectedFlatPhotos];

      setTimeout(() => {
        this.isCarouselAnimating = false;
      }, 100);
    }
  }

  private calculateCardIndex(index: number): number {
    const length = this.filteredFlats?.length || 0;
    return (index + length) % length;
  }

  private updateSelectedFlat() {
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
    this.updateSelectedFlatPhotos();
  }

  loadMore() {
    const additionalFlats = this.flatInfo.slice(this.limit + this.offset, this.limit + this.offset + this.additionalLoadLimit);
    this.filteredFlats = [...this.filteredFlats!, ...additionalFlats];
    this.offset += this.additionalLoadLimit;
  }


}
