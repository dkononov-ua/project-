import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from '../auth.service';

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
    firstName: new FormControl({ value: '', disabled: true }),
    lastName: new FormControl({ value: '', disabled: true }),
    surName: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    password: new FormControl({ value: '', disabled: true }),
    dob: new FormControl({ value: '', disabled: true }),
    phone: new FormControl({ value: '', disabled: true }),
    telegram: new FormControl({ value: '', disabled: true }),
    facebook: new FormControl({ value: '', disabled: true }),
    instagram: new FormControl({ value: '', disabled: true }),
    mail: new FormControl({ value: '', disabled: true }),
    viber: new FormControl({ value: '', disabled: true }),
  };

  formErrors: any = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  validationMessages: any = {
    firstName: {
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
    surName: {
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
    telegram: {
      required: 'Телефон обов`язковий',
      minlength: 'Формат введення 10 символів',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
    facebook: {
      required: 'Телефон обов`язковий',
      minlength: 'Формат введення 10 символів',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
    instagram: {
      required: 'Телефон обов`язковий',
      minlength: 'Формат введення 10 символів',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
    viber: {
      required: 'Телефон обов`язковий',
      minlength: 'Формат введення 10 символів',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
    mail: {
      required: 'Телефон обов`язковий',
      minlength: 'Формат введення 10 символів',
      maxlength: 'Максимальна довжина 10 символів',
      pattern: 'Телефон повинен містити тільки цифри'
    },
  };

  userForm!: FormGroup;
  userFormContacts!: FormGroup;
  isDisabled = false;
  formDisabled = false;
  errorMessage$ = new Subject<string>();

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    console.log('Пройшла перевірка користувача')
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      // const user = JSON.parse(userJson)
      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          this.userForm = this.fb.group({
            firstName: [response.inf.firstName],
            lastName: [response.inf.lastName],
            email: [response.inf.email],
            surName: [response.inf.surName],
            dob: [response.inf.dob],
            password: [response.inf.password],
          });
          this.userForm.disable();
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });

      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          this.userFormContacts = this.fb.group({
            phone: [response.cont.tell],
            telegram: [response.cont.telegram],
            facebook: [response.cont.facebook],
            instagram: [response.cont.instagram],
            viber: [response.cont.vider],
            mail: [response.cont.email],
          });
          this.userFormContacts.disable(); // додайте цей рядок
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });

    } else {
      console.log('user not found');
    }
    this.initializeForm();
  }

  onSubmitSaveUserData(): void {
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      // const user = JSON.parse(userJson)
      this.http.post('http://localhost:3000/add/user', { auth: JSON.parse(userJson), new: this.userForm.value })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
      // ...
    } else {
      console.log('user not found');
    }
  }

  saveUserData(): void {
    this.userForm.disable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editUserData(): void {
    this.userForm.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetUserForm() {
    this.userForm.reset();
  }

  onSubmitSaveUserFormContacts(): void {
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      // const contacts = JSON.parse(contactsJson)
      this.http.post('http://localhost:3000/add/contacts', { auth: JSON.parse(userJson), new: this.userFormContacts.value })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
      // ...
    } else {
      console.log('Error retrieving data');
    }
  }

  saveUserFormContactsData(): void {
    this.userFormContacts.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    // відправляємо дані на сервер і зберігаємо їх
    // після успішного збереження змінюємо стан на редагування
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editUserFormContactsData(): void {
    this.userFormContacts.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetUserFormContacts() {
    this.userFormContacts.reset();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      surName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      dob: [null, [Validators.required, Validators.min(Date.parse('1900-01-01')), Validators.max(new Date().getTime())]],
    });

    this.userFormContacts = this.fb.group({
      phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      facebook: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      telegram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      instagram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      viber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      mail: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
    });

    this.userForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.userFormContacts.valueChanges?.subscribe(() => this.onValueChanged());
  };

  passwordType: string = 'password';

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  };

  logout() {
    this.authService.logout();
  }

  private onValueChanged() {
    this.formErrors = {};

    const userForm = this.userForm;
    for (const field in userForm.controls) {
      const control = userForm.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

    const userFormContacts = this.userFormContacts;
    for (const field in userFormContacts.controls) {
      const control = userFormContacts.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        };
      };
    };
  };

};
