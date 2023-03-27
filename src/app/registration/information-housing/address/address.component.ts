import { HttpClient } from '@angular/common/http';
import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})

export class AddressComponent implements OnInit {
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
  };

  errorMessage$ = new Subject<string>();
  houses: any;
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;

  addressHouse!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.addressHouse = this.fb.group({
      country: [{ value: '', disabled: true }],
      region: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      street: [{ value: '', disabled: true }],
      houseNumber: [{ value: '', disabled: true }],
      apartment: [{ value: '', disabled: true }],
      private: [{ value: '', disabled: true }],
      rent: [{ value: '', disabled: true }],
      live: [{ value: '', disabled: true }],
      who_live: [{ value: '', disabled: true }],
      subscribers: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmitSelectHouse(): void {
    const selectedFlatId = this.selectHouse.get('house')?.value;
    console.log('Ви вибрали оселю з ID:', selectedFlatId);

    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
        .subscribe((response: any) => {
          console.log(response.flat.street);
          if (response.flat.street !== null) {
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
  }

  onSubmitSaveAddressHouse(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.addressHouse.value()})
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

  // Валідація
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
      index: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]+$/), // only digits
      ]],
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
