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
        this.filterFlats();
      });
    }

    this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
      const filterValue = this.filterService.getFilterValue();
      if (filterValue) { // Перевірка, чи існує значення фільтра
        this.updateFilteredData(filterValue);
      }
    });
  }

  // ngOnDestroy() {
  //   this.filterSubscription?.unsubscribe();
  //   this.subscription?.unsubscribe();
  // }

  selectFlat(flat: FlatInfo) {
    this.selectedFlat = flat;
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.http.get<{ flat_inf: FlatInfo[] }>(url).subscribe((data) => {
      const flatInfo = data.flat_inf;
      if (flatInfo) {
        this.flatInfo = flatInfo.map((flat) => {
          flat.photos = [flat.img];
          return flat;
        });

        this.filterFlats();

        console.log('Отримано інформацію про оселі');
      } else {
        console.log('Немає інформації про оселі');
      }
    });
  }

  filterFlats() {
    if (this.filterForm && this.flatInfo) {
      const filters = this.filterForm.value;

      const filteredFlats = this.flatInfo.filter((flat) => {
        if (filters.rooms && filters.rooms !== flat.rooms) {
          return false;
        }

        if (filters.price && flat.price > filters.price) {
          return false;
        }

        return true;
      });

      this.handleFilteredFlats(filteredFlats);
    }
  }

  updateFilteredData(filterValue: any) {
    this.filterForm.patchValue(filterValue);
    this.filterFlats();
    this.filteredFlats = filterValue;
    console.log(this.filteredFlats); // Вивести відфільтровані дані
  }

  filterValue() {
    return this.filterForm.value;
  }



  getImageUrl(fileName: string): string {
    return `http://localhost:3000/img/flat/${fileName}`;
  }

  getFlatPhotos(flat: FlatInfo): string[] {
    return flat.photos;
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

  onSubscribe() {
    // Do something when subscribe button is clicked
  }

}
