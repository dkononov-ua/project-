import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animations } from '../../../../interface/animation';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { MissingParamsService } from '../missing-params.service';
import { DataService } from 'src/app/services/data.service';
import { HouseInfo } from 'src/app/interface/info';
import { HouseConfig } from 'src/app/interface/param-config';
import { MenuService } from 'src/app/services/menu.service';

import { distance } from '../../../../data/distance-confiq';
import * as select_options from 'src/app/data/select-options';

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./../housing-parameters.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.appearance,
  ],
})

export class ParamComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  loading = false;
  searchTimer: any;

  suggestConservation: boolean = false;
  totalParam: number = 0;
  activeFilter: number = 0;
  totalFilling: number = 0;
  repairStatusName: string = 'Не визначено';

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  flatInfo: HouseInfo = HouseConfig;
  selectedFlatId!: string | null;
  minValue: number = 0;
  maxValue: number = 1000;
  minValueKitchen: number = 0;
  maxValueKitchen: number = 100;
  minValueFloor: number = -3;
  maxValueFloor: number = 47;

  helpRepair: boolean = false;
  helpBalcony: boolean = false;
  statusMessage: string | undefined;

  openHelpBalcony() {
    this.helpBalcony = !this.helpBalcony;
  }

  openHelpRepair() {
    this.helpRepair = !this.helpRepair;
  }

  isMobile = false;
  subscriptions: any[] = [];
  currentLocation: string = '';
  authorization: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;
  options_floor = select_options.floor;

  async setToogleMenu() {
    this.menuService.toogleMenuEditHouse(false)
  }

  getRepairStatusName(value: number): string {
    console.log(value)
    const status = select_options.repair.find(r => r.value === Number(value));
    return status ? status.name : 'Не визначено';
  }

  updateRepairStatusName() {
    this.repairStatusName = this.getRepairStatusName(this.flatInfo.repair_status);
  }


  // component.ts
  floorCount: number = 0; // Початкова кількість поверхів
  floors: number[] = [];
  selectedFloor: number | null = null; // Вибраний поверх
  updateFloors() {
    if (this.flatInfo.floorless && !this.floorCount) {
      this.floorCount = this.flatInfo.floorless;
      this.floors = Array.from({ length: this.floorCount }, (_, i) => i + 1).reverse();
    } else if (this.floorCount !== this.flatInfo.floorless) {
      this.floors = Array.from({ length: this.floorCount }, (_, i) => i + 1).reverse();
      this.flatInfo.floorless = this.floorCount;
    }

  }

  updateSelectFloor(floor: number) {
    this.selectedFloor = floor;
    this.flatInfo.floor = this.selectedFloor.toString();
  }

  constructor(
    private http: HttpClient,
    private selectedFlatIdService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,
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
        console.log(response)
        if (response && response.param) {
          this.flatInfo = response.param;
          this.countActiveFilters();
          this.updateRepairStatusName();
          this.updateFloors();
          this.updateSelectFloor(Number(this.flatInfo.floor));
        } else {
          console.log('Param not found in response.');
        }
      } catch (error) {
        // this.sharedService.setStatusMessage('Помилка на сервері, спробуйте ще раз');
        // setTimeout(() => {
        //   this.sharedService.setStatusMessage('');
        //   location.reload();
        // }, 1500);
      }
    } else {
      console.log('user not found');
    }
  };

  async saveInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId !== undefined) {

      const data = {
        rooms: this.flatInfo.rooms || null,
        repair_status: this.flatInfo.repair_status || '',
        area: this.flatInfo.area || null,
        kitchen_area: this.flatInfo.kitchen_area || null,
        balcony: this.flatInfo.balcony || '',
        floor: this.flatInfo.floor || null,
        floorless: this.flatInfo.floorless || null,
        option_flat: this.flatInfo.option_flat || 2,
        metrocolor: this.flatInfo.metrocolor || '',
        metroname: this.flatInfo.metroname || '',
      }
      console.log(data)
      try {
        const response: any = await this.http.post(this.serverPath + '/flatinfo/add/parametrs', {
          auth: JSON.parse(userJson),
          new: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        console.log(response)

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
        this.loading = false;
        console.error(error);
        location.reload();
      }
    } else {
      this.loading = false;
    }
  }

  // додавання затримки на відправку запиту
  onSubmitWithDelay() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.countActiveFilters();
    }, 1500);
  }

  // Метод для підрахунку кількості задіяних фільтрів
  countFilter(): number {
    const totalFields = 8;
    let count = 0;
    // if (this.flatInfo.country) count++;
    if (this.flatInfo.option_flat) count++;
    if (this.flatInfo.repair_status) count++;
    if (this.flatInfo.area) count++;
    if (this.flatInfo.kitchen_area) count++;
    if (this.flatInfo.rooms) count++;
    if (this.flatInfo.floor) count++;
    if (this.flatInfo.floorless) count++;
    if (this.flatInfo.balcony) count++;
    this.totalParam = parseFloat(((count / totalFields) * 100).toFixed(2));
    return count;
  }

  countActiveFilters() {
    // Отримуємо кількість активних фільтрів для кожної групи параметрів
    this.activeFilter = this.countFilter();
    const totalFields = 7;
    this.totalFilling = parseFloat(((this.activeFilter / totalFields) * 100).toFixed(2));
  }

  clearFilter() {
    this.flatInfo.option_flat = '2';
    this.flatInfo.repair_status = 0;
    this.flatInfo.area = '0';
    this.flatInfo.kitchen_area = 0;
    this.flatInfo.rooms = '';
    this.flatInfo.floor = '';
    this.flatInfo.balcony = '';
    this.countActiveFilters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
