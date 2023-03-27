import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ValidationService } from '../../validation.service';

@Component({
  selector: 'app-house-id',
  templateUrl: './house-id.component.html',
  styleUrls: ['./house-id.component.scss']
})
export class HouseIdComponent {
  houseCreate!: FormGroup;
  selectHouse!: FormGroup;
  errorMessage$ = new Subject<string>();
  houses: { id: string, name: string }[] = [];
  data = '';
  formBuilder: any;
  showInput: boolean | undefined;

  formErrors: any = {
    flat_id: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 20 символів',
    },
  };


  saveData() {
    if (this.data.trim()) {
      // зберігаємо дані
      this.showInput = false;
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private validationService: ValidationService) { }

  ngOnInit(): void {
    this.selectHouse = new FormGroup({
      house: new FormControl()
    });

    console.log('Пройшла перевірка оселі')
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      // const user = JSON.parse(userJson)
      this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe((response: any | undefined) => {
          this.houses = response.ids.map((item: { flat_id: any; }, index: number) => ({
            id: index + 1,
            name: item.flat_id
          }));

        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }

    this.initializeForm();
  }
  initializeForm() {
    throw new Error('Method not implemented.');
  }

  onSubmitSaveHouseCreate(): void {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.houseCreate.value })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
  }

  onSubmitSelectHouse(): void {
    const selectedFlat_id = this.selectHouse.get('house')?.value;
    console.log('Ви вибрали оселю з ID:', selectedFlat_id);

    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: selectedFlat_id })
        .subscribe((response: any) => {

          console.log(response.flat.street);
          if (response.flat.street === null) { } else {

          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }
}
