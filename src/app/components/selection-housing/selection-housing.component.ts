import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChangeComunService } from 'src/app/housing-services/change-comun.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo, serverPathPhotoFlat } from 'src/app/config/server-config';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-selection-housing',
  templateUrl: './selection-housing.component.html',
  styleUrls: ['./selection-housing.component.scss']
})

export class SelectionHousingComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  allFlats: any;
  someMethod() {
    this.trigger.openMenu();
  }
  serverPathPhotoFlat = serverPathPhotoFlat;

  path_logo = path_logo;
  loading = false;
  selectedFlatId: any | null;
  selectedFlatName: any;
  selectedHouse: any;
  flatName: any | null;
  ownFlats: { id: number, flat_id: string, flat_name: string }[] = [];
  rentedFlats: { id: number; flat_id: string, flat_name: string; }[] = [];
  houseData: any
  houseInfo: any
  statusMessage: string | undefined;
  chosenHouseMenu: boolean = false;

  choseFlatId: any;

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
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadOwnFlats();
    this.getFlatInfo();
  }

  openSelectHouse() {
    this.chosenHouseMenu = !this.chosenHouseMenu;
  }

  //після вибору оновлюємо дані оселі в локальному сховищі при перемиканні
  onChangeFlat(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('houseData', JSON.stringify(response));
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  //перевірка на існування айді оселі своєї чи орендованої, після призначення обраного айді або відновлення з локального сховища
  async getSelectParam(flats: any) {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
      this.choseFlatId = this.selectedFlatId;
    });
    this.selectedFlatService.selectedFlatName$.subscribe((flatName: string | null) => {
      this.selectedFlatName = flatName || this.selectedFlatName;
    });

    if (this.selectedFlatId) {
      const houseID = this.selectedFlatId;
      let checkFlatId: boolean = false
      flats.ids.forEach((value: any) => {
        if (value.flat_id == this.selectedFlatId || value.flat_id == houseID) {
          checkFlatId = true
        }
      })
      flats.citizen_ids.forEach((value: any) => {
        if (value.flat_id == this.selectedFlatId || value.flat_id == houseID) {
          checkFlatId = true
        }
      })

      if (checkFlatId) {
        this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);
        this.selectedFlatId = houseID || this.selectedFlatId;
      } else {
        localStorage.removeItem('selectedComun');
        localStorage.removeItem('selectedHouse');
        localStorage.removeItem('selectedFlatId');
        localStorage.removeItem('selectedFlatName');
        localStorage.removeItem('houseData');
        setTimeout(() => {
          location.reload();
        }, 200);
      }
    } else {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        this.selectedFlatId = parsedHouseData.flat.flat_id;
        this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);
        this.onChangeFlat()
      } else {
        console.log('Немає оселі')
      }
    }
  }

  // Отримання та збереження даних всіх дискусій
  async getFlatInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const allFlats: any = await this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson)).toPromise() as any[];
        console.log(allFlats)
        if (Array.isArray(allFlats.ids) && allFlats.ids) {
          let allFlatsInfo = await Promise.all(allFlats.ids.map(async (value: any) => {
            let infFlat: any = await this.http.post(serverPath + '/flatinfo/public', { auth: JSON.parse(userJson), flat_id: value.flat_id }).toPromise() as any[];
            return { flat_id: value.flat_id, flat_name: value.flat_name, flat_img: infFlat.imgs[0].img }
          }))
          this.allFlats = allFlatsInfo;
          console.log(this.allFlats)
          localStorage.setItem('allFlats', JSON.stringify(this.allFlats));
        } else {
          this.allFlats = [];
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async loadOwnFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            if (response.ids && response.ids.length === 0 && response.citizen_ids && response.citizen_ids.length === 0) {
            } else {
              if (response.ids && response.ids.length > 0) {
                this.ownFlats = response.ids.map((item: { flat_id: any, flat_name: any }, index: number) => ({
                  id: index + 1,
                  flat_id: item.flat_id,
                  flat_name: item.flat_name,
                }));
                console.log(response)
                // для автоматичного вибору оселі після входження в аккаунт - не працює
                // if (this.selectedFlatId) {
                // } else {
                //   console.log(this.selectedFlatId)
                //   const lastFlat = response.ids[response.ids.length - 1];
                //   this.selectedFlatId = lastFlat.flat_id;
                //   this.selectedFlatService.setSelectedFlatId(lastFlat.flat_id);
                //   this.selectedFlatService.setSelectedFlatName(lastFlat.flat_name);
                // }
              } else {
                this.ownFlats = [];
              }
              if (response.ids && response.citizen_ids && response.citizen_ids.length > 0) {
                this.rentedFlats = response.citizen_ids.map((item: { flat_id: any, flat_name: any }, index: number) => ({
                  id: index + 1,
                  flat_id: item.flat_id,
                  flat_name: item.flat_name,
                }));
                // для автоматичного вибору оселі після входження в аккаунт - не працює
                // const lastFlat = response.citizen_ids[response.citizen_ids.length - 1];
                // this.selectedFlatId = lastFlat.flat_id;
                // this.selectedFlatService.setSelectedFlatId(lastFlat.flat_id);
                // this.selectedFlatService.setSelectedFlatName(lastFlat.flat_name);
              } else {
                this.rentedFlats = [];
              }
              this.getSelectParam(response);
            }
          }
        );
    } else {
      console.log('User not found');
    }
  }

  // обираємо іншу оселю
  selectFlat(flat: any) {
    const userJson = localStorage.getItem('user');
    if (userJson && flat) {
      localStorage.removeItem('selectedComun');
      localStorage.removeItem('selectedHouse');
      localStorage.removeItem('selectedFlatId');
      localStorage.removeItem('selectedFlatName');
      localStorage.removeItem('houseData');
      this.openSelectHouse()
      this.statusMessage = 'Обираємо оселю ' + flat.flat_name;
      setTimeout(() => {
        this.statusMessage = 'Оновлюємо дані';
        this.selectedFlatService.setSelectedFlatId(flat.flat_id);
        this.selectedFlatService.setSelectedFlatName(flat.flat_name);
        this.selectedFlatService.setSelectedHouse(flat.flat_id, flat.flat_name);
        this.dataService.getInfoFlat().subscribe((response: any) => {
          if (response) {
            setTimeout(() => {
              this.statusMessage = 'Оновлено';
              localStorage.setItem('houseData', JSON.stringify(response));
              this.selectedFlatName = flat.flat_name;
              this.selectedFlatId = flat.flat_id;
              setTimeout(() => {
                location.reload();
              }, 1500);
            }, 1500);
          } else {
            console.log('Немає інформації про оселю')
            location.reload();
          }
        })
      }, 1500);
    } else {
      console.log('Авторизуйтесь')
    }
  }

}
