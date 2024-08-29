import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionComponent } from 'src/app/card/card-user-components/action/action.component';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { SharedService } from 'src/app/services/shared.service';
import * as ServerConfig from 'src/app/config/path-config';
import { StatusMessageService } from 'src/app/services/status-message.service';
import { LoaderService } from 'src/app/services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class MissingParamsService {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***
  selectedFlatId!: string | null;
  flatInfo: any;
  missingParams: any = [];
  message: string = '';

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private dataService: DataService,
    private statusMessageService: StatusMessageService,
    private loaderService: LoaderService,
  ) {
    this.getServerPath();
    this.getSelectedFlatId();
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
  }

  // Підписка на отримання айді моєї обраної оселі
  async getSelectedFlatId() {
    this.selectedFlatIdService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId || null;
    })
  }

  // Перевіряю яких параметрів не вистачає для активації оголошення та показую це користувачу
  checkResponse(response: any): void {
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
      this.statusMessageService.setStatusMessage(message);
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
          this.statusMessageService.setStatusMessage('');
          this.router.navigate(['house/edit/address']);
        } else if (hasArea || hasFloor || hasOptionFlat || hasOptionPay) {
          this.statusMessageService.setStatusMessage('');
          this.router.navigate(['house/edit/param']);
        } else if (response.rent.length === 0 || hasRoom) {
          this.router.navigate(['house/edit/about']);
          this.statusMessageService.setStatusMessage('');
        }
      }, 2000);
    } else if (response.rent === 'Додайте фото') {
      this.statusMessageService.setStatusMessage('Для активації оголошення додайте мінімум 2 фото');
      setTimeout(() => {
        this.router.navigate(['house/edit/photo']);
        this.statusMessageService.setStatusMessage('');
      }, 2000);
    }

    if (response && !response.rent) {
      this.askActivateHouseProfile();
    }
  }

  // Для того щоб відправити якийсь запрос і отримати те чого мені не вистачає
  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.log('user not found');
      return null;
    }

    try {
      const response: any = await this.http.post(`${this.serverPath}/flatinfo/localflat`, {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId
      }).toPromise();

      if (response && response.about) {
        this.flatInfo = response.about;
        return this.flatInfo;
      } else {
        console.log('about not found in response.');
        return null;
      }
    } catch (error) {
      console.error('Server error:', error);
      this.statusMessageService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
      setTimeout(() => {
        this.statusMessageService.setStatusMessage('');
        location.reload();
      }, 1500);
      return null;
    }
  }

  // Запитую чи треба деактивувати оголошення
  async askDeactivateHouseProfile(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.log('user not found');
      return;
    }

    const houseInfo: any = await this.getInfo();
    if (!houseInfo) {
      console.log('House info not found.');
      return;
    }

    const dialogRef = this.dialog.open(ActionComponent, {
      data: {
        actionName: 'houseProfileDeactivate',
        data: houseInfo,
      }
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (userJson && result) {
        this.activateTenantProfile(houseInfo, false);
      }
    });
  }

  // Запитую чи треба активувати оголошення
  async askActivateHouseProfile(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.log('user not found');
      return;
    }

    const houseInfo: any = await this.getInfo();
    if (!houseInfo) {
      console.log('House info not found.');
      return;
    }

    const dialogRef = this.dialog.open(ActionComponent, {
      data: {
        actionName: 'houseProfile',
        data: houseInfo,
      }
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (userJson) {
        this.activateTenantProfile(houseInfo, result === true ? true : false);
      }
    });
  }

  // Активую огологення
  async activateTenantProfile(houseInfo: any, result: boolean): Promise<void> {
    this.loaderService.setLoading(true);
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {
      const data = {
        students: houseInfo.students,
        woman: houseInfo.woman,
        man: houseInfo.man,
        family: houseInfo.family,
        bunker: houseInfo.bunker,
        animals: houseInfo.animals,
        option_pay: houseInfo.option_pay,
        price_d: houseInfo.price_d,
        price_m: houseInfo.price_m,
        price_s: houseInfo.price_s,
        about: houseInfo.about,
        private: houseInfo.private,
        rent: result,
        room: houseInfo.room,
      }
      // console.log(data)
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/about', {
          auth: JSON.parse(userJson),
          flat: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        // console.log(response);
        if (!response.rent) {
          if (response && response.status === 'Параметри успішно додані' && result) {
            this.statusMessageService.setStatusMessage('Оголошення розміщено');
            setTimeout(() => {
              this.updateFlatInfo();
            }, 1500);
          } else {
            this.updateFlatInfo();
          }
        } else {
          this.checkResponse(response);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('user not found, the form is blocked');
    }
  }

  // Оновлюю дані по оселі
  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.removeItem('houseData');
          localStorage.setItem('houseData', JSON.stringify(response));
          this.statusMessageService.setStatusMessage('Оновлюємо інформацію...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

}
