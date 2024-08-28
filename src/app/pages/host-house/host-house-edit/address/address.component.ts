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
import { HouseInfo } from 'src/app/interface/info';
import { HouseConfig } from 'src/app/interface/param-config';
import { CityDataService } from 'src/app/services/data/cityData.service';

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

  flatInfo: HouseInfo = HouseConfig;
  filteredRegions: any;
  filteredCities: any;
  filteredStreets: any;
  filteredHouses: any;
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
  debounceTimer: any;
  cityData: any;
  streetData: any;
  houseNumberData: any;

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
    private locationHouseService: LocationHouseService,
    private cityDataService: CityDataService,
  ) {   }

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
          this.sharedService.logoutHouse();
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
        // console.log(response)
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

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      const data = {
        country: this.flatInfo.country = 'Україна',
        region: this.flatInfo.region || undefined,
        district: this.flatInfo.district || undefined,
        city: this.flatInfo.city || undefined,
        micro_district: this.flatInfo.micro_district || undefined,
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
      // console.log(data)
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/addres', {
          auth: JSON.parse(userJson),
          new: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        // console.log(response)
        if (response && response.status === 'Параметри успішно додані') {
          if (response && response.rent) {
            this.sharedService.setStatusMessage('Параметри успішно збережено');
            setTimeout(() => {
              this.missingParamsService.checkResponse(response);
              setTimeout(() => {
                // this.updateFlatInfo();
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

  ifSelectedCity(cityData: any) {
    this.cityDataService.ifSelectedCity(cityData);
    this.cityData = cityData;
    // console.log(this.cityData)
    if (this.cityData) {
      this.flatInfo.region = cityData.regionUa;
      this.flatInfo.city = cityData.cityUa;
      this.flatInfo.district = cityData.districtUa;
      if (this.flatInfo.city === 'Київ') {
        this.flatInfo.region = 'Київська'
      }
      this.flatInfo.micro_district = '';
      this.flatInfo.street = '';
      this.flatInfo.houseNumber = '';
      this.flatInfo.flat_index = '';
      this.flatInfo.apartment = '';
    }
  }

  ifSelectedStreet(streetData: any) {
    this.cityDataService.ifSelectedStreet(streetData);
    this.streetData = streetData;
    // console.log(this.streetData)
    if (this.streetData) {
      this.flatInfo.street = streetData.streetUa;
      this.flatInfo.micro_district = '';
      this.flatInfo.houseNumber = '';
      this.flatInfo.flat_index = '';
      this.flatInfo.apartment = '';
    }
  }

  ifSelectedHouseNumber(houseNumberData: any) {
    this.cityDataService.ifSelectedHouseNumber(houseNumberData);
    this.houseNumberData = houseNumberData;
    // console.log(this.houseNumberData)
    if (this.houseNumberData) {
      this.flatInfo.houseNumber = houseNumberData.houseNumber;
      this.flatInfo.flat_index = houseNumberData.postcode;
    }
  }

  // завантаження бази областей
  async onRegionsInputChange(regions: string) {
    this.filteredRegions = this.cityDataService.loadRegionsFromOwnDB(regions);
  }
  // завантаження бази міст областей районів
  async onCityInputChange(city: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (city && city.length >= 3) {
      const existingCity = this.filteredCities?.find((c: { cityUa: string; }) => c.cityUa === city);
      if (existingCity) {
        return;
      }
      this.debounceTimer = setTimeout(async () => {
        this.filteredCities = await this.cityDataService.onCityInputChange(city);
        if (!this.filteredCities || this.filteredCities.length === 0) {
          // якщо апі не відповідає або нічого не знайшло я шукаю у власній БД міст
          this.filteredCities = await this.cityDataService.loadCitiesFromOwnDB(city);
        }
      }, 1000);
    }
  }
  // завантаження бази вулиць
  async onStreetInputChange(street: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (street && street.length >= 2) {
      const existingStreet = this.filteredStreets?.find((s: { streetUa: string; }) => s.streetUa === street);
      if (existingStreet) {
        return; // Виходимо, щоб уникнути повторного запиту
      }

      this.debounceTimer = setTimeout(async () => {
        this.filteredStreets = await this.cityDataService.onStreetInputChange(street);
        console.log(this.filteredStreets);
      }, 500);
    }
  }
  // завантаження бази номерів будинків та індексів
  async onHouseNumberInputChange(houseNumber: string) {
    if (houseNumber) {
      const existingHouse = this.filteredHouses?.find((h: { houseNumberUa: string; }) => h.houseNumberUa === houseNumber);
      if (existingHouse) {
        return; // Виходимо, щоб уникнути повторного запиту
      }
      this.filteredHouses = await this.cityDataService.onHouseNumberInputChange(houseNumber);
      // console.log(this.filteredHouses);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
