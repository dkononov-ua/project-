// import { animate, style, transition, trigger } from '@angular/animations';
// import { HttpClient } from '@angular/common/http';
// import { Component, Input, Output, EventEmitter, HostBinding, OnInit, OnDestroy } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Observable, Subscription, flatMap, of } from 'rxjs';
// import { FilterService } from './filter.service';

// interface FlatInfo {
//   region: string;
//   city: string;
//   rooms: string;
//   area: string;
//   repair_status: string;
//   selectedKitchen_area: string;
//   balcony: string;
//   bunker: string;
//   animals: string;
//   distance_metro: string;
//   distance_stop: string;
//   distance_green: string;
//   distance_shop: string;
//   distance_parking: string;
//   limit: string;
//   country: string;
//   price: any;
//   id: number;
//   name: string;
//   photos: string[];
//   img: string[];
// }

// interface FlatImage {
//   flat_id: string;
//   img: string[];
// }

// @Component({
//   selector: 'app-housing-search',
//   templateUrl: './housing-search.component.html',
//   styleUrls: ['./housing-search.component.scss']
// })

// export class HousingSearchComponent implements OnInit {

//   private filterSubscription: Subscription | undefined;
//   subscription: Subscription | undefined;
//   flatInfo: FlatInfo[] = [];
//   filteredFlats: FlatInfo[] | undefined;
//   selectedFlat: FlatInfo | any;
//   filterForm: FormGroup;
//   currentCard: any;
//   selectedFlatPhotos: string[] = [];
//   flatInfoWithImages: FlatInfo[] = [];
//   images: string[] = [];


//   constructor(
//     private filterService: FilterService,
//     private formBuilder: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {
//     this.filterForm = this.formBuilder.group({});
//   }

//   ngOnInit(): void {
//     const url = 'http://localhost:3000/search/flat';
//     this.fetchFlatData(url);

//     if (this.filterForm) {
//       this.filterForm.valueChanges.subscribe(() => {
//       });
//     }

//     this.filterSubscription = this.filterService.filterChange$.subscribe(() => {
//       const filterValue = this.filterService.getFilterValue();
//       if (filterValue) {
//         this.updateFilteredData(filterValue);
//       }
//     });
//   }

//   handleFilteredFlats(filterValue: FlatInfo[] | undefined) {
//     console.log(filterValue);
//     this.filteredFlats = filterValue;
//   }

//   fetchFlatData(url: string) {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }

//     this.subscription = this.http.get<{ flat_inf: FlatInfo[], flat_img: FlatImage[] }>(url).subscribe((data) => {
//       const flatInfo = data.flat_inf;
//       const flatImages = data.flat_img;
//       console.log(data.flat_img)

//       if (flatInfo && flatImages) {
//         this.flatInfo = flatInfo;
//         this.flatInfoWithImages = flatInfo.map((flat, index) => {
//           flat.photos = flatImages[index].img;
//           return { ...flat, flat_img: flatImages[index] };
//         });
//         console.log(this.flatInfoWithImages)

//         console.log('Отримано інформацію про оселі');
//       } else {
//         console.log('Немає інформації про оселі');
//       }

//       this.selectedFlat = this.flatInfoWithImages[0];
//       console.log(this.selectedFlat)
//       this.selectedFlatPhotos = this.selectedFlat.photos;
//       console.log(this.selectedFlatPhotos);

//       this.images = []; // Очищуємо масив зображень

//       if (this.selectedFlatPhotos && this.selectedFlatPhotos.length > 0) {
//         for (const photo of this.selectedFlatPhotos) {
//           const imageUrl = this.getImageUrl(photo);
//           this.images.push(imageUrl);
//         }
//       } else {
//         this.images.push('http://localhost:3000/housing_default.svg');
//       }
//     });
//   }

//   updateFilteredData(filterValue: any) {
//     this.filterForm.patchValue(filterValue);
//     this.filteredFlats = filterValue;
//     this.selectedFlat = this.filteredFlats![0];
//   }

//   filterValue() {
//     return this.filterForm.value;
//   }

//   selectFlat(flat: FlatInfo) {
//     this.selectedFlat = flat;
//     this.selectedFlatPhotos = this.selectedFlat.flat_img.img;
//     console.log(this.selectedFlat);
//     console.log(this.selectedFlatPhotos);
//   }


//   getFirstFlatPhoto(flat: FlatInfo): string {
//     if (flat && flat.photos && flat.photos.length > 0) {
//       return this.getImageUrl(flat.photos[0]);
//     }
//     return '';
//   }

//   // getImageUrl(photos: string | string[]): string {
//   //   if (typeof photos === 'string') {
//   //     return 'http://localhost:3000/img/flat/' + photos;
//   //   } else if (Array.isArray(photos) && photos.length > 0) {
//   //     return 'http://localhost:3000/img/flat/' + photos[0];
//   //   }
//   //   return 'http://localhost:3000/img/flat/housing_default.svg';
//   // }

//   getImageUrl(photos: string | string[]): string {
//     if (typeof photos === 'string') {
//     return `http://localhost:3000/img/flat/${photos}`;
//   } else if (Array.isArray(photos) && photos.length > 0) {
//     return 'http://localhost:3000/img/flat/' + photos[0];
//   }
//   return 'http://localhost:3000/img/flat/housing_default.svg';
//   }

//   currentCardIndex: number = 0;
//   cards: FlatInfo[] = [];

//   onNextCard() {
//     this.currentCardIndex = (this.currentCardIndex + 1) % this.filteredFlats!.length;
//     this.selectedFlat = this.filteredFlats![this.currentCardIndex];
//   }

//   onPrevCard() {
//     this.currentCardIndex = (this.currentCardIndex - 1 + this.filteredFlats!.length) % this.filteredFlats!.length;
//     this.selectedFlat = this.filteredFlats![this.currentCardIndex];
//   }
// }
