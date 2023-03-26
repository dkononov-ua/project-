import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserService } from '../../registration/information-user/user.service';

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
  ]
})

@Injectable({
  providedIn: 'root'
})

export class AppComponent {

  constructor(private userService: UserService) { }

  onSubmit(email: string, password: string) {
    this.userService.getUserInfo(email, password).subscribe((response) => {
      console.log(response);
      // тут ви можете обробити відповідь сервера та відобразити її на сторінці
    });
  }
}

@Component({
  selector: 'app-information-housing',
  templateUrl: './information-housing.component.html',
  styleUrls: ['./information-housing.component.scss'],
})
export class InformationHousingComponent implements OnInit {
  houseForm!: FormGroup;
  houseCreate!: FormGroup;
  selectHouse!: FormGroup;
  isDisabled = false;
  formDisabled = false;
  errorMessage$ = new Subject<string>();
  showInput = false;
  houses: { id: string, name: string }[] = [];
  data = '';
  formBuilder: any;

  house = {
    flat_id: '',
    country: new FormControl({ value: '', disabled: true }),
    region: new FormControl({ value: '', disabled: true }),
    city: new FormControl({ value: '', disabled: true }),
    street: new FormControl({ value: '', disabled: true }),
    houseNumber: new FormControl({ value: '', disabled: true }),
    apartment: new FormControl({ value: '', disabled: true }),
    private: new FormControl({ value: '', disabled: true }),
    rent: new FormControl({ value: '', disabled: true }),
    live: new FormControl({ value: '', disabled: true }),
    who_live: new FormControl({ value: '', disabled: true }),
    subscribers: new FormControl({ value: '', disabled: true }),
  };

  houseParam = {
    rooms: new FormControl({ value: '', disabled: true }),
    repair_status: new FormControl({ value: '', disabled: true }),
    area: new FormControl({ value: '', disabled: true }),
    kitchen_area: new FormControl({ value: '', disabled: true }),
    balcony: new FormControl({ value: '', disabled: true }),
    floor: new FormControl({ value: '', disabled: true }),
  };

  houseAbout = {
    metro: new FormControl({ value: '', disabled: true }),
    distance_metro: new FormControl({ value: '', disabled: true }),
    distance_stops: new FormControl({ value: '', disabled: true }),
    distance_shop: new FormControl({ value: '', disabled: true }),
    distance_green: new FormControl({ value: '', disabled: true }),
    distance_parking: new FormControl({ value: '', disabled: true }),
    woman: new FormControl({ value: '', disabled: true }),
    man: new FormControl({ value: '', disabled: true }),
    family: new FormControl({ value: '', disabled: true }),
    students: new FormControl({ value: '', disabled: true }),
    animals: new FormControl({ value: '', disabled: true }),
    price_m: new FormControl({ value: '', disabled: true }),
    price_y: new FormControl({ value: '', disabled: true }),
    about: new FormControl({ value: '', disabled: true }),
    bunker: new FormControl({ value: '', disabled: true }),
  };

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

    rooms: '',
    repair_status: '',
    area: '',
    kitchen_area: '',
    balcony: '',
    floor: '',
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
    index: {
      required: 'Індекс обов`язковий',
      minlength: 'Мінімальна довжина 5 символи',
      maxlength: 'Максимальна довжина 5 символів',
      pattern: 'Тільки цифри',
    },
  };

  saveData() {
    if (this.data.trim()) {
      // зберігаємо дані
      this.showInput = false;
    }
  }

  constructor(private fb: FormBuilder, private http: HttpClient) { }

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

  onSubmitSaveHouseData(): void {
    const selectedFlat_id = this.selectHouse.get('house')?.value;

    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      // const user = JSON.parse(houseJson)
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.houseForm.value, flat_id: selectedFlat_id })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
      // ...
    } else {
      console.log('house not found');
    }
  }

  saveHouseFormData(): void {
    this.houseForm.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    // відправляємо дані на сервер і зберігаємо їх

    // після успішного збереження змінюємо стан на редагування
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editHouseFormData(): void {
    this.houseForm.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetHouseForm() {
    this.houseForm.reset();
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
            this.houseForm = this.fb.group({
              street: [response.flat.street]
            })
          }

          this.houseForm = this.fb.group({
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

          // this.houseParam = this.fb.group({
          //   rooms: [response.flat.rooms],
          //   repair_status: [response.flat.repair_status],
          //   area: [response.flat.area],
          //   kitchen_area: [response.flat.kitchen_area],
          //   balcony: [response.flat.balcony],
          //   floor: [response.flat.floor],
          // });

          // this.houseAbout = this.fb.group({
          //   metro: [response.flat.metro],
          //   distance_metro: [response.flat.distance_metro],
          //   distance_stops: [response.flat.distance_stops],
          //   distance_shop: [response.flat.distance_shop],
          //   distance_green: [response.flat.distance_green],
          //   distance_parking: [response.flat.distance_parking],
          //   woman: [response.flat.woman],
          //   man: [response.flat.man],
          //   family: [response.flat.family],
          //   students: [response.flat.students],
          //   animals: [response.flat.animals],
          //   price_m: [response.flat.price_m],
          //   price_y: [response.flat.price_y],
          //   about: [response.flat.about],
          //   bunker: [response.flat.bunker],
          // });

        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }


  // HouseAbout

  // onSubmitSaveHouseAboutData(): void {
  //   const userJson = localStorage.getItem('user');
  //   if (userJson !== null) {
  //     this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.houseAbout })
  //       .subscribe((response: any) => {
  //         console.log(response);
  //       }, (error: any) => {
  //         console.error(error);
  //       });
  //   } else {
  //     console.log('house not found');
  //   }
  // }

  // saveHouseAboutData(): void {
  //   this.houseAbout.disable();
  //   this.isDisabled = true;
  //   this.formDisabled = true;
  //   // відправляємо дані на сервер і зберігаємо їх

  //   // після успішного збереження змінюємо стан на редагування
  //   this.isDisabled = false;
  //   this.formDisabled = false;
  // }

  // editHouseAboutData(): void {
  //   this.houseAbout.enable();
  //   this.isDisabled = false;
  //   this.formDisabled = false;
  // }

  // resetHouseAboutData() {
  //   this.houseAbout.reset();
  // }

  // HouseParam

  // onSubmitSaveHouseParamData(): void {
  //   const userJson = localStorage.getItem('user');
  //   if (userJson !== null) {
  //     this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.houseParam })
  //       .subscribe((response: any) => {
  //         console.log(response);
  //       }, (error: any) => {
  //         console.error(error);
  //       });
  //   } else {
  //     console.log('house not found');
  //   }
  // }

  // saveHouseParamData(): void {
  //   this.houseParam.disable();
  //   this.isDisabled = true;
  //   this.formDisabled = true;
  //   // відправляємо дані на сервер і зберігаємо їх

  //   // після успішного збереження змінюємо стан на редагування
  //   this.isDisabled = false;
  //   this.formDisabled = false;
  // }

  // editHouseParamData(): void {
  //   this.houseParam.enable();
  //   this.isDisabled = false;
  //   this.formDisabled = false;
  // }

  // resetHouseParam() {
  //   this.houseParam.reset();
  // }

  // Валідація

  private initializeForm(): void {
    this.houseCreate = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(20),
      ]],
    });
    this.houseForm = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
      street: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // тільки літери та пробіли
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
        Validators.pattern(/^[0-9]+$/), // тільки цифри
      ]],
      apartment: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/), // тільки цифри
      ]],
      city: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // тільки літери та пробіли
      ]],
      region: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/), // тільки літери та пробіли
      ]],
      index: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]+$/), // тільки цифри
      ]],
    });

    this.houseForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.houseCreate.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const houseCreate = this.houseCreate;
    for (const field in houseCreate.controls) {
      const control = houseCreate.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

    const houseForm = this.houseForm;
    for (const field in houseForm.controls) {
      const control = houseForm.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
};


