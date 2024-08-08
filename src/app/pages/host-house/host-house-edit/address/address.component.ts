import { animations } from '../../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { regions } from '../../../../data/data-city';
import { cities } from '../../../../data/data-city';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { MissingParamsService } from '../missing-params.service';
import { DataService } from 'src/app/services/data.service';
import { LocationHouseService } from 'src/app/services/location-house.service';

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
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
  ],
})

export class AddressComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

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
  statusMessage: string | undefined;
  selectedFlatId!: string | null;
  public locationLink: string = '';

  isMobile = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
    private locationHouseService: LocationHouseService,
  ) {
    this.filteredRegions = [];
  }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.checkUserAuthorization();
    await this.getSelectedFlatId();
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.subscriptions.push(
      this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
        this.selectedFlatId = flatId || this.selectedFlatId || null;
        if (this.selectedFlatId) {
          this.getInfo();
        } else {
          console.log('Оберіть оселю')
        }
      })
    );
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.removeItem('houseData');
          localStorage.setItem('houseData', JSON.stringify(response));
          this.sharedService.setStatusMessage('Оновлюємо інформацію...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  async getInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId }).toPromise();
        if (response && response.flat) {
          this.flatInfo = response.flat;
          // Формую локацію на мапі
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.flatInfo);
        } else {
          console.log('flat not found in response.');
        }
      } catch (error) {
        this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        setTimeout(() => {
          this.sharedService.setStatusMessage('');
          location.reload();
        }, 1500);
      }
    } else {
      console.log('user not found');
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

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      const data = {
        country: this.flatInfo.country || undefined,
        region: this.flatInfo.region || undefined,
        city: this.flatInfo.city || undefined,
        street: this.flatInfo.street || undefined,
        houseNumber: this.flatInfo.houseNumber || undefined,
        apartment: this.flatInfo.apartment || undefined,
        flat_index: this.flatInfo.flat_index || undefined,
        distance_parking: this.flatInfo.distance_parking || undefined,
        distance_metro: this.flatInfo.distance_metro || undefined,
        distance_stop: this.flatInfo.distance_stop || undefined,
        distance_green: this.flatInfo.distance_green || undefined,
        distance_shop: this.flatInfo.distance_shop || undefined,
      }
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/addres', {
          auth: JSON.parse(userJson),
          new: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response && response.status === 'Параметри успішно додані') {
          if (response && response.rent) {
            this.sharedService.setStatusMessage('Параметри успішно збережено');
            setTimeout(() => {
              this.missingParamsService.checkResponse(response);
              setTimeout(() => {
                this.updateFlatInfo();
              }, 2000);
            }, 1000);
          } else {
            this.sharedService.setStatusMessage('Параметри успішно збережено');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оголошення можна активувати!');
              setTimeout(() => {
                this.router.navigate(['/house/edit/about']);
                this.sharedService.setStatusMessage('');
              }, 1000);
            }, 1500);
          }
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка збереження');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }, 500);
        }
      } catch (error) {
        console.error(error);
        location.reload();
      }
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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
