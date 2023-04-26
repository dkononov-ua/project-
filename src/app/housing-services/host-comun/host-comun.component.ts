import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComunalComponent } from 'src/app/components/delete-comunal/delete-comunal.component';


@Component({
  selector: 'app-host-comun',
  templateUrl: './host-comun.component.html',
  styleUrls: ['./host-comun.component.scss'],
  template: '{{ selectedFlatId }}'
})
export class HostComunComponent implements OnInit {

  public selectedComunal: any | null;
  public selectedFlatId: any | null;
  public comunal_name!: string | any;

  houses: { id: number, name: string }[] = [];
  addressHouse: FormGroup | undefined;

  selectHouse = new FormGroup({
    house: new FormControl('виберіть оселю')
  });

  formGroup: FormGroup | undefined;

  loading = false;
  selectedFlatId$: any;

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
    const dialogRef = this.dialog.open(DeleteComunalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedTemplateId = this.selectHouse.get('house')?.value;
        const houseJson = localStorage.getItem('house');
        if (houseJson) {
          console.log(JSON.parse(houseJson))
        }

        const userJson = localStorage.getItem('user');
        if (userJson) {
          this.http.post('http://localhost:3000/comunal/delete/button', { auth: JSON.parse(userJson), flat_id: selectedTemplateId, comunal_name: this.selectedComunal})
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
    this.comunCreate = this.fb.group({
      comunal_name: ['', Validators.required],
    });

    const userJson = localStorage.getItem('user');
    if (userJson) {
      const houseJson = localStorage.getItem('house');
      if (houseJson) {
        this.selectHouse.setValue({ house: JSON.parse(houseJson).flat_id });
      }

      this.getHouseInfo(userJson);
      this.selectHouse.get('house')?.valueChanges.subscribe(selectedFlatId => {
        if (selectedFlatId) {
          localStorage.removeItem('house');
          localStorage.setItem('house', JSON.stringify({ flat_id: selectedFlatId }));
          this.getFlatInfo(userJson, selectedFlatId);
          this.getComunalInfo(userJson, selectedFlatId, this.comunal_name);
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

  onSelectionChangeFlatInfo() {
    this.loading = true;
    localStorage.removeItem('house')
    localStorage.setItem('house', JSON.stringify({ flat_id: this.selectedFlatId }))
    localStorage.removeItem('comunal_name')
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
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
    location.reload();
  }

  onSelectionChangeComunalInfo() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      localStorage.removeItem('comunal_name')
      console.log('Ви вибрали послуги:', this.selectedComunal);
      localStorage.setItem('comunal_name', JSON.stringify({ comunal: this.selectedComunal }));
      this.http.post('http://localhost:3000/comunal/get/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: this.selectedComunal })
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
    location.reload();
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

  onSubmitComunCreate() {
    this.loading = true;

    const userJson = localStorage.getItem('user');
    if (userJson) {
      if (this.comunCreate) {
        this.http.post('http://localhost:3000/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: this.comunCreate?.value.comunal_name })
          .subscribe((response: any) => {
            console.log(response);
            console.log(this.comunCreate.value);
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('comunCreate is not defined');
      }
    } else {
      console.log('user not found');
    }
    location.reload();

  }

}
