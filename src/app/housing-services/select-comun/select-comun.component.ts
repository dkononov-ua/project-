import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeComunService } from '../change-comun.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
@Component({
  selector: 'app-select-comun',
  templateUrl: './select-comun.component.html',
  styleUrls: ['./select-comun.component.scss'],
})
export class SelectComunComponent implements OnInit {

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

  loading = false;
  showInput = false;

  selectedComun: any;
  selectedFlatId!: string | null;
  comunal_name!: string | any;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
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
  }

  onSelectionChangeComun(): void {
    this.changeComunService.setSelectedComun(this.selectedComun);
  }

  getComunalName(): void {
    const userJson = localStorage.getItem('user');

    if (!userJson) {
      console.error('LocalStorage не містить дані користувача');
      return;
    }
    const requestData = {
      auth: JSON.parse(userJson),
      flat_id: this.selectedFlatId,
    };
    this.http.post('http://localhost:3000/comunal/get/button', requestData)
      .subscribe(
        (response: any) => {
          if (response.comunal === false) {
            console.log('Немає послуг');
            return;
          }
          const firstComunal = response.comunal[0];
          if (firstComunal && firstComunal.iban !== undefined) {
            console.log(true);
            this.comunal_name = response.comunal;
          } else {
            console.log(false);
          }
        },
        (error: any) => {
          console.error('Помилка при отриманні даних: ', error);
        }
      );
  }

}

