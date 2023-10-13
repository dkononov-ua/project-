import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChangeComunService } from 'src/app/housing-services/change-comun.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath } from 'src/app/shared/server-config';
@Component({
  selector: 'app-selection-housing',
  templateUrl: './selection-housing.component.html',
  styleUrls: ['./selection-housing.component.scss']
})

export class SelectionHousingComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  someMethod() {
    this.trigger.openMenu();
  }

  loading = false;
  selectedFlatId: any | null;
  selectedFlatName: any;
  selectedHouse: any;
  flatName: any | null;
  ownFlats: { id: number, flat_id: string, flat_name: string }[] = [];
  rentedFlats: { id: number; flat_id: string, flat_name: string; }[] = [];
  houseData: any
  houseInfo: any

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private dataService: DataService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadOwnFlats();
  }

  // обираємо іншу оселю
  selectFlat(flat: any) {
    if (flat) {
      this.loading = true;
      localStorage.removeItem('houseData');
      this.changeComunService.clearSelectedComun();
      this.selectedFlatService.setSelectedFlatId(flat.flat_id);
      this.selectedFlatService.setSelectedFlatName(flat.flat_name);
      this.selectedFlatService.setSelectedHouse(flat.flat_id, flat.flat_name);
      this.onChangeFlat();
      setTimeout(() => {
        location.reload();
      }, 200);
    }
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

  async getSelectParam(flats: any) {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
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
        this.changeComunService.clearSelectedComun();
        localStorage.removeItem('selectedFlatId');
        localStorage.removeItem('selectedFlatName');
        localStorage.removeItem('selectedHouse');
        setTimeout(() => {
          location.reload();
        }, 200);
      }
    } else {
      this.houseData = localStorage.getItem('houseData');
      if (this.houseData) {
        const parsedHouseData = JSON.parse(this.houseData);
        const flat_id = parsedHouseData.flat.flat_id;
        this.selectedFlatId = flat_id;
        this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);
        this.onChangeFlat()
      } else {
        console.log('Немає оселі')
      }
    }
  }

  async loadOwnFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            this.ownFlats = response.ids.map((item: { flat_id: any, flat_name: any }, index: number) => ({
              id: index + 1,
              flat_id: item.flat_id,
              flat_name: item.flat_name,
            }));
            this.rentedFlats = response.citizen_ids
              .map((item: { flat_id: any, flat_name: any }, index: number) => ({
                id: index + 1,
                flat_id: item.flat_id,
                flat_name: item.flat_name,
              }));
            this.getSelectParam(response);
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('User not found');
    }
  }
}
