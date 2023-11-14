import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteHouseComponent } from '../delete-house/delete-house.component';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';

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

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  path_logo = path_logo;
  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId: string | null = null;
  statusMessage: string | undefined;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private selectedFlatService: SelectedFlatService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
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
          setTimeout(() => {
            this.loadOwnFlats(this.flat_name)
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

  async getFlat(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe((response: any) => {
          if (response && response.ids.length > 0) {
            const nextFlatName = response.ids[0].flat_name;
            this.loadOwnFlats(nextFlatName)
          } else {
            this.reloadPageWithLoader()
            console.log('Оселі немає')
          }
        });
    } else { console.log('Авторизуйтесь') }
  }

  async loadOwnFlats(flat_name: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe((response: any) => {
          const flatInfo = response.ids.find((flat: any) => flat.flat_name === flat_name);
          if (flatInfo) {
            const flatIdFromResponse = flatInfo.flat_id;
            if (flatIdFromResponse) {
              this.selectedFlatService.setSelectedFlatId(flatIdFromResponse);
              this.selectedFlatService.setSelectedFlatName(flat_name);
              this.statusMessage = 'Обираємо оселю ' + flat_name;
              setTimeout(() => {
                this.statusMessage = '';
                this.reloadPageWithLoader()
              }, 2500);
            }
          }
        },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('User not found');
    }
  }

  async openDialog(): Promise<void> {
    const selectedFlatName = localStorage.getItem('selectedFlatName');
    if (selectedFlatName !== null) {
      console.log('Назва вибраної оселі:', selectedFlatName);
    } else {
      console.log('Назва вибраної оселі не знайдена в сховищі');
    }
    const dialogRef = this.dialog.open(DeleteHouseComponent, {
      data: { flat_name: selectedFlatName, }
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        const userJson = localStorage.getItem('user');
        if (this.selectedFlatId && userJson) {
          this.http
            .post(serverPath + '/flatinfo/deleteflat', {
              auth: JSON.parse(userJson),
              flat_id: this.selectedFlatId,
            })
            .subscribe(
              (response: any) => {
                localStorage.removeItem('selectedComun');
                localStorage.removeItem('selectedHouse');
                localStorage.removeItem('selectedFlatId');
                localStorage.removeItem('selectedFlatName');
                localStorage.removeItem('houseData');
                this.statusMessage = 'Оселя видалена';
                setTimeout(() => {
                  this.getFlat();
                  this.statusMessage = '';
                }, 1500);
              },
              (error: any) => {
                console.error(error);
              }
            );
        } else {
          console.log('house not found');
          this.reloadPageWithLoader()
        }
      }
    });
  }

  openBtn() {
    this.showInput = !this.showInput;
  }

  toggleInput(value: boolean): void {
    this.showInput = value;
    if (!this.showInput) {
      this.flat_name = '';
    }
  }
}
