import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
  styleUrls: ['./information-housing.component.scss']
})
export class InformationHousingComponent implements OnInit {

  user = {
    houseId: '',
    street: '',
    houseNumber: '',
    floor: '',
    apartment: '',
    city: '',
    region: '',
    index: '',
  };

  formErrors: any = {
    houseId: '',
    street: '',
    houseNumber: '',
    floor: '',
    apartment: '',
    city: '',
    region: '',
    index: '',
  };

  validationMessages: any = {
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

  houseForm!: FormGroup;
  isDisabled = false;
  formDisabled = false;
  errorMessage$ = new Subject<string>();

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    console.log('Пройшла перевірка оселі')
    const houseJson = localStorage.getItem('house');
    if (houseJson !== null) {
      // const user = JSON.parse(userJson)
      this.http.post('http://localhost:3000/houseinfo', JSON.parse(houseJson))
        .subscribe((response: any) => {
          this.houseForm = this.fb.group({
            street: [response.inf.street],
            houseNumber: [response.inf.houseNumber],
            floor: [response.inf.floor],
            apartment: [response.inf.apartment],
            city: [response.inf.city],
            region: [response.inf.region],
            index: [response.inf.index]
          });
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
      // ...
    } else {
      console.log('house not found');
    }

    this.initializeForm();
  }

  onSubmitSaveHouseData(): void {
    const houseJson = localStorage.getItem('user');

    if (houseJson !== null) {
      // const user = JSON.parse(houseJson)
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(houseJson), new: this.houseForm.value })
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

  // http://localhost:3000/flatinfo/add/addres - про квартиру передати
  // http://localhost:3000/flatinfo/localflat - глобально про квартиру отримати
  // http://localhost:3000/flatinfo/add/about - про квартиру передати

  // onSubmitSaveHouseData(): void {
  //   const houseJson = localStorage.getItem('user');

  //   if (houseJson !== null) {
  //     // const user = JSON.parse(houseJson)
  //     this.http.post('http://localhost:3000/flatinfo/add/about', { auth: JSON.parse(houseJson), new: this.houseForm.value })
  //       .subscribe((response: any) => {
  //         console.log(response);
  //       }, (error: any) => {
  //         console.error(error);
  //       });
  //     // ...
  //   } else {
  //     console.log('house not found');
  //   }
  // }

  private initializeForm(): void {
    this.houseForm = this.fb.group({
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
  }

  passwordType: string = 'password';

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  private onValueChanged() {
    this.formErrors = {};

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


