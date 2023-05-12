import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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
  // інші поля
}

type FlatPhoto = string;



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
    ])
  ]
})



export class HousingSearchComponent implements OnInit {

  private filterSubscription: Subscription | undefined;
  subscription: Subscription | undefined;
  flatInfo: FlatInfo[] = [];
  filteredFlats: FlatInfo[] | undefined;
  selectedFlat: FlatInfo | any;
  filterForm: FormGroup;
  currentCard: any;
  images: string[] = [];
  flatImages: any[] = [];
  selectedFlatPhotos: string[] = [];



  flatInfoWithImages: { flat_img: FlatImage; region: string; city: string; rooms: string; area: string; repair_status: string; selectedKitchen_area: string; balcony: string; bunker: string; animals: string; distance_metro: string; distance_stop: string; distance_green: string; distance_shop: string; distance_parking: string; limit: string; country: string; price: any; id: number; name: string; photos: string[]; img: string; }[] | undefined;
  selectedFlatImages: any;

  constructor(
    private filterService: FilterService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
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

  fetchFlatData(url: string) {
    this.http.get<{ flat_inf: FlatInfo[], flat_img: any[] }>(url).subscribe((data) => {
      const flatInfo = data.flat_inf;
      const flatImages = data.flat_img;
      console.log(flatInfo);
      console.log(flatImages);

      if (flatInfo && flatImages) {
        this.flatInfo = flatInfo;
        this.flatImages = flatImages; // Додано змінну flatImages
        this.selectedFlat = this.flatInfo[0];
        this.selectedFlatPhotos = this.selectedFlat?.photos || [];
        this.images = this.selectedFlatPhotos.map(photo => this.getFlatImage(this.selectedFlat, photo));
      }
    });
  }


  getFlatPhotos(flat: FlatInfo): string[] {
    console.log(flat.photos)
    return flat.photos || [];
  }


  selectFlat(flat: FlatInfo) {
    this.selectedFlat = flat;
  }

  updateFilteredData(filterValue: any) {
    this.filterForm.patchValue(filterValue);
    this.filteredFlats = filterValue;
    this.selectedFlat = this.filteredFlats![0];
  }

  filterValue() {
    return this.filterForm.value;
  }

  getFlatImage(flat: FlatInfo, photoIndex: number | FlatPhoto): string {
    if (typeof photoIndex === 'number') {
      return this.getImageUrl(flat.photos[photoIndex]);
    } else {
      return this.getImageUrl(photoIndex);
    }
  }



  getFlatImageUrl(flat: FlatInfo): any {
    let imageUrl = '';

    this.flatImages.forEach((e: any) => {
      if (e.flat_id === flat.flat_id) {
        if (e.img[0] === undefined === null) {
          imageUrl = 'http://localhost:3000/housing_default.svg';
        } else {
          imageUrl = this.getImageUrl(e.img[0]);
        }
      }
    });

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

  onNextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.filteredFlats!.length;
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
  }

  onPrevCard() {
    this.currentCardIndex = (this.currentCardIndex - 1 + this.filteredFlats!.length) % this.filteredFlats!.length;
    this.selectedFlat = this.filteredFlats![this.currentCardIndex];
  }
}
