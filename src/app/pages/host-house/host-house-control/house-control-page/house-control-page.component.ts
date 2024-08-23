import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { animations } from '../../../../interface/animation';
import { LoaderService } from 'src/app/services/loader.service';
import { DataService } from 'src/app/services/data.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteHouseComponent } from 'src/app/card/card-house-components/delete-house/delete-house.component';

@Component({
  selector: 'app-house-control-page',
  templateUrl: './house-control-page.component.html',
  styleUrls: ['./house-control-page.component.scss'],
  animations: [
    animations.top2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})

export class HouseControlPageComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  @ViewChild('flatIdInput') flatIdInput: any;
  loading = false;
  setSelectedFlatId: any;
  setSelectedFlatName: any;
  selectedFlatName: any;
  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId: any | null;
  statusMessage: string | undefined;

  subscriptions: any[] = [];
  isMobile: boolean = false;
  authorizationHouse: boolean = false;
  houseData: any;
  allFlats: any;
  allFlatsTenant: any;
  chooseFlatID: any;
  isLoadingImg: boolean = false;

  checkAcces(flat: any) {
    this.statusDataService.setStatusAccess(flat);
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService,
    private loaderService: LoaderService,
    private dataService: DataService,
    private statusDataService: StatusDataService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getCheckDevice();
    this.getServerPath();
    this.getSelectedFlat();
    this.getSelectParam();
    await this.getFlatInfo();
  }

  // підписка на перевірку девайсу
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

  // якщо вже є обрана оселя встановлюю її дані
  async getSelectParam(): Promise<void> {
    const houseData = localStorage.getItem('houseData');
    if (houseData) {
      const parsedHouseData = JSON.parse(houseData);
      this.houseData = parsedHouseData;
      // console.log(this.houseData)
      this.chooseFlatID = parsedHouseData.flat.flat_id;
      this.selectedFlatName = parsedHouseData.flat.flat_name;
    }
  }

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (this.selectedFlatId) {
          this.authorizationHouse = true;
          const selectedFlatName = localStorage.getItem('selectedFlatName');
          if (selectedFlatName) {
            this.selectedFlatName = selectedFlatName;
          }
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  async houseCreate(): Promise<void> {
    const userJson = localStorage.getItem('user');

    if (!userJson) {
      this.sharedService.setStatusMessage('Потрібно авторизуватись');
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
        this.sharedService.setStatusMessage('');
      }, 1500);
      return;
    }

    this.loaderService.setLoading(true);
    try {
      const response: any = await this.http.post(`${this.serverPath}/flatinfo/add/flat_id`, {
        auth: JSON.parse(userJson),
        new: { flat_id: this.flat_name },
      }).toPromise();

      const isSuccessful = response.status === 'Нова оселя успішно створена';
      this.sharedService.setStatusMessage(
        isSuccessful
          ? `Оселя ${this.flat_name} успішно створена`
          : 'Помилка створення'
      );

      if (isSuccessful) {
        this.clearLocalStorage();
        this.scheduleAction(() => this.loadNewFlats(this.flat_name), 2000);
      } else {
        this.scheduleAction(() => this.reloadPageWithLoader(), 1500);
      }
    } catch (error) {
      console.error(error);
      this.sharedService.setStatusMessage('Помилка на сервері');
      this.scheduleAction(() => this.reloadPageWithLoader(), 1500);
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  private clearLocalStorage(): void {
    const keysToRemove = [
      'selectedComun',
      'selectedHouse',
      'selectedFlatId',
      'selectedFlatName',
      'houseData'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  async loadNewFlats(flat_name: string): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      console.log('Авторизуйтесь');
      return;
    }
    try {
      const response: any = await this.http.post(`${this.serverPath}/flatinfo/localflatid`, JSON.parse(userJson)).toPromise();
      const flatInfo = response.ids.find((flat: any) => flat.flat_name === flat_name);
      if (flatInfo) this.selectFlat(flatInfo, 1);
    } catch (error) {
      console.error(error);
      this.sharedService.setStatusMessage('Щось пішло не так, повторіть спробу');
      this.scheduleAction(() => this.reloadPageWithLoader(), 2000);
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  selectFlat(flatInfo: any, action: number): void {
    this.loaderService.setLoading(true);
    const userJson = localStorage.getItem('user');
    if (!userJson || !flatInfo) return;

    this.loaderService.setLoading(true);
    this.sharedService.clearCacheHouse();
    this.sharedService.setStatusMessage(`Обираємо ${flatInfo.flat_name}`);

    this.scheduleAction(async () => {
      this.sharedService.setStatusMessage('Оновлюємо дані');
      this.selectedFlatService.setSelectedFlatId(flatInfo.flat_id);
      this.selectedFlatService.setSelectedFlatName(flatInfo.flat_name);
      this.selectedFlatService.setSelectedHouse(flatInfo.flat_id, flatInfo.flat_name);

      const response: any = await this.dataService.getInfoFlat().toPromise();
      if (!response) {
        location.reload();
        return;
      }

      this.updateFlatData(flatInfo, response, action);
    }, 1500);
  }

  private updateFlatData(flatInfo: any, response: any, action: number): void {
    localStorage.setItem('houseData', JSON.stringify(response));
    this.selectedFlatName = flatInfo.flat_name;
    this.selectedFlatId = flatInfo.flat_id;

    const houseData = JSON.parse(localStorage.getItem('houseData') || '{}');
    if (houseData.status) {
      if (action === 1) {
        this.sharedService.setStatusMessage(`Переходимо до налаштувань ${flatInfo.flat_name}`);
        this.scheduleAction(() => {
          this.loaderService.setLoading(false);
          this.router.navigate(['/house/edit']);
        }, 1500);
      } else if (action === 2) {
        this.sharedService.setStatusMessage(`Переходимо до профілю ${flatInfo.flat_name}`);
        this.scheduleAction(() => {
          this.loaderService.setLoading(false);
          this.router.navigate(['/house/info']);
        }, 1500);
      }
    } else {
      this.handleFlatAccessDenied();
    }
  }

  private handleFlatAccessDenied(): void {
    this.sharedService.setStatusMessage(`У вас немає доступу до оселі ID ${this.selectedFlatId} або можливо її було забанено`);
    this.scheduleAction(() => {
      this.sharedService.setStatusMessage('Зверніться до техпідтримки Discussio');
      this.scheduleAction(() => {
        this.sharedService.clearCacheHouse();
        location.reload();
      }, 2000);
    }, 2000);
  }

  private scheduleAction(action: () => void, delay: number): void {
    setTimeout(() => action(), delay);
  }

  async getFlatInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;

    try {
      const userData = JSON.parse(userJson);
      const allFlats: any = await this.http.post(`${this.serverPath}/flatinfo/localflatid`, userData).toPromise();

      this.allFlats = Array.isArray(allFlats.ids) && allFlats.ids
        ? await this.getFlatsInfo(allFlats.ids, userData)
        : undefined;
      localStorage.setItem('allFlats', JSON.stringify(this.allFlats));

      this.allFlatsTenant = Array.isArray(allFlats.citizen_ids) && allFlats.citizen_ids
        ? await this.getFlatsTenantInfo(allFlats.citizen_ids, userData)
        : undefined;
      localStorage.setItem('allFlatsTenant', JSON.stringify(this.allFlatsTenant));
    } catch (error) {
      console.error('Error fetching flat info:', error);
    } finally {
      this.loaderService.setLoading(false);
    }
  }

  private async getFlatsInfo(ids: any[], userData: any): Promise<any[]> {
    return await Promise.all(ids.map(async (value: any) => {
      const infFlat: any = await this.http.post(`${this.serverPath}/flatinfo/public`, { auth: userData, flat_id: value.flat_id }).toPromise();
      return {
        flat_id: value.flat_id,
        flat_name: value.flat_name,
        flat_img: infFlat?.imgs?.[0]?.img || ''
      };
    }));
  }

  private async getFlatsTenantInfo(citizenIds: any[], userData: any): Promise<any[]> {
    return await Promise.all(citizenIds.map(async (value: any) => {
      const infFlat: any = await this.http.post(`${this.serverPath}/flatinfo/public`, { auth: userData, flat_id: value.flat_id }).toPromise();
      return {
        flat_id: value.flat_id,
        flat_name: value.flat_name,
        flat_img: infFlat?.imgs?.[0]?.img || '',
        ...this.mapAccessFields(value)
      };
    }));
  }

  private mapAccessFields(value: { [key: string]: any }): any {
    const accessFields = [
      'acces_added', 'acces_admin', 'acces_agent', 'acces_agreement',
      'acces_citizen', 'acces_comunal', 'acces_comunal_indexes',
      'acces_discuss', 'acces_filling', 'acces_flat_chats',
      'acces_flat_features', 'acces_services', 'acces_subs'
    ];

    return accessFields.reduce((acc, field) => {
      acc[field] = value[field];
      return acc;
    }, {} as { [key: string]: any });
  }

  openBtn() {
    this.showInput = !this.showInput;
  }

  reloadPageWithLoader() {
    this.loaderService.setLoading(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  async deleteHouse(flat: any): Promise<void> {
    const dialogRef = this.dialog.open(DeleteHouseComponent, {
      data: { flat_name: flat.flat_name, }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.loaderService.setLoading(true);
        const userJson = localStorage.getItem('user');
        if (flat.flat_id && userJson) {
          this.http
            .post(this.serverPath + '/flatinfo/deleteflat', {
              auth: JSON.parse(userJson),
              flat_id: flat.flat_id,
            })
            .subscribe(
              (response: any) => {
                this.sharedService.clearCacheHouse();
                this.sharedService.setStatusMessage('Оселя видалена');
                setTimeout(() => {
                  this.reloadPageWithLoader()
                }, 1500);
              },
              (error: any) => {
                console.error(error);
              }
            );
        } else {
          this.reloadPageWithLoader()
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
