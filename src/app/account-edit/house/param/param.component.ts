import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';


interface FlatInfo {
  rooms: number;
  repair_status: string | undefined;
  area: number;
  kitchen_area: number;
  balcony: string | undefined;
  floor: number;
  option_flat: number;
}
@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
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
    rooms: 0,
    repair_status: '',
    area: 0,
    kitchen_area: 0,
    balcony: '',
    floor: 0,
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
    private router: Router
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
          setTimeout(() => {
            this.statusMessage = 'Параметри успішно додані';
            setTimeout(() => {
              this.statusMessage = '';
              this.router.navigate(['/housing-parameters/host/about']);
            }, 1500);
          }, 500);
        } else {
          setTimeout(() => {
            this.statusMessage = 'Помилка видалення';
            setTimeout(() => {
              this.statusMessage = '';
            }, 1500);
          }, 500);
        }

      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    } else {
      this.loading = false;
      console.log('user not found, the form is blocked');
    }
  }

  clearInfo(): void {
    this.flatInfo = {
      rooms: 0,
      repair_status: '',
      area: 0,
      kitchen_area: 0,
      balcony: '',
      floor: 0,
      option_flat: 2,
    };
  }
}
