import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChangeComunService } from 'src/app/housing-services/change-comun.service';
import { DiscussioViewService } from 'src/app/services/discussio-view.service';
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
  discussioFlats: any;
  discussio_view: boolean = false;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private discussioViewService: DiscussioViewService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadHouses();
  }

  async loadHouses(): Promise<void> {
    this.loadOwnFlats();
    this.loadDiscussioFlat();
  }

  selectFlat(flat: any) {
    this.loading = true;
    this.selectedFlatId = flat.flat_id;
    this.selectedFlatName = flat.flat_name;
    this.changeComunService.clearSelectedComun();
    this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);
    this.selectedFlatService.setSelectedFlatName(this.selectedFlatName);
    this.selectedFlatService.setSelectedHouse(this.selectedFlatId, this.selectedFlatName);
    setTimeout(() => {
      location.reload();
    }, 200);
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
    }

    this.discussioViewService.discussioView$.subscribe((discussio_view: boolean) => {
      this.discussio_view = discussio_view;
    });
  }

  async loadDiscussioFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = serverPath + '/acceptsubs/get/ysubs';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newDiscussioFlats: any[] = response.map((flat: any) => {
        if (flat.flat_id) {
          return {
            flat_id: flat.flat.flat_id,
            flat_name: flat.flat.flat_name,
          };
        } else {
          return {
            flat_id: flat.flat.flat_id,
            flat_name: flat.flat.flat_name,
          }
        }
      });
      this.discussioFlats = newDiscussioFlats;
    } catch (error) {
      console.error(error);
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
