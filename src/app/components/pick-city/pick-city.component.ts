import { animations } from '../../interface/animation';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { regions } from '../../data/data-city';
import { cities } from '../../data/data-city';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { CityDataService } from 'src/app/services/data/cityData.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UsereSearchConfig } from '../../interface/param-config'
import { UserInfoSearch } from '../../interface/info'


@Component({
  selector: 'app-pick-city',
  templateUrl: './pick-city.component.html',
  styleUrls: ['./pick-city.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.bot,
    animations.appearance,
  ],
})

export class PickCityComponent implements OnInit, OnDestroy {

  flatInfo: any;
  filteredRegions: any;
  filteredCities: any;
  selectedCity: any;
  regions = regions;
  cities = cities;
  selectedFlatId!: string | null;
  public locationLink: string = '';
  userInfo: UserInfoSearch = UsereSearchConfig;
  isMobile = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;
  debounceTimer: any;
  cityData: any;
  searchTimer: any;

  hideSingleSelectionIndicator = signal(true);
  totalLocation: number = 0;
  activeFilterLocation: number = 0;
  totalFilling: number = 0;
  pickSearch: string = '';
  pickPath: string = '';

  pickSearching(value: string) {
    if (value === 'tenant') {
      this.tenant = !this.tenant;
      this.house = false;
      this.pickSearch = 'орендаря';
    } else {
      this.house = !this.house;
      this.tenant = false;
      this.pickSearch = 'оселю';
    }
    this.pickPath = value;
  }

  pickCity(item: any) {
    this.loaderService.setLoading(true);
    if (item.cityEn) {
      this.goToSearch(item.cityEn.toLowerCase());
    } else {
      this.goToSearch(item.nameEn.toLowerCase());
    }
  }

  // Навігація з параметрами
  goToSearch(cityEn: string) {
    if (cityEn) {
      setTimeout(() => {
        this.router.navigate(['/search/' + this.pickPath + '/' + cityEn], { queryParams: { city: cityEn, } })
        this.loaderService.setLoading(false);
      }, 100);
    }
  }

  chownCity: any;
  districts: any[] = []; // для зберігання районів міста Київ
  filteredDistricts: any;
  tenant: boolean = false;
  house: boolean = false;



  constructor(
    private router: Router,
    private sharedService: SharedService,
    private cityDataService: CityDataService,
    private loaderService: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.checkUserAuthorization();
  }

  // перевірка на девайс
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
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
        resolve();
      } else {
        resolve();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
