import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteHouseComponent } from '../delete-house/delete-house.component';
import { NgModel } from '@angular/forms';
import { serverPath } from 'src/app/shared/server-config';

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

  flat_name: string = '';
  showInput = false;
  showCreate = false;
  selectedFlatId: string | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private selectedFlatService: SelectedFlatService
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
      if (!this.selectedFlatId) {
        await this.loadOwnFlats();
      }
    });
  }

  async houseCreate(): Promise<void> {
    const userJson = localStorage.getItem('user');

    if (!userJson) {
      this.loading = false;
      console.log('user not found');
      return;
    }

    try {
      const response = await this.http
        .post(serverPath + '/flatinfo/add/flat_id', {
          auth: JSON.parse(userJson),
          new: { flat_id: this.flat_name },
        })
        .toPromise();
      console.log(response)
      this.reloadPageWithLoader()
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  async loadOwnFlats(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe(
          (response: any) => {
            if (response.ids[0] && response.ids[0].flat_id && !this.selectedFlatId) {
              console.log(111111)
              this.setSelectedFlatId = response.ids[0].flat_id;
              this.setSelectedFlatName = response.ids[0].flat_name;
              if (this.setSelectedFlatId) {
                this.selectedFlatService.setSelectedFlatId(this.setSelectedFlatId);
                this.selectedFlatService.setSelectedFlatName(this.setSelectedFlatName);
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
      data: {
        flat_name: selectedFlatName,
      }
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
                this.selectedFlatService.clearSelectedFlatId();
                this.selectedFlatService.clearSelectedFlatName();
                localStorage.removeItem('house');
              },
              (error: any) => {
                console.error(error);
              }
            );
          this.reloadPageWithLoader()
        } else {
          console.log('house not found');
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
