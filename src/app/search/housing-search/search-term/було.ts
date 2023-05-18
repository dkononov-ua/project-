// import { Subscription, debounceTime } from 'rxjs';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { FilterService } from '../filter.service';
// import { regions } from '../search-term/data-search';
// import { cities } from '../search-term/data-search';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// interface SearchParams {
//   [key: string]: any;
// }
// interface SearchParams {
//   country: string;
//   region: string;
//   city: string;
//   rooms: number | string;
//   repair_status: string;
//   area?: number | string;
//   selectedKitchen_area: string;
//   balcony: string;
//   bunker: string;
//   animals: string;
//   distance_metro: string;
//   distance_stop: string;
//   distance_green: string;
//   distance_shop: string;
//   distance_parking: string;
// }
// @Component({
//   selector: 'app-search-term',
//   templateUrl: './search-term.component.html',
//   styleUrls: ['./search-term.component.scss'],
// })

// export class SearchTermComponent implements OnInit {

//   public showInput = false;
//   public userId: string | undefined;
//   searchQuery: string | undefined;
//   searchParamsString: string = '';
//   private subscription: Subscription | undefined;
//   selectedCity!: string;
//   selectedRooms!: number | any;
//   selectedRating!: number;
//   selectedArea!: string;
//   selectedKitchen_area!: string;
//   selectedRegion!: string;
//   selectedAnimals!: string;
//   selectedDistance_metro!: string;
//   selectedDistance_stop!: string;
//   selectedDistance_green!: string;
//   selectedDistance_shop!: string;
//   selectedDistance_parking!: string;
//   selectedBunker!: string;
//   selectedBalcony!: string;
//   flats: any[] | undefined;
//   flatInfo: any[] | undefined;
//   myForm: FormGroup | undefined | any;
//   selectedRepair_status: any;
//   searchParamsArr: string[] = [];
//   searchSuggestions: string[] = [];
//   timer: any;
//   regions = regions;
//   cities = cities;
//   endpoint = 'http://localhost:3000/search/flat';
//   private searchSubscription: Subscription | null = null;
//   form: any;
//   filteredFlats?: any;
//   flatImages: any[] | undefined;
//   filteredImages: any[] | any;
//   minValue: number = 0;
//   maxValue: number = 100000;

//   constructor(private filterService: FilterService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
//     this.myForm = this.formBuilder.group({
//       price_of: [],
//       price_to: [],
//       students: [],
//       woman: [],
//       man: [],
//       family: []
//     });
//   }

//   startTimer() {
//     clearTimeout(this.timer);
//     this.timer = setTimeout(() => {
//       if (this.searchQuery && this.searchQuery.length >= 3) {
//         this.onSubmit();
//       }
//     }, 2000);
//   }

//   // public addUserToHouse(): void {
//   //   console.log(`Користувач з ID ${this.userId} доданий до оселі.`);
//   //   this.userId = '';
//   //   this.showInput = false;
//   // }

//   ngOnInit() {
//     this.myForm.valueChanges
//       .pipe(
//         debounceTime(2000)
//       )
//       .subscribe(() => {
//         this.onSubmit();
//       });
//   }

//   fetchFlatData(url: string) {
//     this.subscription = this.http.get<{ flat_inf: any[], flat_img: any[] }>(url).subscribe((data) => {
//       console.log(data)
//       const { flat_inf, flat_img } = data;
//       if (flat_inf && flat_img) {
//         this.flatInfo = flat_inf;
//         // this.flatImages = flat_img;
//         // this.filterService.updateFilter(flat_inf, flat_img);
//       }
//       this.filteredFlats = data.flat_inf;
//       // this.filteredImages = data;
//       this.applyFilter(this.filteredFlats, data);
//     });
//   }

//   onSubmit() {
//     if (this.searchQuery) {
//       const flatId = this.searchQuery;
//       const url = `${this.endpoint}/?flat_id=${flatId}`;
//       this.fetchFlatData(url);
//       return;
//     }

//     const params: SearchParams = {
//       region: this.selectedRegion || '',
//       city: this.selectedCity || '',
//       rooms: this.selectedRooms || '',
//       area: this.selectedArea || '',
//       repair_status: this.selectedRepair_status || '',
//       selectedKitchen_area: this.selectedKitchen_area || '',
//       balcony: this.selectedBalcony || '',
//       bunker: this.selectedBunker || '',
//       animals: this.selectedAnimals || '',
//       distance_metro: this.selectedDistance_metro || '',
//       distance_stop: this.selectedDistance_stop || '',
//       distance_green: this.selectedDistance_green || '',
//       distance_shop: this.selectedDistance_shop || '',
//       distance_parking: this.selectedDistance_parking || '',
//       country: '',
//       students: this.myForm.get('students').value ? 1 : '',
//       woman: this.myForm.get('woman').value ? 1 : '',
//       man: this.myForm.get('man').value ? 1 : '',
//       family: this.myForm.get('family').value ? 1 : '',
//     };

//     let searchParamsArr: string[] = [];

//     this.addSelectedValue(searchParamsArr, 'Регіон', this.selectedRegion);
//     this.addSelectedValue(searchParamsArr, 'Місто', this.selectedCity);
//     this.addSelectedValue(searchParamsArr, 'Кімнати', this.selectedRooms);
//     this.addSelectedValue(searchParamsArr, 'Площа', this.selectedArea);
//     this.addSelectedValue(searchParamsArr, 'Ремонт', this.selectedRepair_status);
//     this.addSelectedValue(searchParamsArr, 'Кухня', this.selectedKitchen_area);
//     this.addSelectedValue(searchParamsArr, 'Балкон', this.selectedBalcony);
//     this.addSelectedValue(searchParamsArr, 'Укриття', this.selectedBunker);
//     this.addSelectedValue(searchParamsArr, 'Тварини', this.selectedAnimals);
//     this.addSelectedValue(searchParamsArr, 'Метро', this.selectedDistance_metro);
//     this.addSelectedValue(searchParamsArr, 'Зупинки', this.selectedDistance_stop);
//     this.addSelectedValue(searchParamsArr, 'Парк', this.selectedDistance_green);
//     this.addSelectedValue(searchParamsArr, 'Маркет', this.selectedDistance_shop);
//     this.addSelectedValue(searchParamsArr, 'Парковка', this.selectedDistance_parking);
//     this.searchParamsString = searchParamsArr.join(', ');
//     console.log('Обрані параметри пошуку:', this.searchParamsString);

//     const url = this.buildSearchURL(params);

//     // this.updateURL();
//     this.fetchFlatData(url);
//     // const filteredFlats = this.filterFlatsBySelections(this.flatInfo!);
//     // this.filteredFlats = filteredFlats;
//     this.applyFilter(this.filteredFlats, this.filteredImages);
//   }

//   private addSelectedValue(arr: string[], label: string, value: any) {
//     if (value) {
//       arr.push(`${label}: ${value}`);
//     }
//   }

//   buildSearchURL(params: any): string {
//     const endpoint = 'http://localhost:3000/search/flat';
//     const paramsString = Object.keys(params)
//       .filter(key => params[key] !== '')
//       .map(key => key + '=' + params[key])
//       .join('&');
//     return `${endpoint}?${paramsString}`;
//   }

//   // updateURL() {
//   //   this.router.navigate([], {
//   //     queryParams: { searchParams: this.searchParamsString },
//   //     queryParamsHandling: 'merge'
//   //   });
//   // }

//   applyFilter(filteredFlats: any, filteredImages: any) {
//     this.filterService.updateFilter(filteredFlats, filteredImages);
//   }

//   // filterFlatsBySelections(flatInfo: any[]): any[] {
//   //   const filteredFlats = flatInfo.filter((flat) => {
//   //     if (this.selectedCity && flat.city !== this.selectedCity) {
//   //       return false;
//   //     }
//   //     if (this.selectedRooms && flat.rooms !== this.selectedRooms) {
//   //       return false;
//   //     }

//   //     return true;
//   //   });

//   //   return filteredFlats;
//   // }

// }
