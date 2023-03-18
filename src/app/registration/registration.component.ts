import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserInteractionComponent } from '../interaction/user-interaction/user-interaction.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { InformationUserComponent } from './information-user/information-user.component';
import { AuthService } from 'src/app/registration/auth.service';
import { Subject } from 'rxjs';

const appRoutes: Routes = [
  { path: 'user-interaction', component: UserInteractionComponent },
  { path: 'information-user', component: InformationUserComponent },
];

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule,
  ]
})

export class AppRoutingModule { }

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  errorMessage$: Subject<string> = new Subject<string>();

  formErrors: any = {
    username: '',
    password: '',
    email: '',
    regPassword: '',
    regEmail: ''
  };

  validationMessages: any = {
    password: {
      required: 'Пароль обов`язково',
      minlength: 'Мінімальна довжина 7 символів',
      maxlength: 'Максимальна довжина 25 символів'
    },
    email: {
      required: 'Пошта обов`язкова',
      pattern: 'Невірно вказаний пошта',
    },
  };

  registrationValidationMessages: any = {
    username: {
      required: 'Ім`я обов`язково',
      minlength: 'Мінімальна довжина 3 символи',
      maxlength: 'Максимальна довжина 15 символів'
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

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  submitted: boolean | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();

    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('login');
    const container = document.getElementById('container');

    registerButton?.addEventListener("click", () => {
      container?.classList.add("right-panel-active");
      this.registrationForm.reset();
    });

    loginButton?.addEventListener("click", () => {
      container?.classList.remove("right-panel-active");
      this.loginForm.reset();
    });
  }

  onSubmit(formType: string): void {
    let route = '/information-user';

    this.http.post('http://localhost:3000', this.loginForm.value)
      .subscribe((response: any) => {
        if (response.status) {
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate([route]);
        } else {
          this.errorMessage$.next('Неправильний логін або пароль');
        }
      }, (error: any) => {
        console.error(error);
        this.errorMessage$.next('Сталася помилка на сервері');
      });
  }

  onSubmitRegistrationForm(formType: string): void {
    console.log('Form submitted');
    console.log(this.registrationForm.value);

    if (this.registrationForm.valid) {
      let route = '/user-interaction';
      if (formType === 'information') {
        route = '/information-user';
      }

      this.http.post('http://localhost:3000/register', this.registrationForm.value).subscribe((response: any) => {
        console.log(response);
        if (response.status) {
          localStorage.setItem('user', JSON.stringify(response))
        } else { }
        this.router.navigate([route]); // редірект на відповідну сторінку
      }, (error: any) => {
        console.error(error);
      });
    }
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
    });

    this.registrationForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      regPassword: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      regEmail: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
    });

    this.loginForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.registrationForm.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    const form = this.loginForm;

    // Clear existing form errors
    Object.keys(this.formErrors).forEach(field => {
      this.formErrors[field] = '';
    });

    // Check login form errors
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });

    // Check registration form errors
    Object.keys(this.registrationForm.controls).forEach(field => {
      const control = this.registrationForm.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.registrationValidationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }

}




