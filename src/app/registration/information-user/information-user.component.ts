import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ]
})

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://example.com/api';

  constructor(private http: HttpClient) { }

  saveData(data: any) {
    return this.http.post(`${this.apiUrl}/save`, data);
  }
}

@Component({
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss']
})
export class InformationUserComponent implements OnInit {

  formErrors: any = {
    name: '',
    password: '',
    email: '',
    lastName: ''
  };

  validationMessages: any = {
    name: {
      required: 'Ім`я обов`язково',
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 15 символів'
    },
    lastName: {
      required: 'Прізвище обов`язково',
      minlength: 'Мінімальна довжина 3 символи',
      maxlength: 'Максимальна довжина 15 символів'
    },
    password: {
      required: 'Пароль обов*язково',
      minlength: 'Мінімальна довжина 4 символів',
      maxlength: 'Максимальна довжина 15 символів'
    },
    email: {
      required: 'Пошта обов*язкова',
      pattern: 'Невірно вказаний пошта',
    },

  };

  userForm!: FormGroup
  dataService: any;
  userService: any;

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.initializeForm()
  }

  onSubmit(): void {
    console.log('Form submitted');
    console.log(this.userForm.value);

    if (this.userService) {
      this.userService.saveData(this.userForm.value).subscribe(
        () => console.log('Data saved successfully'),
        (error: any) => console.error('Error saving data: ', error)
      );
    }
  }

  resetForm() {
    this.userForm.reset();
  }



  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      lastName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
    });

    this.userForm.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    const form = this.userForm;

    Object.keys(this.formErrors).forEach(field => {
      const control = form.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        Object.keys(control.errors as ValidationErrors).forEach(key => {
          console.log(messages[key]);
          this.formErrors[field] += messages[key] + '';
        });
      }
    })
  }
}
