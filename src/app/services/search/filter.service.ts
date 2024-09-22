import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardsDataService } from '../user-components/cards-data.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterValue: any;
  private optionsFound: number | undefined;

  filterChange$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  house$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  loadCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sortValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  showedCards$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  limits$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  blockBtnStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private cardsDataService: CardsDataService) { }

  updateFilter(filterValue: any, optionsFound: number) {
    this.filterValue = filterValue;
    this.optionsFound = optionsFound;
    this.filterChange$.next(filterValue);
    // console.log(filterValue)
    this.formatedData(filterValue)
  }

  setLimits(limits: number) {
    console.log(limits);
    this.limits$.next(limits);
  }
  
  formatedData(data: any) {
    if (data) {
      const allCards = data.map((item: any) => ({
        flat: {
          about: item.about,
          animals: item.animals,
          apartment: item.apartment,
          area: item.area,
          balcony: item.balcony,
          bunker: item.bunker,
          checked: item.checked,
          city: item.city,
          country: item.country,
          distance_green: item.distance_green,
          distance_metro: item.distance_metro,
          distance_parking: item.distance_parking,
          distance_shop: item.distance_shop,
          distance_stop: item.distance_stop,
          family: item.family,
          flat_id: item.flat_id,
          flat_index: item.flat_index,
          flat_name: item.flat_name,
          floor: item.floor,
          houseNumber: item.houseNumber,
          kitchen_area: item.kitchen_area,
          man: item.man,
          option_flat: item.option_flat,
          option_pay: item.option_pay,
          price_d: item.price_d,
          price_m: item.price_m,
          realll: item.realll,
          region: item.region,
          repair_status: item.repair_status,
          room: item.room,
          rooms: item.rooms,
          street: item.street,
          students: item.students,
          woman: item.woman
        },
        img: item.img,
        owner: {
          rielt: item.rie.rielt,
          user_id: item.rie.owner,
        }
      }));
      this.cardsDataService.setCardsData(allCards);
      // console.log(allCards)
    } else {
      this.cardsDataService.setCardsData(undefined);
    }
  }

  getFilterValue() {
    return this.filterValue;
  }

  getOptionsFound() {
    return this.optionsFound;
  }

  loadCards(loadCards: string) {
    // console.log(loadNextCards);
    this.loadCards$.next(loadCards);
  }

  showedCards(showedCards: string) {
    // console.log(loadNextCards);
    this.showedCards$.next(showedCards);
  }

  pickHouse(house: any) {
    // console.log(house);
    if (house) {
      this.house$.next(house);
    }
  }

  sortHouse(sortValue: any) {
    // console.log('sortHouse')
    this.sortValue$.next(sortValue);
  }

  blockBtn(status: boolean) {
    // console.log('blockBtnStatus', status);
    this.blockBtnStatus$.next(status);
  }
}
