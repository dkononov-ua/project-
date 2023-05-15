import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
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
})

export class AddressComponent implements OnInit {

  houses: { id: string, name: string }[] = [];
  public selectedFlatId: any | null;
  public locationLink: string = '';
  location: string | null = null;
  errorMessage$ = new Subject<string>();

  addressHouse: any = {
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
  }

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

  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComponent: HostComponent) {
    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId) => {
      this.selectedFlatId = selectedFlatId;
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            if (response !== null) {
              this.addressHouse = this.fb.group({
                flat_id: [response.flat.flat_id],
                country: [response.flat.country],
                region: [response.flat.region],
                city: [response.flat.city],
                street: [response.flat.street],
                houseNumber: [response.flat.houseNumber],
                apartment: [response.flat.apartment],
                flat_index: [response.flat.flat_index],
                private: [response.flat.private],
                rent: [response.flat.rent],
                live: [response.flat.live],
                who_live: [response.flat.who_live],
                subscribers: [response.flat.subscribers],
              });

              const baseUrl = 'https://www.google.com/maps/place/';
              const region = response.flat.region || '';
              const city = response.flat.city || '';
              const street = response.flat.street || '';
              const houseNumber = response.flat.houseNumber || '';
              const flatIndex = response.flat.flat_index || '';

              const encodedRegion = encodeURIComponent(region);
              const encodedCity = encodeURIComponent(city);
              const encodedStreet = encodeURIComponent(street);
              const encodedHouseNumber = encodeURIComponent(houseNumber);
              const encodedFlatIndex = encodeURIComponent(flatIndex);
              this.location = `${baseUrl}${encodedStreet},+${encodedHouseNumber},+${encodedCity},+${encodedRegion},+${encodedFlatIndex}`;
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
    if (this.addressHouse.valid) {
      this.locationLink = this.generateLocationUrl();
    }
  }

  generateLocationUrl() {
    const baseUrl = 'https://www.google.com/maps/place/';
    const region = this.addressHouse.region || '';
    const city = this.addressHouse.city || '';
    const street = this.addressHouse.street || '';
    const houseNumber = this.addressHouse.houseNumber || '';
    const flatIndex = this.addressHouse.flat_index || '';

    const encodedRegion = encodeURIComponent(region);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    const encodedHouseNumber = encodeURIComponent(houseNumber);
    const encodedFlatIndex = encodeURIComponent(flatIndex);

    const locationUrl = `${baseUrl}${encodedStreet}+${encodedHouseNumber},${encodedCity},${encodedRegion},${encodedFlatIndex}`;
    this.locationLink = locationUrl;

    return locationUrl;
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

  initializeForm(): void {
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
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
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
        Validators.pattern(/^[0-9]+$/),
      ]],
      apartment: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/),
      ]],
      city: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      region: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      country: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      flat_index: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]+$/),
      ]],
      private: [null, [Validators.required]],
      rent: [null, [Validators.required]],
      live: [null, [Validators.required]],
    });

    this.addressHouse.valueChanges?.subscribe(() => this.onValueChanged());
  }

  onValueChanged() {
    const addressHouse = this.addressHouse;
    if (!addressHouse) {
      return;
    }

    Object.keys(this.formErrors).forEach(field => {
      this.formErrors[field] = '';
    });

    Object.keys(addressHouse.controls).forEach(field => {
      const control = addressHouse.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }
}
