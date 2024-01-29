import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteHouseComponent } from 'src/app/account-edit/house/delete-house/delete-house.component';

@Component({
  selector: 'app-delete-h',
  templateUrl: './delete-h.component.html',
  styleUrls: ['./delete-h.component.scss'],
})

export class DeleteHComponent implements OnInit {

  @ViewChild('flatIdInput') flatIdInput: any;

  loading = false;
  setSelectedFlatId: any;
  setSelectedFlatName: any;
  selectedFlatName: any;

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
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getSelectParam();
    const selectedFlatName = localStorage.getItem('selectedFlatName');
    if (selectedFlatName !== null) {
      this.selectedFlatName = selectedFlatName;
      console.log(this.selectedFlatName)
      console.log('Назва вибраної оселі:', selectedFlatName);
    } else {
      console.log('Назва вибраної оселі не знайдена в сховищі');
    }
  }

  async getSelectParam(): Promise<void> {
    this.selectedFlatService.selectedFlatId$.subscribe(async (flatId: string | null) => {
      this.selectedFlatId = flatId;
    });
  }

  async openDialog(): Promise<void> {
    const selectedFlatName = localStorage.getItem('selectedFlatName');
    if (selectedFlatName !== null) {
      this.selectedFlatName = selectedFlatName
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
                this.sharedService.setStatusMessage('Оселя видалена');
                setTimeout(() => {
                  this.statusMessage = '';
                  this.reloadPageWithLoader()
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

  async exitHouse(): Promise<void> {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('houseData');
    this.statusMessage = 'Виходимо з оселі';
    this.sharedService.setStatusMessage('Виходимо з оселі');
    setTimeout(() => {
      this.reloadPageWithLoader()
      this.statusMessage = '';
    }, 2000);
  }

}
