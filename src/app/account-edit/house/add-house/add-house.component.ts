import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DeleteHouseComponent } from '../delete-house/delete-house.component';

@Component({
  selector: 'app-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.scss'],
})

export class AddHouseComponent implements OnInit {

  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  flat_id: string = '';
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

  getSelectParam(): void {
    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId;
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
        .post('http://localhost:3000/flatinfo/add/flat_id', {
          auth: JSON.parse(userJson),
          new: { flat_id: this.flat_id },
        })
        .toPromise();

      this.reloadPageWithLoader()

    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteHouseComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const userJson = localStorage.getItem('user');
        if (this.selectedFlatId && userJson) {
          this.http
            .post('http://localhost:3000/flatinfo/deleteflat', {
              auth: JSON.parse(userJson),
              flat_id: this.selectedFlatId,
            })
            .subscribe(
              (response: any) => {
                localStorage.removeItem('selectedFlatId');
                this.selectedFlatService.clearSelectedFlatId();
              },
              (error: any) => {
                console.error(error);
              }
            );
          setTimeout(() => {
            location.reload();
          }, 200);
        } else {
          console.log('house not found');
        }
      }
    });
  }

  toggleInput(value: boolean): void {
    this.showInput = value;
    if (!this.showInput) {
      this.flat_id = '';
    }
  }
}
