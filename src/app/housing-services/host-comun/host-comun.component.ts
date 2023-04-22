import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-host-comun',
  templateUrl: './host-comun.component.html',
  styleUrls: ['./host-comun.component.scss'],
  template: '{{ selectedFlatId }}'
})
export class HostComunComponent implements OnInit {

  public selectedComunal: any | null;
  public selectedFlatId: any | null;
  public comunal_name: any;

  houses: { id: number, name: string }[] = [];
  addressHouse: FormGroup | undefined;

  selectHouse = new FormGroup({
    house: new FormControl('виберіть оселю')
  });

  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  comunCreate!: FormGroup;
  showInput = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private dialog: MatDialog,) { }

  openDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedFlatId = this.selectHouse.get('house')?.value;
        const houseJson = localStorage.getItem('house');
        if (houseJson) {
          console.log(JSON.parse(houseJson))
        }

        const userJson = localStorage.getItem('user');
        if (userJson) {
          this.http.post('http://localhost:3000/flatinfo/deleteflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
            .subscribe((response: any) => {
              console.log(response);
            }, (error: any) => {
              console.error(error);
            });
        } else {
          console.log('house not found');
        }
        location.reload();
      }
    });
  }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseJson = localStorage.getItem('house');
      if (houseJson) {
        this.selectHouse.setValue({ house: JSON.parse(houseJson).flat_id });
      }

      this.getHouseInfo(userJson);
      this.selectHouse.get('house')?.valueChanges.subscribe(selectedFlatId => {
        if (selectedFlatId) {
          console.log('Ви вибрали оселю з ID:', selectedFlatId);
          localStorage.removeItem('house');
          localStorage.setItem('house', JSON.stringify({ flat_id: selectedFlatId }));
          this.getFlatInfo(userJson, selectedFlatId);
          this.getComunalInfo(userJson, selectedFlatId, this.comunal_name);
          console.log(this.comunal_name)

          // Зберегти вибір користувача
          localStorage.setItem('selectedComunal', selectedFlatId);
        } else {
          console.log('Нічого не вибрано');
        }
      });

      const selectedComunal: string | null = localStorage.getItem('comunal_name');
      if (selectedComunal) {
        this.selectedComunal = JSON.parse(selectedComunal).comunal
        this.getComunalInfo(userJson, selectedComunal, this.comunal_name);
      }

    } else {
      console.log('user not found');
    }
  }

  getHouseInfo(userJson: string): void {
    this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
      .subscribe(
        (response: any) => {
          this.houses = response.ids.map((item: { flat_id: any }, index: number) => ({
            id: index + 1,
            name: item.flat_id
          }));
          const houseJson = localStorage.getItem('house');
          if (houseJson) {
            this.selectHouse.setValue({ house: JSON.parse(houseJson).flat_id });
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  onSelectionChange() {
    this.loading = true;

    if (this.selectedFlatId) {

      console.log('Ви вибрали оселю з ID:', this.selectedFlatId);
      localStorage.setItem('house', JSON.stringify({ flat_id: this.selectedFlatId }));
      this.onSelectionChangeFlatInfo(this.selectedFlatId);
      this.onSelectionChangeComunalInfo(this.selectedComunal);

      location.reload();
    } else {
      console.log('Нічого не вибрано');
    }
  }

  getFlatInfo(userJson: string, selectedFlatId: string): void {
    this.selectedFlatId = selectedFlatId;
    this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
      .subscribe(
        (response: any) => {
          if (response !== null) {
            this.addressHouse = this.fb.group({
              flat_id: [response.flat.flat_id],
            });
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  getComunalInfo(userJson: string, selectedFlatId: string, comunal_name: any): void {
    this.http.post('http://localhost:3000/comunal/get/button', { auth: JSON.parse(userJson), flat_id: selectedFlatId, comunal: comunal_name })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.comunal_name = response.comunal;

        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  onSelectionChangeComunalInfo(comunalName: string) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      localStorage.removeItem('comunal_name')
      console.log('Ви вибрали послуги:', comunalName);
      localStorage.setItem('comunal_name', JSON.stringify({ comunal: comunalName }));

      this.http.post('http://localhost:3000/comunal/get/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: comunalName })
        .subscribe(
          (response: any) => {
            if (response !== null) {
              this.selectedComunal.setValue(response.comunal);
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user not found');
    }
  }

  onSelectionChangeFlatInfo(selectedFlatId: string) {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
        .subscribe(
          (response: any) => {
            if (response !== null) {
              this.addressHouse = this.fb.group({
                flat_id: [response.flat.flat_id],
              });
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      console.log('user not found');
    }
  }

  onSubmitComunCreate(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: this.comunCreate?.value.comunal_name })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
  }


  onSubmitDeleteHouse(): void {
    const selectedFlatId = this.selectHouse.get('house')?.value;
    const houseJson = localStorage.getItem('house');
    if (houseJson) {
      console.log(JSON.parse(houseJson))
    }

    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/deleteflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
    location.reload();
  }
}
