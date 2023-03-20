import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';




@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
  ]
})

@Injectable({
  providedIn: 'root'
})

export class DataService {
  saveData(value: any) {
    throw new Error('Method not implemented.');
  }

}

@Component({
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss']
})
export class InformationUserComponent implements OnInit {

  user = {
    username: '',
    lastName: '',
    sureName: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    altPhone: '',
    street: '',
    houseNumber: '',
    floor: '',
    apartment: '',
    city: '',
    region: '',
    index: '',
  };

  formErrors: any = {
    username: '',
    lastName: '',
    sureName: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    altPhone: '',
    street: '',
    houseNumber: '',
    floor: '',
    apartment: '',
    city: '',
    region: '',
    index: '',
  };

  validationMessages: any = {
    username: {
      required: 'Ім`я обов`язково',
      minlength: 'Мінімум 3 символи',
      maxlength: 'Максимальна довжина 15 символів',
      pattern: 'Тільки літери та пробіли'
    },
    lastName: {
      required: 'Прізвище обов`язково',
      minlength: 'Мінімум 3 символи',
      maxlength: 'Максимальна довжина 15 символів',
      pattern: 'Тільки літери та пробіли'
    },
    sureName: {
      required: 'По батькові обов`язково',
      minlength: 'Мінімум 3 символи',
      maxlength: 'Максимальна довжина 15 символів',
      pattern: 'Тільки літери та пробіли'
    },
    password: {
      required: 'Пароль обов`язково',
      minlength: 'Мінімальна довжина 4 символів',
      maxlength: 'Максимальна довжина 15 символів'
    },
    email: {
      required: 'Пошта обов`язкова',
      pattern: 'Невірно вказаний пошта',
    },
    dob: {
      require: 'Це поле є обов`язковим.',
      min: 'Дата народження повинна бути не раніше 1900-01-01.',
      max: 'Дата народження повинна бути не пізніше поточної дати.'
    },
    phone: {
      required: 'Телефон обов`язковий',
      minlength: 'Формат введення 10 символів',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
    altPhone: {
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 15 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
    street: {
      required: 'Вулиця обов`язкова',
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 50 символів',
      pattern: 'Тільки літери та пробіли'
    },
    houseNumber: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      maxlength: 'Максимальна довжина 10 символів',
    },
    floor: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Не коректно',
    },
    apartment: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Не коректно',

    },
    city: {
      required: 'Місто обов`язкове',
      minlength: 'Мінімальна довжина 2 символи',
      maxlength: 'Максимальна довжина 20 символів',
      pattern: 'Місто повинно містити тільки літери та пробіли'
    },
    region: {
      required: 'Область обов`язкова',
      minlength: 'Мінімальна довжина 2 символи',
      maxlength: 'Максимальна довжина 20 символів',
      pattern: 'Область повинна містити тільки літери та пробіли'
    },
    index: {
      required: 'Індекс обов`язковий',
      minlength: 'Мінімальна довжина 3 символи',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Індекс повинен містити тільки цифри'
    },
  };

  userForm!: FormGroup;
  userFormContacts!: FormGroup;
  isDisabled = false;
  formDisabled = false;
  errorMessage$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmitSaveUserData(): void {
    this.http.get<{ status: boolean; userData: any }>(
      'http://localhost:3000/userData'
    ).subscribe((response) => {
      if (response.status) {
        console.log('Data retrieved successfully');
        const userData = response.userData;
        this.userForm.patchValue({
          username: userData.username,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          dob: userData.dob,
        });
      } else {
        this.errorMessage$.next('Error retrieving data');
      }
    });
  }
  saveUserData(): void {
    this.userForm.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editUserData(): void {
    this.userForm.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  onSubmitSaveUserFormContacts(): void {
    this.http.get<{ status: boolean; userContactsData: any }>(
      'http://localhost:3000/userContactsData'
    ).subscribe((response) => {
      if (response.status) {
        console.log('Data retrieved successfully');
        const userContactsData = response.userContactsData;
        this.userFormContacts.patchValue({
          phone: userContactsData.phone,
          altPhone: userContactsData.altPhone,
          street: userContactsData.street,
          houseNumber: userContactsData.houseNumber,
          floor: userContactsData.floor,
          apartment: userContactsData.apartment,
          city: userContactsData.city,
          region: userContactsData.region,
          index: userContactsData.index,
          // додайте інші поля, які ви отримали з сервера
        });
      } else {
        this.errorMessage$.next('Error retrieving data');
      }
    });
  }

  saveUserContactsData(): void {
    this.userFormContacts.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    // відправляємо дані на сервер і зберігаємо їх

    // після успішного збереження змінюємо стан на редагування
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editUserContactsData(): void {
    this.userFormContacts.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetUserForm() {
    this.userForm.reset();
  }

  resetUserFormContacts() {
    this.userFormContacts.reset();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      sureName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      dob: [null, [Validators.required, Validators.min(Date.parse('1900-01-01')), Validators.max(new Date().getTime())]]
      // додайте інші поля, які необхідно заповнити
    });

    this.userFormContacts = this.fb.group({
      phone: [null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/), // тільки цифри
      ]],
      altPhone: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]+$/), // тільки цифри
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
        Validators.maxLength(10),
      ]],
      floor: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern(/^[1-9][0-9]*$/)
      ]],
      apartment: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        Validators.pattern(/^[1-9][0-9]*$/)
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
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]+$/), // тільки цифри
      ]],
      // додайте інші поля, які необхідно заповнити
    });

    this.userForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.userFormContacts.valueChanges?.subscribe(() => this.onValueChanged());
  }

  passwordType: string = 'password';

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  private onValueChanged() {
    const form = this.userForm;
    this.formErrors = {};

    for (const field in form.controls) {
      const control = form.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

    const formContacts = this.userFormContacts;

    for (const field in formContacts.controls) {
      const control = formContacts.get(field);
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
