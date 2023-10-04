import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ChangeComunService } from 'src/app/housing-services/change-comun.service';
import { DataService } from 'src/app/services/data.service';
import { DiscussioViewService } from 'src/app/services/discussio-view.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath } from 'src/app/shared/server-config';
@Component({
  selector: 'app-selection-housing',
  templateUrl: './selection-housing.component.html',
  styleUrls: ['./selection-housing.component.scss']
})

export class SelectionHousingComponent implements OnInit {

  loading = false;
  selectedFlatId: any | null;
  selectedFlatName: any | null;
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

  ngOnInit(): void {
    this.getSelectParam();
    this.loadHouses();
  }

  loadHouses(): void {
    const houseJson = localStorage.getItem('house');
    if (houseJson) {
      const selectedFlatId = JSON.parse(houseJson).flat_id;
      this.selectedFlatService.setSelectedFlatId(selectedFlatId);
    }
    this.loadOwnFlats();
    this.loadRentedFlats();
    this.loadDiscussioFlat();
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

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

          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('User not found');
    }
  }

  async loadRentedFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            this.rentedFlats = response.citizen_ids
              .map((item: { flat_id: any, flat_name: any }, index: number) => ({
                id: index + 1,
                flat_id: item.flat_id,
                flat_name: item.flat_name,
              }));
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('User not found');
    }
  }

  onSelectionChange(event: MatSelectChange) {
    this.loading = true;
    this.changeComunService.clearSelectedComun();
    if (this.selectedFlatId) {
      const selectedFlat = this.ownFlats.find(flat => flat.flat_id === this.selectedFlatId) ||
        this.rentedFlats.find(flat => flat.flat_id === this.selectedFlatId) ||
        this.discussioFlats.find((flat: { flat_id: any; }) => flat.flat_id === this.selectedFlatId);

      if (selectedFlat) {
        this.selectedFlatName = selectedFlat.flat_name;
        localStorage.setItem('house', JSON.stringify({ flat_id: this.selectedFlatId, flat_name: this.selectedFlatName }));
        this.selectedFlatService.setSelectedFlatId(this.selectedFlatId);
        this.selectedFlatService.setSelectedFlatName(this.selectedFlatName);
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    } else {
      console.log('Оберіть оселю');
    }
  }

}
