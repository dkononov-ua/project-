import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComunalComponent } from 'src/app/components/delete-comunal/delete-comunal.component';
import { ChangeComunService } from '../change-comun.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-comun-nav',
  templateUrl: './comun-nav.component.html',
  styleUrls: ['./comun-nav.component.scss'],
  template: '{{ selectedFlatId }}'
})
export class ComunNavComponent implements OnInit {

  popular_comunal_names = [
    "Опалення",
    "Водопостачання",
    "Вивіз сміття",
    "Електроенергія",
    "Газопостачання",
    "Комунальна плата за утримання будинку",
    "Охорона будинку",
    "Ремонт під'їзду",
    "Ліфт",
    "Інтернет та телебачення",
    "Домофон",
  ];



  houses: { id: number, name: string }[] = [];
  addressHouse: FormGroup | undefined;

  selectHouse = new FormGroup({
    house: new FormControl('виберіть оселю')
  });

  formGroup: FormGroup | undefined;

  loading = false;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  comunCreate!: FormGroup;
  showInput = false;
  selectedComun: any;
  selectedFlatId!: string | null;
  comunal_name!: string | any;

  customComunal: string = '';

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private changeComunService: ChangeComunService,
    private selectedFlatService: SelectedFlatService,
  ) { }

  ngOnInit(): void {
    this.changeComunService.selectedComun$.subscribe(Comun => {
      if (Comun !== null && Comun !== undefined) {
        this.selectedComun = Comun;
      } else { }
    });

    this.selectedFlatService.selectedFlatId$.subscribe((flatId: string | null) => {
      this.selectedFlatId = flatId || this.selectedFlatId;
    });

    this.getComunalName()

    const userJson = localStorage.getItem('user');
    const selectedComun = localStorage.getItem('selectedComun');

    if (userJson && this.selectedComun) {
      if (selectedComun) {
        this.selectedComun = selectedComun;
        this.getComunalName();
      }

    } else {
      console.log('user not found');
    }
  }

  onSelectionChangeComun(): void {
    this.changeComunService.setSelectedComun(this.selectedComun);
  }

  getComunalName(): void {
    const userJson = localStorage.getItem('user');
    if (userJson)
      this.http.post('http://localhost:3000/comunal/get/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: this.selectedComun })
        .subscribe(
          (response: any) => {
            console.log(response)
            this.comunal_name = response.comunal;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }

  createComunName() {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const selectedComun = this.selectedComun || this.customComunal;
      if (selectedComun) {
        this.http.post('http://localhost:3000/comunal/add/button', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: selectedComun })
          .subscribe((response: any) => {
            console.log(response);
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('Назва послуги не введена');
      }
    } else {
      console.log('user not found');
    }
    location.reload();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DeleteComunalComponent);
    'Ви точно хочете видалити щось'
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedTemplateId = this.selectHouse.get('house')?.value;
        const houseJson = localStorage.getItem('house');
        if (houseJson) {
          console.log(JSON.parse(houseJson))
        }

        const userJson = localStorage.getItem('user');
        if (userJson) {
          this.http.post('http://localhost:3000/comunal/delete/button', { auth: JSON.parse(userJson), flat_id: selectedTemplateId, comunal_name: this.selectedComun })
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


}

