import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { InformationUserComponent } from '../../account-edit/user/information-user.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';
import { UserComponent } from '../../account/user/user.component';

const appRoutes: Routes = [
  { path: 'user', component: UserComponent },
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

  passwordType = 'password';
  agreementAccepted: boolean = false;

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  errorMessage$: Subject<string> = new Subject<string>();

  formErrors: any = {
    userName: '',
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
    userName: {
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
    let route = '/account';

    this.http.post('http://localhost:3000/login', this.loginForm.value)
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
    if (this.registrationForm.valid && this.agreementAccepted) {

      let route = '/user-interaction';
      if (formType === 'information') {
        route = '/information-user';
      }

      this.http.post('http://localhost:3000/registration', this.registrationForm.value).subscribe((response: any) => {
        if (response.status) {
          localStorage.setItem('user', JSON.stringify(response))
        } else { }
        this.router.navigate([route]);
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
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      regPassword: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      regEmail: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
    });

    this.loginForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.registrationForm.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    const form = this.loginForm;

    Object.keys(this.formErrors).forEach(field => {
      this.formErrors[field] = '';
    });

    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });

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






