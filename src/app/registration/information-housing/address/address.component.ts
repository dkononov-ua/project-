import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HostComponent } from '../host/host.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ],
  template: '{{ selectedFlatId }}'
})

export class AddressComponent implements OnInit {

  houses: { id: string, name: string }[] = [];
  public selectedFlatId: any | null;

  formErrors: any = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: '',
    flat_index: '',
    private: '',
    rent: '',
    live: '',
    who_live: '',
    subscribers: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 20 символів',
    },
    street: {
      required: 'Вулиця обов`язкова',
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 20 символів',
      pattern: 'Тільки літери та пробіли'
    },
    houseNumber: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      maxlength: 'Максимальна довжина 5 символів',
    },
    floor: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
    apartment: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
    city: {
      required: 'Місто обов`язкове',
      minlength: 'Мінімальна довжина 2 символи',
      maxlength: 'Максимальна довжина 20 символів',
      pattern: 'Тільки літери та пробіли'
    },
    region: {
      required: 'Область обов`язкова',
      minlength: 'Мінімальна довжина 2 символи',
      maxlength: 'Максимальна довжина 20 символів',
      pattern: 'Тільки літери та пробіли'
    },
    country: {
      required: 'Область обов`язкова',
      minlength: 'Мінімальна довжина 2 символи',
      maxlength: 'Максимальна довжина 20 символів',
      pattern: 'Тільки літери та пробіли'
    },
    flat_index: {
      required: 'Індекс обов`язковий',
      minlength: 'Мінімальна довжина 5 символи',
      maxlength: 'Максимальна довжина 5 символів',
      pattern: 'Тільки цифри',
    },
    private: {
    },
    rent: {
    },
    live: {
    },
  };

  addressHouse!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComponent: HostComponent) {
    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId) => {
      this.selectedFlatId = selectedFlatId;
      console.log(222)
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            console.log(333333)
            console.log(this.selectedFlatId)
            console.log(response);
            if (response !== null) {
              this.addressHouse = this.fb.group({
                flat_id: [response.flat.flat_id, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
                country: [response.flat.country],
                region: [response.flat.region, [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
                city: [response.flat.city, [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
                street: [response.flat.street, [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
                houseNumber: [response.flat.houseNumber, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
                apartment: [response.flat.apartment, [Validators.required, Validators.minLength(1), Validators.pattern(/^[0-9]+$/)]],
                flat_index: [response.flat.flat_index, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(/^[0-9]+$/)]],
                private: [response.flat.private],
                rent: [response.flat.rent],
                live: [response.flat.live],
                who_live: [response.flat.who_live],
                subscribers: [response.flat.subscribers],
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

  onSubmitSaveAddressHouse(): void {
    console.log(this.addressHouse.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.addressHouse.value, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveAddressHouse(): void {
    this.addressHouse.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    // відправляємо дані на сервер і зберігаємо їх

    // після успішного збереження змінюємо стан на редагування
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editAddressHouse(): void {
    this.addressHouse.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetAddressHouse() {
    this.addressHouse.reset();
  }

  private initializeForm(): void {
    this.addressHouse = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
      street: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // only letters and spaces
      ]],
      houseNumber: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
      ]],
      floor: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^[0-9]+$/), // only digits
      ]],
      apartment: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/), // only digits
      ]],
      city: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // only letters and spaces
      ]],
      region: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // only letters and spaces
      ]],
      country: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // only letters and spaces
      ]],
      flat_index: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]+$/), // only digits
      ]],
      private: [null, [ ]],
      rent: [null, [ ]],
      live: [null, [ ]],
    });

    this.addressHouse.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const addressHouse = this.addressHouse;
    for (const field in addressHouse.controls) {
      const control = addressHouse.get(field);
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
