import { animations } from '../../../../interface/animation';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import { MenuService } from 'src/app/services/menu.service';

import { subway } from '../../../../data/subway';
import { distance } from '../../../../data/distance-confiq';
import * as select_options from 'src/app/data/select-options';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.appearance,
  ],
})

export class AddressComponent implements OnInit, OnDestroy {

  @ViewChild('targetButton', { static: false }) targetButton!: ElementRef<HTMLButtonElement>;
  autoClick() {
    if (this.targetButton) {
      // console.log('autoClick')
      this.targetButton.nativeElement.click();
    }
  }

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  flatInfo: any;
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

  searchTimer: any;
  suggestConservation: boolean = false;


  hideSingleSelectionIndicator = signal(true);
  totalLocation: number = 0;
  activeFilterLocation: number = 0;
  totalFilling: number = 0;
  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

  async setToogleMenu() {
    this.menuService.toogleMenuEditHouse(false)
  }

  async pickCity(item: any) {
    this.chownCity = item;
    this.flatInfo.flat.city = item.name;
    this.flatInfo.flat.region = item.region;
    let chownCity: string = item.name;
    let chownRegion: string = item.region;
    await this.onCityInputChange(this.flatInfo.flat.city);
    if (chownCity === 'Київ') {
      chownRegion = 'Київ'
    }
    const selectedCity = this.filteredCities?.find(
      (city: { cityUa: string; regionUa: string }) =>
        city.cityUa === chownCity &&
        city.regionUa === chownRegion
    );
    if (selectedCity) {
      this.ifSelectedCity(selectedCity);
    }
  }



  chownCity: any;
  subways = subway; // імпортовані дані про метро
  metroLines: any[] = []; // для зберігання ліній метро обраного міста
  stations: any[] = []; // для зберігання станцій метро обраної лінії
  lines: any[] = []; // Лінії метро обраного міста
  districts: any[] = []; // для зберігання районів міста Київ
  filteredDistricts: any;
  originalDistrictsList: any;
  metroExists: boolean = false;
  distanceConfiq = distance;
  options_floor = select_options.floor;


  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
    private locationHouseService: LocationHouseService,
    private cityDataService: CityDataService,
    private menuService: MenuService,
  ) { }

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
        if (response) {
          this.flatInfo = response;
          this.countActiveFilters();
          this.checkChownCityData();
          // Формую локацію на мапі
          this.locationLink = await this.locationHouseService.generateLocationUrl(this.flatInfo.flat);
        } else {
          console.log('flat not found in response.');
        }
      } catch (error) {
        console.log(error)
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
        country: this.flatInfo.flat.country = 'Україна',
        region: this.flatInfo.flat.region || undefined,
        district: this.flatInfo.flat.district || undefined,
        city: this.flatInfo.flat.city || undefined,
        micro_district: this.flatInfo.flat.micro_district || undefined,
        street: this.flatInfo.flat.street || undefined,
        houseNumber: this.flatInfo.flat.houseNumber || undefined,
        apartment: this.flatInfo.flat.apartment || undefined,
        flat_index: this.flatInfo.flat.flat_index || undefined,
        distance_parking: this.flatInfo.flat.distance_parking || undefined,
        distance_metro: this.flatInfo.flat.distance_metro || undefined,
        distance_stop: this.flatInfo.flat.distance_stop || undefined,
        distance_green: this.flatInfo.flat.distance_green || undefined,
        distance_shop: this.flatInfo.flat.distance_shop || undefined,
      }
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/addres', {
          auth: JSON.parse(userJson),
          new: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response && response.status === 'Параметри успішно додані') {
          this.saveInfoParam();
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

  async saveInfoParam(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      const data = {
        rooms: this.flatInfo.param.rooms,
        repair_status: this.flatInfo.param.repair_status,
        area: this.flatInfo.param.area,
        kitchen_area: this.flatInfo.param.kitchen_area,
        balcony: this.flatInfo.param.balcony,
        floor: this.flatInfo.param.floor,
        option_flat: this.flatInfo.param.option_flat,
        metrocolor: this.flatInfo.param.metrocolor,
        metroname: this.flatInfo.param.metroname,
        floorless: this.flatInfo.param.floorless,
      }
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/parametrs', {
          auth: JSON.parse(userJson),
          new: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response && response.status === 'Параметри успішно додані') {
          this.sharedService.setStatusMessage('Параметри успішно збережено');
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.missingParamsService.checkResponse(response);
          }, 1500);
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

  ifSelectedHouseNumber(houseNumberData: any) {
    this.cityDataService.ifSelectedHouseNumber(houseNumberData);
    if (houseNumberData) {
      this.flatInfo.flat.houseNumber = houseNumberData.houseNumberUa;
      this.flatInfo.flat.flat_index = houseNumberData.postcode;
      this.autoClick()
    }
  }

  // завантаження бази номерів будинків та індексів
  async onHouseNumberInputChange(houseNumber: string) {
    if (!this.cityData) {
      this.clearFilterLocation();
      return
    } else {
      this.filteredHouses = await this.cityDataService.onHouseNumberInputChange(houseNumber);
    }
  }

  async ifSelectedCity(cityData: any) {
    this.autoClick()

    if (cityData.cityUa !== this.flatInfo.flat.city) {
      this.filteredDistricts = [];
      this.filteredRegions = [];
      this.flatInfo.flat.micro_district = '';
      this.flatInfo.flat.district = '';
      this.flatInfo.flat.region = '';
      this.flatInfo.param.metrocolor = '';
      this.flatInfo.param.metroname = '';
    }
    this.cityDataService.ifSelectedCity(cityData);
    this.cityData = cityData;
    if (this.cityData) {
      this.flatInfo.flat.region = cityData.regionUa;
      this.flatInfo.flat.city = cityData.cityUa;
      if (this.flatInfo.flat.city === 'Київ') {
        this.flatInfo.flat.region = 'Київська'
      }
      if (this.flatInfo.flat.city === 'Харків') {

      } else {
        // this.flatInfo.flat.district = cityData.districtUa;
      }
      this.flatInfo.flat.micro_district = '';
      this.flatInfo.flat.street = '';
      this.flatInfo.flat.houseNumber = '';
      this.flatInfo.flat.flat_index = '';
      this.flatInfo.flat.apartment = '';
      this.checkChownCityData();
    }
  }

  // Шукаю інформацію за обраною областю для виведення картинки та інфи по ній
  checkChownCityData() {
    if (this.flatInfo.flat.region) {
      const existingCity = this.cities.find((c: { region: string; }) => c.region === this.flatInfo.flat.region);
      if (existingCity) {
        this.chownCity = existingCity;
        // console.log(this.chownCity)
        this.checkIfCityHasMetro();
        this.onDistrictInputChange();
      }
    }
  }

  ifSelectedStreet(streetData: any) {
    this.autoClick()
    this.cityDataService.ifSelectedStreet(streetData);
    this.streetData = streetData;
    // console.log(this.streetData)
    if (this.streetData) {
      this.flatInfo.flat.street = streetData.streetUa;
      this.flatInfo.flat.houseNumber = '';
      this.onHouseNumberInputChange('');
      // this.flatInfo.flat.micro_district = '';
    }
  }

  // завантаження бази областей
  async onRegionsInputChange(regions: string) {
    this.filteredRegions = this.cityDataService.loadRegionsFromOwnDB(regions);
    this.onSubmitWithDelay();
  }

  // завантаження бази міст областей районів
  async onCityInputChange(city: string): Promise<void> {
    // console.log('onCityInputChange', city)
    return new Promise((resolve) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      if (city && city.length >= 3) {
        const existingCity = this.filteredCities?.find((c: { cityUa: string; }) => c.cityUa === city);
        if (existingCity) {
          resolve();
          return;
        }
        this.debounceTimer = setTimeout(async () => {
          this.filteredCities = await this.cityDataService.onCityInputChange(city);
          if (!this.filteredCities || this.filteredCities.length === 0) {
            this.filteredCities = await this.cityDataService.loadCitiesFromOwnDB(city);
          }
          resolve();
        }, 1000);
      } else if (city === '') {
        // Очищення полів, якщо місто не задано
        this.clearFilterLocation();
        resolve();
      } else {
        resolve();
      }
    });
  }

  // завантаження бази вулиць
  async onStreetInputChange(street: string) {
    if (!this.cityData) {
      this.clearFilterLocation();
      return
    } else {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      if (street && street !== '') {
        const existingStreet = this.filteredStreets?.find((s: { streetUa: string; }) => s.streetUa === street);
        if (existingStreet) {
          return; // Виходимо, щоб уникнути повторного запиту
        }
        this.debounceTimer = setTimeout(async () => {
          this.filteredStreets = await this.cityDataService.onStreetInputChange(street);
        }, 100);
        this.flatInfo.flat.houseNumber = '';
      }
    }
  }

  // Логіка для обробки змін в полі вибору району
  async onDistrictInputChange() {
    if (this.flatInfo.flat.city) {
      this.filteredDistricts = [];
      this.filteredDistricts = await this.cityDataService.loadDistrictFromOwnDB(this.flatInfo.flat.city);
      this.onSubmitWithDelay();
    }
  }

  checkIfCityHasMetro() {
    if (this.flatInfo.flat.city === 'Київ' || this.flatInfo.flat.city === 'Харків' || this.flatInfo.flat.city === 'Дніпро') {
      this.metroExists = true;
      this.onCitySelect(this.flatInfo.flat.city);
    } else {
      this.metroExists = false;
    }
  }

  // Обробка вибору міста для отримання ліній метро
  onCitySelect(selected: string) {
    this.autoClick()

    if (this.flatInfo.flat.city !== selected) {
      this.stations = []; // Скидаємо список станцій
      this.flatInfo.param.metrocolor = ''; // Очищуємо вибрану лінію метро
    }
    const selectedCity = this.subways.find(city => city.name === selected);
    if (selectedCity) {
      this.lines = selectedCity.lines;
      if (this.flatInfo.param.metrocolor) {
        this.onLineSelect(this.flatInfo.param.metrocolor);
      }
    }
  }

  // Обробка вибору лінії метро для отримання станцій метро
  onLineSelect(selected: any) {
    const selectedLine = this.lines.find(line => line.name === selected);
    if (selectedLine) {
      this.stations = selectedLine.stations;
    }
  }

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      if (this.flatInfo.flat.city && this.flatInfo.flat.region && this.flatInfo.flat.option_pay !== undefined && this.flatInfo.flat.option_pay !== null) {
        this.suggestConservation = true;
      }
      this.countActiveFilters();
    }, 1500);
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilterLocation(): number {
    const totalFields = 14;
    let count = 0;
    // if (this.flatInfo.flat.country) count++;
    if (this.flatInfo.flat.region) count++;
    if (this.flatInfo.flat.city) count++;
    if (this.flatInfo.flat.district) count++;
    if (this.flatInfo.flat.micro_district) count++;
    if (this.flatInfo.param.metroname) count++;
    if (this.flatInfo.param.metrocolor) count++;
    if (this.flatInfo.flat.distance_metro) count++;
    if (this.flatInfo.flat.distance_green) count++;
    if (this.flatInfo.flat.distance_parking) count++;
    if (this.flatInfo.flat.distance_shop) count++;
    if (this.flatInfo.flat.distance_stop) count++;
    if (this.flatInfo.flat.street) count++;
    if (this.flatInfo.flat.houseNumber) count++;
    if (this.flatInfo.flat.flat_index) count++;
    if (this.flatInfo.flat.apartment) count++;
    this.totalLocation = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  countActiveFilters() {
    // Отримуємо кількість активних фільтрів для кожної групи параметрів
    this.activeFilterLocation = this.countFilterLocation();
    const totalFields = 39;
    this.totalFilling = parseFloat(((this.activeFilterLocation / totalFields) * 100).toFixed(2));
  }

  clearFilterLocation() {
    this.flatInfo.flat.country = '';
    this.flatInfo.flat.region = '';
    this.flatInfo.flat.city = '';
    this.flatInfo.flat.district = '';
    this.flatInfo.flat.street = '';
    this.flatInfo.flat.micro_district = '';
    this.flatInfo.param.metroname = '';
    this.flatInfo.param.metrocolor = '';
    this.chownCity = undefined;

    this.filteredDistricts = [];
    this.filteredRegions = [];
    this.filteredCities = [];
    this.flatInfo.flat.street = '';
    this.flatInfo.flat.houseNumber = '';
    this.flatInfo.flat.flat_index = '';
    this.flatInfo.flat.apartment = '';
    this.flatInfo.flat.distance_green = 0;
    this.flatInfo.flat.distance_metro = 0;
    this.flatInfo.flat.distance_parking = 0;
    this.flatInfo.flat.distance_shop = 0;
    this.flatInfo.flat.distance_stop = 0;
    this.countActiveFilters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
