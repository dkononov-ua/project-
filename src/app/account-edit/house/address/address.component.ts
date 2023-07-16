import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HostComponent } from '../host/host.component';
import { regions } from '../../../shared/data-city';
import { cities } from '../../../shared/data-city';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
interface FlatInfo {
  flat_id: string | undefined;
  country: string | undefined;
  region: string | any;
  city: string | any;
  street: string | undefined;
  houseNumber: string | undefined;
  apartment: number;
  flat_index: any;
  private: boolean;
  rent: boolean;
  distance_parking: number;
  distance_metro: number;
  distance_stop: number;
  distance_green: number;
  distance_shop: number;
}

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})

export class AddressComponent implements OnInit {

  flatInfo: FlatInfo = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: 0,
    flat_index: 0,
    private: false,
    rent: false,
    distance_parking: 0,
    distance_metro: 0,
    distance_stop: 0,
    distance_green: 0,
    distance_shop: 0,
  };

  filteredRegions: { id: number; name: string; cities: { id: number; name: string; postalCode: string; }[]; }[] | undefined;
  filteredCities: { id: number; name: string; }[] | undefined;
  selectedRegion: any;
  selectedCity: any;
  regions = regions;
  cities = cities;

  disabled: boolean = true;
  selectedFlatId!: string | null;
  public locationLink: string = '';

  constructor(private http: HttpClient, private selectedFlatService: SelectedFlatService) { }

  ngOnInit(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
      console.log(this.selectedFlatId);
      if (this.selectedFlatId !== null) {
        this.getInfo();
      }
    });
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response)
          this.flatInfo = response.flat;
          this.locationLink = this.generateLocationUrl();
          console.log(this.flatInfo);
          if (response == undefined && null)
          this.disabled = false;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  };


  loadCities() {
    const searchTerm = this.flatInfo.region.toLowerCase();
    this.filteredRegions = this.regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );
    const selectedRegionObj = this.filteredRegions.find(region =>
      region.name === this.flatInfo.region
    );
    this.filteredCities = selectedRegionObj ? selectedRegionObj.cities : [];
    this.flatInfo.city = '';
  }

  loadDistricts() {
    const searchTerm = this.flatInfo.city.toLowerCase();
    const selectedRegionObj = this.regions.find(region =>
      region.name === this.flatInfo.region
    );
    this.filteredCities = selectedRegionObj
      ? selectedRegionObj.cities.filter(city =>
          city.name.toLowerCase().includes(searchTerm)
        )
      : [];

    const selectedCityObj = this.filteredCities.find(city =>
      city.name === this.flatInfo.city
    );
    if (selectedCityObj && 'postalCode' in selectedCityObj) {
      this.flatInfo.flat_index = selectedCityObj.postalCode;
    } else {
      this.flatInfo.flat_index = '';
    }
  }

  generateLocationUrl() {
    console.log(this.flatInfo.region)
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.flatInfo.region || '';
    const city = this.flatInfo.city || '';
    const street = this.flatInfo.street || '';
    const houseNumber = this.flatInfo.houseNumber || '';
    const flatIndex = this.flatInfo.flat_index || '';
    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);
    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;

    return locationUrl;
  }

  saveInfo(): void {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined && this.disabled === false) {
      const data = this.flatInfo;
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: data, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
          this.disabled = true;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  editInfo(): void {
    this.disabled = false;
  }

  clearInfo(): void {
    if (this.disabled === false)
    this.flatInfo = {
      flat_id: '',
      country: '',
      region: '',
      city: '',
      street: '',
      houseNumber: '',
      apartment: 0,
      flat_index: 0,
      private: false,
      rent: false,
      distance_parking: 0,
      distance_metro: 0,
      distance_stop: 0,
      distance_green: 0,
      distance_shop: 0,
    };
  }
}
