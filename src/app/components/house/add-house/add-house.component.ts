import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.scss'],
})

export class AddHouseComponent implements OnInit {

  @ViewChild('flatIdInput') flatIdInput: any;
  loading = false;
  setSelectedFlatId: any;
  setSelectedFlatName: any;
  selectedFlatName: any;
  path_logo = path_logo;
  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId!: string | null;
  statusMessage: string | undefined;

  constructor(
    private http: HttpClient,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (this.selectedFlatId) {
        const selectedFlatName = localStorage.getItem('selectedFlatName');
        if (selectedFlatName) {
          this.selectedFlatName = selectedFlatName;
        }
      }
    });
  }

  async houseCreate(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(serverPath + '/flatinfo/add/flat_id', {
          auth: JSON.parse(userJson),
          new: { flat_id: this.flat_name },
        }).toPromise();
        if (response.status == 'Нова оселя успішно створена') {
          localStorage.removeItem('selectedComun');
          localStorage.removeItem('selectedHouse');
          localStorage.removeItem('selectedFlatId');
          localStorage.removeItem('selectedFlatName');
          localStorage.removeItem('houseData');
          this.statusMessage = 'Оселя ' + this.flat_name + ' успішно створена';
          this.sharedService.setStatusMessage('Оселя ' + this.flat_name + ' успішно створена');
          setTimeout(() => {
            this.statusMessage = '';
            this.loadNewFlats(this.flat_name);
          }, 2000);
        } else {
          this.statusMessage = 'Помилка створення';
          setTimeout(() => {
            this.statusMessage = '';
            this.reloadPageWithLoader()
          }, 1500);
        }
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    }
  }

  async loadNewFlats(flat_name: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const response: any = await this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson)).toPromise();
        const flatInfo = response.ids.find((flat: any) => flat.flat_name === flat_name);
        if (flatInfo) {
          const flatIdFromResponse = flatInfo.flat_id;
          if (flatIdFromResponse) {
            this.selectedFlatService.setSelectedFlatId(flatIdFromResponse);
            this.selectedFlatService.setSelectedFlatName(flat_name);
            this.sharedService.setStatusMessage('Переходимо до налаштувань ' + flat_name);
            this.statusMessage = 'Переходимо до налаштувань ' + flat_name;
            setTimeout(() => {
              this.sharedService.setStatusMessage('');
              this.statusMessage = '';
              this.router.navigate(['/housing-parameters/']);
            }, 2500);
          }
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Щось пішло не так, повторіть спробу';
        setTimeout(() => { this.statusMessage = ''; }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  openBtn() {
    this.showInput = !this.showInput;
  }

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

}
