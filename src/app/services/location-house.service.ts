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
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = chosenFlat.flat.region || '';
    const city = chosenFlat.flat.city || '';
    const street = chosenFlat.flat.street || '';
    const houseNumber = chosenFlat.flat.houseNumber || '';
    const flatIndex = chosenFlat.flat.flat_index || '';
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
