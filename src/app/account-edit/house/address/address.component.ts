import { animations } from '../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { regions } from '../../../data/data-city';
import { cities } from '../../../data/data-city';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { SharedService } from 'src/app/services/shared.service';

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
  animations: [animations.left, animations.left1, animations.left2,],

})

export class AddressComponent implements OnInit {

  loading = false;
  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  flatInfo: FlatInfo = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: 0,
    flat_index: '',
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
  path_logo = path_logo;
  statusMessage: string | undefined;
  selectedFlatId!: string | null;
  public locationLink: string = '';

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
  ) {
    this.filteredRegions = [];
  }

  ngOnInit(): void {
    this.getSelectParam();
    if (this.selectedFlatId) {
      this.getInfo();
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('houseData', JSON.stringify(response));
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.http.post(serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          this.flatInfo = response.flat;
          this.locationLink = this.generateLocationUrl();
          this.loading = false;
        }, (error: any) => {
          console.error(error);
          this.loading = false;
        });
    } else {
      console.log('house not found');
      this.loading = false;
    }
  };

  loadCities() {
    if (!this.flatInfo) return;
    const searchTerm = this.flatInfo.region?.toLowerCase() || '';
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
    if (!this.flatInfo) return;
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
    if (this.flatInfo.region && this.flatInfo.city && this.flatInfo.street) {

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

      return this.locationLink;
    } else {
      return '';
    }

  }

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      try {
        const response: any = await this.http.post(serverPath + '/flatinfo/add/addres', {
          auth: JSON.parse(userJson),
          new: this.flatInfo,
          flat_id: this.selectedFlatId,
        }).toPromise();

        if (response && response.status === 'Параметри успішно додані') {
          setTimeout(() => {
            this.updateFlatInfo();
            this.sharedService.setStatusMessage('Параметри успішно додані');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              setTimeout(() => {
                this.router.navigate(['/edit-house/param']);
              }, 200);
            }, 1500);
          }, 300);
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
            }, 1500);
          }, 500);
        }
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    } else {
      this.loading = false;
      console.log('user not found, the form is blocked');
    }
  }


  clearInfo(): void {
    this.flatInfo = {
      flat_id: '',
      country: '',
      region: '',
      city: '',
      street: '',
      houseNumber: '',
      apartment: 0,
      flat_index: '',
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
