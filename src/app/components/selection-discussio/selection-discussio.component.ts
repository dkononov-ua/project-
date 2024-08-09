import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ChangeComunService } from 'src/app/services/comun/change-comun.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import * as ServerConfig from 'src/app/config/path-config';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-selection-discussio',
  templateUrl: './selection-discussio.component.html',
  styleUrls: ['./selection-discussio.component.scss']
})

export class SelectionDiscussioComponent implements OnInit {
  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  loading = false;
  selectedFlatId: any | null;
  selectedFlatName: any | null;
  ownFlats: { id: number, flat_id: string, flat_name: string }[] = [];
  rentedFlats: { id: number; flat_id: string, flat_name: string; }[] = [];
  discussioFlats: any;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private changeComunService: ChangeComunService,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
      this.serverPath = serverPath;
    })
    this.getSelectParam();
    this.loadHouses();
  }

  loadHouses(): void {
    const houseJson = localStorage.getItem('house');
    if (houseJson) {
      const selectedFlatId = JSON.parse(houseJson).flat_id;
      this.selectedFlatService.setSelectedFlatId(selectedFlatId);
    }
    this.loadDiscussioFlat();
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  async loadDiscussioFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = this.serverPath + '/acceptsubs/get/ysubs';
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
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    } else {
      console.log('Оберіть оселю');
    }
  }

}

