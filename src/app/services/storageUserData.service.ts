import { Injectable, OnDestroy } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { StatusMessageService } from './status-message.service';
import { ActionComponent } from '../card/card-user-components/action/action.component';
import { DataService } from './data.service';
import { LoaderService } from './loader.service';
import { UserInfo } from 'src/app/interface/info';
import { UserConfig } from 'src/app/interface/param-config';

@Injectable({
  providedIn: 'root'
})
export class StorageUserDataService implements OnDestroy {
  serverPath: string = '';
  userFeaturesData: any;
  userInfo: UserInfo = UserConfig;
  subscriptions: any[] = [];

  constructor(
    private sharedService: SharedService,
    private http: HttpClient,
    private dialog: MatDialog,
    private statusMessageService: StatusMessageService,
    private dataService: DataService,
    private loaderService: LoaderService,
  ) { this.getServerPath(); }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  // Якщо є локально збережені дані профілю орендаря
  async getStorageTenantData() {
    const storageUserLooking = localStorage.getItem('storageUserLooking');
    if (storageUserLooking) {
      const storageUserObject = JSON.parse(storageUserLooking);
      this.userInfo = storageUserObject;
      // console.log(this.userInfo)
      if (this.userInfo) {
        setTimeout(() => {
          this.activateTenantProfile(this.userInfo);
        }, 200);
      }
    }
  }

  // Беру інформацію користувача
  async getInfoFeaturesUser() {
    const userFeaturesData = localStorage.getItem('searchInfoUserData');
    if (userFeaturesData) {
      const userObject = JSON.parse(userFeaturesData);
      this.userFeaturesData = userObject.inf;
      // console.log(this.userFeaturesData)
    }
  }


  // Запитую чи треба активувати оголошення
  async activateTenantProfile(userInfo: any): Promise<void> {
    // console.log('activateTenantProfile')
    const userJson = localStorage.getItem('user');
    const dialogRef = this.dialog.open(ActionComponent, {
      data: {
        actionName: 'tenantProfile',
        data: userInfo,
      }
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result === true && userJson) {
        this.saveUserInfo(userInfo, true);
      } else {
        this.saveUserInfo(userInfo, false);
      }
    });
  }

  // Запитую чи треба деактивувати профіль
  async deactivateTenantProfile(): Promise<void> {
    this.getInfoFeaturesUser();
    if (this.userFeaturesData) {
      const userJson = localStorage.getItem('user');
      const dialogRef = this.dialog.open(ActionComponent, {
        data: {
          actionName: 'tenantProfileDeactivate',
          data: this.userFeaturesData,
        }
      });
      dialogRef.afterClosed().subscribe(async (result: any) => {
        if (result === true && userJson) {
          this.saveUserInfo(this.userFeaturesData, false);
        }
      });
    }
  }

  async saveUserInfo(userData: any, agree: boolean): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        if (userData.option_pay === 2) {
          userData.price_of = 0.01;
          userData.price_to = 0.01;
        }
        const data = {
          agree_search: agree,
          country: userData.country || 'Україна',
          price_of: userData.price_of.toString(),
          price_to: userData.price_to.toString(),
          region: userData.region,
          city: userData.city,
          rooms_of: userData.rooms_of,
          rooms_to: userData.rooms_to,
          area_of: userData.area_of,
          area_to: userData.area_to,
          repair_status: userData.repair_status,
          bunker: userData.bunker,
          balcony: userData.balcony,
          animals: userData.animals,
          distance_metro: userData.distance_metro || 0,
          distance_stop: userData.distance_stop || 0,
          distance_green: userData.distance_green || 0,
          distance_shop: userData.distance_shop || 0,
          distance_parking: userData.distance_parking || 0,
          option_pay: userData.option_pay,
          day_counts: userData.day_counts || 0,
          purpose_rent: userData.purpose_rent,
          house: userData.house,
          flat: userData.flat,
          room: userData.room,
          looking_woman: userData.looking_woman,
          looking_man: userData.looking_man,
          students: userData.students,
          woman: userData.woman,
          man: userData.man,
          family: userData.family,
          days: userData.days,
          weeks: userData.weeks,
          mounths: userData.mounths,
          years: userData.years,
          about: userData.about,

          metro: userData.metro,
          district: userData.district,
          micro_district: userData.micro_district,
          metroname: userData.metroname,
          metrocolor: userData.metrocolor,
          floor: userData.floor,
        };
        const response: any = await this.http.post(this.serverPath + '/features/add', { auth: JSON.parse(userJson), new: data }).toPromise();
        this.loaderService.setLoading(true);
        if (response.status === true) {
          if (agree) {
            this.sharedService.setStatusMessage('Активовано!');
            setTimeout(() => {
              const storageUserLooking = localStorage.getItem('storageUserLooking');
              if (storageUserLooking) {
                this.sharedService.setStatusMessage('Додайте фото та контактні дані');
                localStorage.removeItem('storageUserLooking');
                this.updateUserFeaturesInfo();
              } else {
                this.updateUserFeaturesInfo();
              }
            }, 2000);
          } else {
            this.sharedService.setStatusMessage('Збережено!');
            localStorage.removeItem('storageUserLooking');
            setTimeout(() => {
              this.updateUserFeaturesInfo();
            }, 1500);
          }
        } else {
          setTimeout(() => {
            this.sharedService.setStatusMessage('Помилка формування');
            setTimeout(() => {
              location.reload();
            }, 3000);
          }, 1000);
        }
      } catch (error) {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка на сервері, повторіть спробу');
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  // Оновлюю дані по оселі
  updateUserFeaturesInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getFeaturesInfo().subscribe((response: any) => {
        if (response) {
          localStorage.removeItem('searchInfoUserData');
          localStorage.setItem('searchInfoUserData', JSON.stringify(response));
          this.sharedService.setStatusMessage('Оновлюємо інформацію...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } else {
          console.log('Помилка')
        }
      });
    }
  }


}


