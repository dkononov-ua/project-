import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(230%)' }))
      ])
    ]),
  ],
})
export class RegistrationComponent implements OnInit {

  isFeatureEnabled: boolean = true;
  passwordType = 'password';
  agreementAccepted: boolean = false;
  errorMessage$: Subject<string> = new Subject<string>();
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  statusMessage: string | undefined;

  formErrors: any = {
    userName: '',
    password: '',
    email: '',
  };

  validationMessages: any = {
    userName: {
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
  };

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  toggleMode(): void {
    this.isFeatureEnabled = !this.isFeatureEnabled;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    this.http.post('http://localhost:3000/login', this.loginForm.value)
      .subscribe((response: any) => {
        if (response.status) {
          setTimeout(() => {
            this.statusMessage = 'З поверненням!';
            localStorage.setItem('user', JSON.stringify(response));
            setTimeout(() => {
              this.router.navigate(['/user']);
            }, 1000);
          }, 500);
        } else {
          setTimeout(() => {
            this.errorMessage$.next('Неправильний логін або пароль');
            this.statusMessage = 'Неправильний логін або пароль.';
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 500);
        }
      }, (error: any) => {
        console.error(error);
        this.errorMessage$.next('Сталася помилка на сервері');
      });
  }

  registration(): void {
    if (this.registrationForm.valid && this.agreementAccepted) {
      if (this.registrationForm) {
        const data = {
          userName: this.registrationForm.get('userName')?.value,
          regEmail: this.registrationForm.get('email')?.value,
          regPassword: this.registrationForm.get('password')?.value,
        }
        console.log(data);
        this.http.post('http://localhost:3000/registration', data)
        .subscribe(
          (response: any) => {
            console.log(response)
            if (response.status === 'Не правильно передані данні') {
              console.error(response.status);
              setTimeout(() => {
                this.statusMessage = 'Помилка реєстрації.';
                setTimeout(() => {
                  location.reload();
                }, 1000);
              }, 200);
            } else {
              setTimeout(() => {
                this.statusMessage = 'Вітаємо в Discussio!';
                localStorage.setItem('user', JSON.stringify(response))
                setTimeout(() => {
                  this.router.navigate(['/information-user']);
                }, 2000);
              }, 200);
            }
          },
          (error: any) => {
            console.error(error);
            setTimeout(() => {
              this.statusMessage = 'Помилка реєстрації.';
              setTimeout(() => {
                location.reload();
              }, 2000);
            }, 100);
          }
        );
      }
    }
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
    });

    this.registrationForm = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
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
        const messages = this.validationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }
}






