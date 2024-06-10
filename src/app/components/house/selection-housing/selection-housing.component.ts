import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeComunService } from 'src/app/housing-services/change-comun.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { animations } from '../../../interface/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteHouseComponent } from '../delete-house/delete-house.component';
import { MatDialog } from '@angular/material/dialog';
import { StatusDataService } from 'src/app/services/status-data.service';

@Component({
  selector: 'app-selection-housing',
  templateUrl: './selection-housing.component.html',
  styleUrls: ['./selection-housing.component.scss'],
  animations: [
    animations.top2,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.right2,
    animations.right4,
    animations.swichCard,
  ],
})

export class SelectionHousingComponent implements OnInit {

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

  goToSettingHouse(arg0: any) {
    throw new Error('Method not implemented.');
  }
  goToHouse(arg0: any) {
    throw new Error('Method not implemented.');
  }

  allFlats: any;
  allFlatsTenant: any;
  loading = false;
  selectedFlatId: any | null;
  selectedHouse: any;
  flatName: any | null;
  statusMessage: string | undefined;
  indexPage: number = 1;
  chooseFlatID: any;
  houseData: any;
  page: any;
  selectedFlatName: any;
  isLoadingImg: boolean = false;
  startX = 0;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private statusDataService: StatusDataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
      await this.getFlatInfo();
      await this.getSelectParam();
    })
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 1;
    });
    this.loading = false;
    // if (this.allFlats && this.allFlats.length > 0 || this.allFlatsTenant && this.allFlatsTenant > 0) {
    //   if (this.page === '0') {
    //     this.indexPage = 0;
    //   } else {
    //     this.indexPage = 1;
    //   }
    // } else {
    //   this.indexPage = 0;
    //   this.router.navigate(['/house/house-control/add-house']);
    // }
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
      this.router.navigate(['/house/house-info']);
    } else if (direction !== 'right' && this.indexPage !== 1) {
      this.indexPage++;
    } else if (direction !== 'right' && this.indexPage === 1 && this.selectedFlatId) {
      this.router.navigate(['/house/house-info']);
    } else {
      this.router.navigate(['/user/info']);
    }
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        const houseData = localStorage.getItem('houseData');
        if (houseData) {
          const parsedHouseData = JSON.parse(houseData);
          this.houseData = parsedHouseData;
          this.chooseFlatID = parsedHouseData.flat.flat_id;
          this.selectedFlatName = parsedHouseData.flat.flat_name;
        }
      }
    });
  }

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
  }

  // обираємо іншу оселю
  selectFlat(flat: any): void {
    const houseData = localStorage.getItem('houseData');
    if (houseData && this.chooseFlatID === flat.flat_id) {
      this.router.navigate(['/house/house-info']);
    } else {
      const userJson = localStorage.getItem('user');
      if (userJson && flat) {
        this.sharedService.clearCacheHouse();
        this.loading = true;
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
                    this.router.navigate(['/house/house-info']);
                    this.sharedService.setStatusMessage('');
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
                  this.sharedService.setStatusMessage('');
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


}
