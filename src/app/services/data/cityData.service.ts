import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { regions } from 'src/app/data/data-city';

@Injectable({
  providedIn: 'root'
})
export class CityDataService {

  filteredRegions: any;
  filteredCities: any;
  filteredStreets: any;
  filteredHouses: any;

  selectedRegion: any;
  selectedCity: any;
  regions = regions;

  debounceTimer: any;
  cityData: any;
  streetData: any;
  houseNumberData: any;
  flatInfo: any;

  constructor(
    private http: HttpClient,
  ) { }

  async onCityInputChange(city: string): Promise<any[]> {
    return new Promise(async (resolve) => {
      if (city && city.length >= 3) {
        const filteredCities = await this.fetchCityData(city);
        // console.log(await this.fetchCityData(city))
        resolve(filteredCities);
      } else {
        resolve([]);
      }
    });
  }

  async fetchCityData(city: string): Promise<any> {
    try {
      const response: any = await this.http.get(`https://index.ukrposhta.ua/endpoints-for-apps/index.php?method=get_city_by_region_id_and_district_id_and_city_ua&city_ua=${city}`).toPromise();

      const extractCityData = (entry: any) => ({
        cityTypeEn: entry.CITYTYPE_EN,
        cityTypeRu: entry.CITYTYPE_RU,
        cityTypeUa: entry.CITYTYPE_UA,
        cityEn: entry.CITY_EN,
        cityId: entry.CITY_ID,
        cityKatottg: entry.CITY_KATOTTG,
        cityKoatuu: entry.CITY_KOATUU,
        cityRu: entry.CITY_RU,
        cityUa: entry.CITY_UA,
        districtEn: entry.DISTRICT_EN,
        districtId: entry.DISTRICT_ID,
        districtRu: entry.DISTRICT_RU,
        districtUa: entry.DISTRICT_UA,
        isDistrictCenter: entry.IS_DISTRICTCENTER,
        latitude: entry.LATTITUDE,
        longitude: entry.LONGITUDE,
        nameUa: entry.NAME_UA,
        newDistrictUa: entry.NEW_DISTRICT_UA,
        oldCityEn: entry.OLDCITY_EN,
        oldCityRu: entry.OLDCITY_RU,
        oldCityUa: entry.OLDCITY_UA,
        ownOf: entry.OWNOF,
        population: entry.POPULATION,
        regionEn: entry.REGION_EN,
        regionId: entry.REGION_ID,
        regionRu: entry.REGION_RU,
        regionUa: entry.REGION_UA,
        shortCityTypeEn: entry.SHORTCITYTYPE_EN,
        shortCityTypeRu: entry.SHORTCITYTYPE_RU,
        shortCityTypeUa: entry.SHORTCITYTYPE_UA
      });

      if (response && response.Entry) {
        return Array.isArray(response.Entry)
          ? response.Entry.map(extractCityData)
          : [extractCityData(response.Entry)];
      } else {
        return [];
      }
    } catch (error) {
      // console.error("Error fetching city data:", error);
      return [];
    }
  }

  ifSelectedCity(cityData: any) {
    if (cityData) {
      this.cityData = cityData;
      // console.log(this.cityData)
    }
  }

  async onStreetInputChange(street: string): Promise<any[]> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    return new Promise((resolve) => {
      if (street && street.length >= 2) {
        this.debounceTimer = setTimeout(async () => {
          const filteredStreets = await this.fetchStreetData(street);
          resolve(filteredStreets);
        }, 300);
      } else {
        resolve([]);
      }
    });
  }

  async fetchStreetData(street: string): Promise<any[]> {
    try {
      const response: any = await this.http.get(
        `https://index.ukrposhta.ua/endpoints-for-apps/index.php?method=get_street_by_region_id_and_district_id_and_city_id_and_street_ua&region_id=${this.cityData.regionId}&district_id=${this.cityData.districtId}&city_id=${this.cityData.cityId}&street_ua=${street}`
      ).toPromise();

      const extractStreetData = (entry: any) => ({
        streetTypeEn: entry.STREETTYPE_EN,
        streetTypeRu: entry.STREETTYPE_RU,
        streetTypeUa: entry.STREETTYPE_UA,
        streetEn: entry.STREET_EN,
        streetId: entry.STREET_ID,
        streetRu: entry.STREET_RU,
        streetUa: entry.STREET_UA,
        oldStreetEn: entry.OLDSTREET_EN,
        oldStreetRu: entry.OLDSTREET_RU,
        oldStreetUa: entry.OLDSTREET_UA,
        regionEn: entry.REGION_EN,
        regionId: entry.REGION_ID,
        regionRu: entry.REGION_RU,
        regionUa: entry.REGION_UA,
        shortStreetTypeEn: entry.SHORTSTREETTYPE_EN,
        shortStreetTypeRu: entry.SHORTSTREETTYPE_RU,
        shortStreetTypeUa: entry.SHORTSTREETTYPE_UA,
        newStreetUa: entry.NEW_STREET_UA
      });

      const filteredData = Array.isArray(response.Entry)
        ? response.Entry.filter((entry: any) =>
          entry.STREET_UA.toLowerCase().includes(street.toLowerCase())
        )
        : [response.Entry].filter((entry: any) =>
          entry.STREET_UA.toLowerCase().includes(street.toLowerCase())
        );

      return filteredData.map(extractStreetData);

    } catch (error) {
      // console.error("Error fetching street data:", error);
      return [];
    }

  }

  ifSelectedStreet(streetData: any) {
    if (streetData) {
      this.streetData = streetData;
      // console.log(this.streetData)
    }
  }

  async onHouseNumberInputChange(houseNumber: string): Promise<any[]> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    return new Promise((resolve) => {
      if (houseNumber) {
        this.debounceTimer = setTimeout(async () => {
          const filteredHouses = await this.fetchHouseData(houseNumber);
          resolve(filteredHouses);
        }, 100);
      } else {
        resolve([]);
      }
    });
  }

  async fetchHouseData(houseNumber: string): Promise<any[]> {
    try {
      // Отримання даних з сервера
      const response: any = await this.http.get(
        `https://index.ukrposhta.ua/endpoints-for-apps/index.php?method=get_addr_house_by_street_id&street_id=${this.streetData.streetId}&housenumber=${houseNumber}`
      ).toPromise();

      // Функція для перетворення даних про будинки
      const extractHouseData = (entry: any) => ({
        houseNumberUa: entry.HOUSENUMBER_UA,
        postcode: entry.POSTCODE,
        streetId: entry.STREET_ID
      });

      // Фільтрація даних по введеному номеру будинку
      const filteredData = Array.isArray(response.Entry)
        ? response.Entry.filter((entry: any) =>
          entry.HOUSENUMBER_UA.toLowerCase().includes(houseNumber.toLowerCase())
        )
        : [response.Entry].filter((entry: any) =>
          entry.HOUSENUMBER_UA.toLowerCase().includes(houseNumber.toLowerCase())
        );

      // Перетворення даних про будинки
      return filteredData.map(extractHouseData);
    } catch (error) {
      // console.error("Error fetching house data:", error);
      return [{ houseNumberUa: 'Не знайдено' }];
    }
  }

  ifSelectedHouseNumber(houseNumberData: any) {
    this.houseNumberData = houseNumberData;
  }

  async loadCitiesFromOwnDB(city: string): Promise<any[]> {
    const searchCity = city.toLowerCase();
    this.filteredCities = [];

    for (const region of regions) {
      const matchedCities = region.cities.filter(cityItem =>
        cityItem.name.toLowerCase().includes(searchCity)
      );

      if (matchedCities.length) {
        this.filteredCities.push(...matchedCities.map(cityItem => ({
          cityUa: cityItem.name,
          postalCode: cityItem.postalCode,
          regionUa: region.name
        })));
      }
    }
    return this.filteredCities;
  }

  // завантаження бази областей
  loadRegionsFromOwnDB(region: string): any[] {
    if (region) {
      const searchTerm = region.toLowerCase();
      this.filteredRegions = this.regions.filter(region =>
        region.name.toLowerCase().includes(searchTerm)
      );
      // console.log('Filtered Regions:', this.filteredRegions);
    }
    return this.filteredRegions;
  }

}
