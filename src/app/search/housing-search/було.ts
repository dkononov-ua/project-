// import { animate, style, transition, trigger } from '@angular/animations';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Subscription } from 'rxjs';
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
//   price_m: any;
//   id: number;
//   name: string;
//   photos: string[];
//   img: string;
//   about: string;
//   apartment: string;
//   family: string;
//   flat_id: string;
//   flat_index: string;
//   floor: string;
//   houseNumber: string;
//   kitchen_area: string;
//   man: string;
//   metro: string;
//   price_y: string;
//   street: string;
//   students: string;
//   woman: string;
// }

// @Component({
//   selector: 'app-housing-search',
//   templateUrl: './housing-search.component.html',
//   styleUrls: ['./housing-search.component.scss'],
//   animations: [
//     trigger('cardAnimation', [
//       transition('void => *', [
//         style({ transform: 'translateX(130%)' }),
//         animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
//       ]),
//       transition('* => void', [
//         animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
//       ])
//     ]),
//     trigger('slideAnimation', [
//       transition(':enter', [
//         style({ transform: 'translateY(100%)', opacity: 0 }),
//         animate('300ms', style({ transform: 'translateY(0)', opacity: 1 }))
//       ])
//     ]),
//   ]
// })

// export class HousingSearchComponent implements OnInit {

//   private filterSubscription: Subscription | undefined;
//   flatInfo: FlatInfo[] = [];
//   filteredFlats: FlatInfo[] | undefined;
//   selectedFlat: FlatInfo | any;
//   filterForm: FormGroup;
//   flatImages: any[] = [];
//   selectedFlatPhotos: string[] = [];
//   currentFlatPhotos: string[] = [];
//   currentPhotoIndex: number = 0;
//   isCarouselAnimating!: boolean;
//   limit: number = 0;
//   additionalLoadLimit: number = 5;
//   offset: number = 0;
//   localStorageKey!: string;
//   showFullScreenImage = false;
//   fullScreenImageUrl = '';
//   photoChangeData: any;

//   constructor(
//     private filterService: FilterService,
//     private formBuilder: FormBuilder,
//     private http: HttpClient,
//     private router: Router,
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

//     this.filterService.photoChange$.subscribe((data: any[]) => {
//       this.photoChangeData = data;
//       this.updateCardPhotos();
//     });
//   }

//   private updateCardPhotos(): void {
//     const filteredCards = this.filteredFlats;
//     this.flatImages = []

//     console.log(this.photoChangeData)

//     this.photoChangeData.flat_img.forEach((i: any) => {
//       this.flatImages.push(i)
//     })
//     this.flatInfo = this.photoChangeData.flat_inf;

//     const additionalFlats = this.photoChangeData.flat_inf;
//     this.filteredFlats = [...this.filteredFlats!, ...additionalFlats];
//     console.log(this.flatInfo)
//   }

//   getDefaultImage(photo: string | undefined | null): string {
//     if (!photo) {
//       return 'http://localhost:3000/img/flat/housing_default.svg';
//     } else {
//       return this.getImageUrl(photo);
//     }
//   }

//   fetchFlatData(url: string) {
//     this.http.get<{ flat_inf: FlatInfo[], flat_img: any[] }>(url).subscribe((data) => {
//       const { flat_inf, flat_img } = data;
//       if (flat_inf && flat_img) {
//         this.flatInfo = flat_inf;
//         this.flatImages = flat_img;
//         this.updateFilteredData(this.flatInfo);
//       }
//     });
//   }

//   updateSelectedFlatPhotos() {
//     const selectedFlatId = this.selectedFlat?.flat_id;
//     const selectedFlatImages = this.flatImages.find(flatImage => flatImage.flat_id === selectedFlatId)?.img || [];
//     this.selectedFlatPhotos = selectedFlatImages;
//   }

//   updateCurrentPhotoIndex(index: number) {
//     this.currentPhotoIndex = index;
//   }

//   selectFlat(flat: FlatInfo) {
//     this.selectedFlat = flat;
//     this.updateSelectedFlatPhotos();
//     this.currentFlatPhotos = [...this.selectedFlatPhotos];
//     this.updateCurrentPhotoIndex(0);
//   }

//   // updateFilteredFlats() {
//   //   if (this.filteredFlats) {
//   //     this.filteredFlats = [...this.filteredFlats];
//   //   }
//   // }

//   updateFilteredData(filterValue: any) {
//     this.filterForm.patchValue(filterValue);
//     console.log(filterValue)
//     this.filteredFlats = filterValue;
//     this.selectedFlat = this.filteredFlats![0];
//     this.updateSelectedFlatPhotos(); // Оновлення списку фотографій для вибраної оселі
//     // this.currentFlatPhotos = [...this.selectedFlatPhotos];
//   }

//   getFlatImageUrl(flat: FlatInfo): any {
//     let imageUrl = '';

//     const flatImage = this.flatImages.find(flatImage => flatImage.flat_id === flat.flat_id);
//     if (flatImage) {
//       if (!flatImage.img[0] === undefined === null) {
//         imageUrl = 'http://localhost:3000/housing_default.svg';
//       } else {
//         imageUrl = this.getImageUrl(flatImage.img[0]);
//       }
//     }

//     return imageUrl;
//   }

//   getImageUrl(fileName: string | string[]): string {
//     if (typeof fileName === 'string') {
//       return 'http://localhost:3000/img/flat/' + fileName;
//     } else if (Array.isArray(fileName) && fileName.length > 0) {
//       return 'http://localhost:3000/img/flat/' + fileName[0];
//     }
//     return 'http://localhost:3000/img/flat/housing_default.svg';
//   }

//   currentCardIndex: number = 0;
//   cards: FlatInfo[] = [];

//   onPrevCard() {
//     if (!this.isCarouselAnimating) {
//       this.isCarouselAnimating = true;
//       this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex - 1);
//       this.updateSelectedFlat();
//       this.updateCurrentPhotoIndex(0);
//       this.currentFlatPhotos = [...this.selectedFlatPhotos];

//       setTimeout(() => {
//         this.isCarouselAnimating = false;
//       }, 100);
//     }
//   }

//   onNextCard() {
//     if (!this.isCarouselAnimating) {
//       this.isCarouselAnimating = true;
//       this.currentCardIndex = this.calculateCardIndex(this.currentCardIndex + 1);
//       this.updateSelectedFlat();
//       this.updateCurrentPhotoIndex(0);
//       this.currentFlatPhotos = [...this.selectedFlatPhotos];

//       setTimeout(() => {
//         this.isCarouselAnimating = false;
//       }, 100);
//     }
//   }

//   private calculateCardIndex(index: number): number {
//     const length = this.filteredFlats?.length || 0;
//     return (index + length) % length;
//   }

//   private updateSelectedFlat() {
//     this.selectedFlat = this.filteredFlats![this.currentCardIndex];
//     this.updateSelectedFlatPhotos();
//     this.currentFlatPhotos = [...this.selectedFlatPhotos];
//     this.updateCurrentPhotoIndex(0);
//   }

//   loadMore(): void {
//     this.limit += 5
//     const url = `http://localhost:3000/search/flat?limit=${this.limit}`;
//     this.http.get<{ flat_inf: FlatInfo[], flat_img: any[] }>(url).subscribe((data) => {
//       console.log(data)
//       const { flat_inf, flat_img } = data;
//       if (flat_inf && flat_img) {
//         flat_img.forEach((i) => {
//           this.flatImages.push(i)
//         })
//         this.flatInfo = flat_inf;
//         const additionalFlats = flat_inf;
//         this.filteredFlats = [...this.filteredFlats!, ...additionalFlats];
//       }
//     });
//   }

//   openFullScreenImage(imageUrl: string): void {
//     this.showFullScreenImage = true;
//     this.fullScreenImageUrl = imageUrl;
//   }

//   closeFullScreenImage(): void {
//     this.showFullScreenImage = false;
//     this.fullScreenImageUrl = '';
//   }
// }
