import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserInteractionComponent } from '../interaction/user-interaction/user-interaction.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InformationUserComponent } from './information-user/information-user.component';

const appRoutes: Routes = [
  { path: 'user-interaction', component: UserInteractionComponent },
  { path: 'information-user', component: InformationUserComponent },
];

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }

@Injectable({
  providedIn: 'root'
})
export class DataService {
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  formErrors: any = {
    username: '',
    password: '',
    email: '',
    regPassword: '',
    regEmail: ''
  };

  validationMessages: any = {
    username: {
      required: 'Ім`я обов`язково',
      minlength: 'Мінімальна довжина 3 символи',
      maxlength: 'Максимальна довжина 15 символів'
    },
    password: {
      required: 'Пароль обов`язково',
      minlength: 'Мінімальна довжина 7 символів',
      maxlength: 'Максимальна довжина 25 символів'
    },
    email: {
      required: 'Пошта обов`язкова',
      pattern: 'Невірно вказаний пошта',
    },

    regPassword: {
      required: 'Пароль обов`язково',
      minlength: 'Мінімальна довжина 7 символів',
      maxlength: 'Максимальна довжина 25 символів'
    },
    regEmail: {
      required: 'Пошта обов`язкова',
      pattern: 'Невірно вказаний пошта',
    },
  };

  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm()

    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('login');
    const container = document.getElementById('container');

    registerButton?.addEventListener("click", () => {
      container?.classList.add("right-panel-active");
    });

    loginButton?.addEventListener("click", () => {
      container?.classList.remove("right-panel-active");
    });
  }

  onSubmit(formType: string): void {
    console.log('Form submitted');
    console.log(this.userForm.value);

    let route = '/user-interaction';
    if (formType === 'information') {
      route = '/information-user';
    }

    this.http.post('http://localhost:3000', this.userForm.value).subscribe((response: any) => {
      console.log(response);
      this.router.navigate([route]); // редірект на відповідну сторінку
    }, (error: any) => {
      console.error(error);
    });
  }


  private initializeForm(): void {
    this.userForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      regPassword: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      regEmail: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
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




