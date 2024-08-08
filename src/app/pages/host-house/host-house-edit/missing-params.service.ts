import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

interface RentParams {
  [key: string]: string;
  region: string;
  city: string;
  street: string;
  houseNumber: string;
  rooms: string;
  area: string;
  floor: string;
  option_flat: string;
  option_pay: string;
  room: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissingParamsService {

  constructor(
    private sharedService: SharedService,
    private router: Router,
  ) { }

  checkResponse(response: any): void {
    const knownParams = ['region', 'city', 'street', 'houseNumber', 'rooms', 'area', 'floor', 'option_flat', 'option_pay', 'room'];
    interface Translations {
      [key: string]: string;
    }
    const translateParameters = (rentParams: string[]): string => {
      const translations: Translations = {
        'region': 'Область',
        'city': 'Місто',
        'street': 'Вулиця',
        'houseNumber': 'Номер будинку',
        'rooms': 'Кількість кімнат',
        'area': 'Площа',
        'floor': 'Поверх',
        'option_flat': 'Тип оселі',
        'option_pay': 'Варіанти оплати',
        'room': 'Формат здачі'
      };

      const missingParams: string[] = Object.keys(translations).filter(param => rentParams.includes(param));
      let message = '';
      if (missingParams.length > 0) {
        message = 'Для розміщення оголошення потрібно вказати:';
        missingParams.forEach(param => {
          message += `\n- ${translations[param]}`;
        });
      } else {
        message = 'Оголошення може бути активовано!';
      }
      return message;
    };

    if (response && response.rent && Array.isArray(response.rent)) {
      const rentParams: string[] = response.rent;
      const message = translateParameters(rentParams);
      // Виводимо повідомлення
      this.sharedService.setStatusMessage(message);
      setTimeout(() => {
        // Перевірка наявності параметрів за їх індексами
        const hasRegion = response.rent.includes('region');
        const hasCity = response.rent.includes('city');
        const hasStreet = response.rent.includes('street');
        const hasHouseNumber = response.rent.includes('houseNumber');
        const hasArea = response.rent.includes('area');
        const hasFloor = response.rent.includes('floor');
        const hasOptionFlat = response.rent.includes('option_flat');
        const hasOptionPay = response.rent.includes('option_pay');
        const hasRoom = response.rent.includes('room');

        if (hasRegion || hasCity || hasStreet || hasHouseNumber) {
          this.sharedService.setStatusMessage('');
          this.router.navigate(['house/edit/address']);
        } else if (hasArea || hasFloor || hasOptionFlat || hasOptionPay) {
          this.sharedService.setStatusMessage('');
          this.router.navigate(['house/edit/param']);
        } else if (response.rent.length === 0 || hasRoom) {
          this.router.navigate(['house/edit/about']);
          this.sharedService.setStatusMessage('');
        }
      }, 2000);
    } else if (response.rent === 'Додайте фото') {
      this.sharedService.setStatusMessage('Для активації оголошення додайте мінімум 2 фото');
      setTimeout(() => {
        this.router.navigate(['house/edit/photo']);
        this.sharedService.setStatusMessage('');
      }, 2000);
    }
  }

}
