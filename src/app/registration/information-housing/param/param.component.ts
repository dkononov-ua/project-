import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { HostComponent } from '../host/host.component';

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.scss'],
  template: '{{ selectedFlatId }}',
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(130%)' }))
      ])
    ])
  ],

})
export class ParamComponent {
  public selectedFlatId: any | null;

  formErrors: any = {
    rooms:'',
    repair_status:'',
    area:'',
    kitchen_area:'',
    balcony:'',
    floor:'',
  };

  validationMessages: any = {
    rooms: {
      required: 'Обов`язково',
    },
    repair_status: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
    area: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
    kitchen_area: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
    balcony: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
    floor: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
  };

  houseParam!: FormGroup | any;
  isDisabled: boolean | undefined;
  formDisabled: boolean | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComponent: HostComponent,) {
    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId) => {
      this.selectedFlatId = selectedFlatId;
      console.log(222)
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            console.log(response);
            if (response !== null) {
              this.houseParam = this.fb.group({
                rooms: [response.param.rooms],
                repair_status: [response.param.repair_status],
                area: [response.param.area],
                kitchen_area: [response.param.kitchen_area],
                balcony: [response.param.balcony],
                floor: [response.param.floor],
              });
            }
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('user not found');
      }

      this.initializeForm();

    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmitSaveHouseParam(): void {
    console.log(this.houseParam.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/parametrs', { auth: JSON.parse(userJson), new: this.houseParam.value, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveHouseParam(): void {
    this.houseParam.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    // відправляємо дані на сервер і зберігаємо їх

    // після успішного збереження змінюємо стан на редагування
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editHouseParam(): void {
    this.houseParam.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetHouseParam() {
    this.houseParam.reset();
  }

  private initializeForm(): void {
    this.houseParam = this.fb.group({
      rooms: [null, [
        Validators.required,
      ]],
      repair_status: [null, [
        Validators.required,
      ]],
      area: [null, [
        Validators.required,
      ]],
      kitchen_area: [null, [
        Validators.required,
      ]],
      balcony: [null, [
        Validators.required,
      ]],
      floor: [null, [
        Validators.required,
      ]],
    });

    this.houseParam.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const houseParam = this.houseParam;
    for (const field in houseParam.controls) {
      const control = houseParam.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
