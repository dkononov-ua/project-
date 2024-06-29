import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationHouseService {

  private locationHouseSubject = new BehaviorSubject<any>('');
  public locationHouse$ = this.locationHouseSubject.asObservable();
  public locationLink: string = '';

  constructor() { }

  // Генерую локацію оселі
  async generateLocationUrl(chosenFlat: any): Promise<string> {
    // console.log(chosenFlat)
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = chosenFlat.region || '';
    const city = chosenFlat.city || '';
    const street = chosenFlat.street || '';
    const houseNumber = chosenFlat.houseNumber || '';
    const flatIndex = chosenFlat.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;
    return this.locationLink;
  }

}
