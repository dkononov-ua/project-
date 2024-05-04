import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animations } from '../../../interface/animation';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { MissingParamsService } from '../missing-params.service';
import { DataService } from 'src/app/services/data.service';
interface FlatInfo {
  rooms: number | null;
  repair_status: string | undefined;
  area: number | null;
  kitchen_area: number | null;
  balcony: string | undefined;
  floor: number | null;
  option_flat: number;
}
@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.scss'],
  animations: [animations.left, animations.left1, animations.left2,],
})

export class ParamComponent {

  loading = false;
  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  flatInfo: FlatInfo = {
    rooms: null,
    repair_status: '',
    area: null,
    kitchen_area: null,
    balcony: '',
    floor: null,
    option_flat: 2,
  };

  selectedFlatId!: string | null;
  minValue: number = 0;
  maxValue: number = 1000;
  minValueKitchen: number = 0;
  maxValueKitchen: number = 100;
  minValueFloor: number = -3;
  maxValueFloor: number = 47;
  path_logo = path_logo;

  helpRepair: boolean = false;
  helpBalcony: boolean = false;
  statusMessage: string | undefined;

  openHelpBalcony() {
    this.helpBalcony = !this.helpBalcony;
  }

  openHelpRepair() {
    this.helpRepair = !this.helpRepair;
  }

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private missingParamsService: MissingParamsService,

  ) { }

  ngOnInit(): void {
    this.getSelectParam();
    if (this.selectedFlatId) {
      this.getInfo();
    }
  }

  getSelectParam() {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });
  }

  updateFlatInfo() {
    const userJson = localStorage.getItem('user');
    if (userJson && this.selectedFlatId) {
      this.dataService.getInfoFlat().subscribe((response: any) => {
        if (response) {
          localStorage.setItem('houseData', JSON.stringify(response));
        } else {
          console.log('Немає оселі')
        }
      });
    }
  }

  async getInfo(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          if (response && response.param) {
            this.flatInfo = response.param;
          } else {
            console.log('Param not found in response.');
          }
        }, (error: any) => {
          console.error(error);
        });
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
        option_flat: this.flatInfo.option_flat || 2,
      }

      try {
        const response: any = await this.http.post(serverPath + '/flatinfo/add/parametrs', {
          auth: JSON.parse(userJson),
          new: data,
          flat_id: this.selectedFlatId,
        }).toPromise();
        if (response.status == 'Параметри успішно додані') {
          this.updateFlatInfo();
          if (response && response.rent) {
            this.sharedService.setStatusMessage('Параметри успішно збережено');
            setTimeout(() => {
              this.missingParamsService.checkResponse(response);
            }, 1000);
          } else {
            this.sharedService.setStatusMessage('Параметри успішно збережено');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Оголошення можна активувати!');
              setTimeout(() => {
                this.router.navigate(['/edit-house/about']);
                this.sharedService.setStatusMessage('');
              }, 1000);
            }, 1500);
          }
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

  clearInfo(): void {
    this.flatInfo = {
      rooms: null,
      repair_status: '',
      area: null,
      kitchen_area: null,
      balcony: '',
      floor: null,
      option_flat: 2,
    };
  }
}
