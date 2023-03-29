import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from '../auth.service';
import { DataService } from '../../data.service';
// import { FileUploader } from 'ng2-file-upload';

// const URL = 'http://localhost:3000/api/upload';
// public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });


// export class FileUploadComponent {
//   public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});

//   constructor () {
//     this.uploader.onAfterAddingFile = (file: { withCredentials: boolean; }) => { file.withCredentials = false; };
//     this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
//         console.log('ImageUpload:uploaded:', item, status, response);
//         alert('File uploaded successfully');
//     };
//   }
// }

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
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss']
})
export class InformationUserComponent implements OnInit {

  data = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    tell: '',
    phone_alt: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  formErrors: any = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    tell: '',
    phone_alt: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    tell: {
      required: 'Телефон не обов`язковий',
    },
    phone_alt: {
      required: 'Телефон додатковий не обов`язковий',
    },
    telegram: {
      required: 'telegram не обов`язковий',
    },
    facebook: {
      required: 'facebook не обов`язковий',
    },
    instagram: {
      required: 'instagram не обов`язковий',
    },
    viber: {
      required: 'viber не обов`язковий',
    },
    mail: {
      required: 'mail не обов`язковий',
    },
  };

  userForm!: FormGroup;
  userFormContacts!: FormGroup;
  errorMessage$ = new Subject<string>();


  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private dataService: DataService) {  }

  showPassword = false;
  isPasswordVisible = false;
  passwordType = 'password';

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  };

  ngOnInit(): void {
    console.log('Пройшла перевірка користувача')
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
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

          // це для виводу інформації на профіль користувача h1, p і т.д
          this.dataService.getData().subscribe((response: any) => {
            this.data.firstName = response.inf.firstName;
            this.data.lastName = response.inf.lastName;
            this.data.surName = response.inf.surName;
            this.data.email = response.inf.email;
            this.data.password = response.inf.password;
          });
        }, (error: any) => {
          console.error(error);
        });

      this.http.post('http://localhost:3000/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          console.log(response);

          this.userFormContacts = this.fb.group({
            tell: [response.cont.tell],
            phone_alt: [response.cont.phone_alt],
            viber: [response.cont.viber],
            telegram: [response.cont.telegram],
            facebook: [response.cont.facebook],
            instagram: [response.cont.instagram],
            mail: [response.cont.mail],
          });

          // блокуємо форму при оновленні сторінки
        }, (error: any) => {
          console.error(error);
        });

    } else {
      console.log('user not found');
    }
    this.initializeForm();
  }

  // зберігаємо інфо користувача
  onSubmitSaveUserData(): void {
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      this.http.post('http://localhost:3000/add/user', { auth: JSON.parse(userJson), new: this.userForm.value })
        .subscribe((response: any) => {
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('не вийшло зберегти');
    }
  }

  // зберігаємо контактні дані
  onSubmitSaveUserFormContacts(): void {
    console.log(this.userFormContacts.value)
    const userJson = localStorage.getItem('user');

    if (userJson !== null) {
      this.http.post('http://localhost:3000/add/contacts', { auth: JSON.parse(userJson), new: this.userFormContacts.value })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('Error retrieving data');
    }
  }

  saveUserData(): void {
    this.userForm.disable();
  }

  editUserData(): void {
    this.userForm.enable();
  }

  resetUserForm() {
    this.userForm.reset();
  }

  resetUserFormContacts() {
    this.userFormContacts.reset();
  }

  logout() {
    this.authService.logout();
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
      tell: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      phone_alt: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      facebook: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      telegram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      instagram: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      viber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      mail: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
    });

    this.userForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.userFormContacts.valueChanges?.subscribe(() => this.onValueChanged());
  };

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
