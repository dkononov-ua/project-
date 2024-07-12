import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteHouseComponent } from '../delete-house/delete-house.component';
import { MatDialog } from '@angular/material/dialog';
import { StatusDataService } from 'src/app/services/status-data.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-selection-housing',
  templateUrl: './selection-housing.component.html',
  styleUrls: ['./selection-housing.component.scss'],
  animations: [
    animations.top2,
  ],
})

export class SelectionHousingComponent implements OnInit, OnDestroy {

  checkAcces(flat: any) {
    this.statusDataService.setStatusAccess(flat);
  }

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  allFlats: any;
  allFlatsTenant: any;
  loading = false;
  selectedFlatId: any | null;
  selectedHouse: any;
  flatName: any | null;
  indexPage: number = 1;
  chooseFlatID: any;
  houseData: any;
  selectedFlatName: any;
  isLoadingImg: boolean = false;
  startX = 0;

  reloadPageWithLoader() {
    this.loaderService.setLoading(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  subscriptions: any[] = [];
  isMobile: boolean = false;
  authorizationHouse: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private dataService: DataService,
    private router: Router,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private statusDataService: StatusDataService,
    private loaderService: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCheckDevice();
    await this.getServerPath();
    await this.getSelectedFlat();
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
        this.loaderService.setLoading(true)
        await this.getFlatInfo();
      })
    );
  }

  // підписка на айді обраної оселі, перевіряю чи є в мене створена оселя щоб відкрити функції з орендарями
  async getSelectedFlat() {
    this.subscriptions.push(
      this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
        this.selectedFlatId = Number(flatId);
        if (this.selectedFlatId) {
          this.authorizationHouse = true;
          this.getSelectParam();
        } else {
          this.authorizationHouse = false;
        }
      })
    );
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }

  // оброблюю свайп
  onSwiped(direction: string) {
    if (direction === 'right' && this.indexPage !== 0) {
      this.indexPage--;
    } else if (direction === 'right' && this.indexPage === 0 && this.selectedFlatId) {
      this.router.navigate(['/house']);
    } else if (direction !== 'right' && this.indexPage !== 1) {
      this.indexPage++;
    } else if (direction !== 'right' && this.indexPage === 1 && this.selectedFlatId) {
      this.router.navigate(['/house']);
    } else {
      this.router.navigate(['/user/info']);
    }
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

  // запитую дані по всім оселям які в мене є
  async getFlatInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    // console.log(this.serverPath)
    if (userJson) {
      try {
        const allFlats: any = await this.http.post(this.serverPath + '/flatinfo/localflatid', JSON.parse(userJson)).toPromise() as any[];
        if (Array.isArray(allFlats.ids) && allFlats.ids) {
          let allFlatsInfo = await Promise.all(allFlats.ids.map(async (value: any) => {
            let infFlat: any = await this.http.post(this.serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
            return { flat_id: value.flat_id, flat_name: value.flat_name, flat_img: infFlat.imgs[0].img }
          }))
          this.allFlats = allFlatsInfo;
          localStorage.setItem('allFlats', JSON.stringify(this.allFlats));
        } else {
          this.allFlats = undefined;
        }
        // console.log(this.allFlats)
        if (Array.isArray(allFlats.citizen_ids) && allFlats.citizen_ids) {
          let allFlatsTenant = await Promise.all(allFlats.citizen_ids.map(async (value: any) => {
            let infFlat: any = await this.http.post(this.serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
            return {
              flat_id: value.flat_id,
              flat_name: value.flat_name,
              flat_img: infFlat.imgs[0].img,
              acces_added: value.acces_added,
              acces_admin: value.acces_admin,
              acces_agent: value.acces_agent,
              acces_agreement: value.acces_agreement,
              acces_citizen: value.acces_citizen,
              acces_comunal: value.acces_comunal,
              acces_comunal_indexes: value.acces_comunal_indexes,
              acces_discuss: value.acces_discuss,
              acces_filling: value.acces_filling,
              acces_flat_chats: value.acces_flat_chats,
              acces_flat_features: value.acces_flat_features,
              acces_services: value.acces_services,
              acces_subs: value.acces_subs,
            }
          }))
          this.allFlatsTenant = allFlatsTenant;
          this.chooseFlatID = this.chooseFlatID;
          localStorage.setItem('allFlatsTenant', JSON.stringify(this.allFlatsTenant));
        } else {
          this.allFlatsTenant = undefined;
        }
        // console.log(this.allFlatsTenant)
      } catch (error) {
        console.error(error);
      }
    }
    this.loaderService.setLoading(false)
  }

  // обираємо іншу оселю
  selectFlat(flat: any): void {
    // якщо оселя вже була вибрана то ми просто переходимо до меню оселі
    const houseData = localStorage.getItem('houseData');
    if (houseData && this.chooseFlatID === flat.flat_id) {
      this.router.navigate(['/house']);
    } else {
      const userJson = localStorage.getItem('user');
      if (userJson && flat) {
        this.loaderService.setLoading(true)
        this.sharedService.clearCacheHouse();
        this.sharedService.setStatusMessage('Обираємо ' + flat.flat_name);
        setTimeout(() => {
          this.sharedService.setStatusMessage('Оновлюємо дані');
          this.selectedFlatService.setSelectedFlatId(flat.flat_id);
          this.selectedFlatService.setSelectedFlatName(flat.flat_name);
          this.selectedFlatService.setSelectedHouse(flat.flat_id, flat.flat_name);
          this.dataService.getInfoFlat().subscribe((response: any) => {
            // console.log(response)
            if (response) {
              setTimeout(() => {
                this.sharedService.setStatusMessage('Оновлено');
                localStorage.setItem('houseData', JSON.stringify(response));
                this.selectedFlatName = flat.flat_name;
                this.selectedFlatId = flat.flat_id;
                const houseData = localStorage.getItem('houseData');
                if (houseData) {
                  const parsedHouseData = JSON.parse(houseData);
                  this.houseData = parsedHouseData;
                }
                // console.log(this.houseData)
                if (this.houseData && this.houseData.status === true) {
                  setTimeout(() => {
                    this.router.navigate(['/house']);
                    this.sharedService.setStatusMessage('');
                    this.loaderService.setLoading(false)
                  }, 1500);
                } else {
                  this.sharedService.setStatusMessage('У вас немає доступу до оселі ID ' + this.selectedFlatId + ' або можливо її було забанено');
                  setTimeout(() => {
                    this.sharedService.setStatusMessage('Зверніться до техпідтримки Discussio');
                    setTimeout(() => {
                      this.sharedService.clearCacheHouse();
                      this.sharedService.setStatusMessage('');
                      location.reload();
                    }, 2000);
                  }, 2000);
                }
              }, 1500);
            } else {
              location.reload();
            }
          })
        }, 1500);
      } else {
        console.log('Авторизуйтесь')
      }
    }
    this.chooseFlatID = flat.flat_id;
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
