import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/account-edit/user/information-user.component';
import moment from 'moment';
import { serverPath, path_logo } from 'src/app/config/server-config';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  animations: [
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 200ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1.0 }))
      ]),
      transition('* => void', [
        style({ transform: 'translateX(0)' }),
        animate('1400ms 200ms ease-in-out', style({ transform: 'translateX(230%)', opacity: 0.0 }))
      ])
    ]),
  ],
})
export class RegistrationComponent implements OnInit {
  path_logo = path_logo;

  isFeatureEnabled: boolean = true;
  passwordType = 'password';

  emailCheckCode: any;

  agreementAccepted: boolean = false;
  errorMessage$: Subject<string> = new Subject<string>();
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  statusMessage: string | undefined;
  isCopied = false;
  formErrors: any = {
    userName: '',
    password: '',
    email: '',
    regPassword: '',
    regEmail: 'Введіть email',
    dob: '',
    passwordEmail: '',
  };

  discussio!: string;
  disabledEmail: boolean = false;

  indexBtn: number = 0;
  nextBtn(indexBtn: number) {
    if (indexBtn)
      this.indexBtn = indexBtn;
    this.disabledEmail = true;
  }

  validationMessages: any = {
    userName: {
      required: "Ім'я обов'язково",
      minlength: 'Мінімальна довжина 3 символи',
      maxlength: 'Максимальна довжина 15 символів'
    },
    password: {
      required: "Пароль обов'язково",
      minlength: 'Мінімальна довжина 7 символів',
      maxlength: 'Максимальна довжина 25 символів'
    },
    regPassword: {
      required: "Пароль обов'язково",
      minlength: 'Мінімальна довжина 7 символів',
      maxlength: 'Максимальна довжина 25 символів'
    },
    email: {
      required: "Пошта обов'язкова",
      pattern: 'Невірно вказана пошта',
    },

    regEmail: {
      required: "Пошта обов'язкова",
      pattern: 'Невірно вказана пошта',
      minlength: 'Мінімальна довжина 7 символів',
      maxlength: 'Максимальна довжина 30 символів'
    },
    dob: {
      required: "Дата народження обов'язково",
      pattern: 'Невірно вказана дата народження',
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
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    this.initializeForm();
  }

  onSubmit(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('houseData');
    this.http.post(serverPath + '/login', this.loginForm.value)
      .subscribe((response: any) => {
        if (response.status) {
          setTimeout(() => {
            this.statusMessage = 'З поверненням!';
            localStorage.setItem('user', JSON.stringify(response));
            setTimeout(() => {
              this.router.navigate(['/user']);
            }, 1500);
          }, 1000);
        } else {
          setTimeout(() => {
            this.errorMessage$.next('Неправильний логін або пароль');
            this.statusMessage = 'Неправильний логін або пароль.';
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 1000);
        }
      }, (error: any) => {
        console.error(error);
        this.errorMessage$.next('Сталася помилка на сервері');
      });
  }

  registration(): void {
    console.log(11111111111)
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('houseData');
    if (this.registrationForm.valid && this.agreementAccepted) {
      if (this.registrationForm.get('dob')?.value) {
        const dob = moment(this.registrationForm.get('dob')?.value._i).format('YYYY-MM-DD');
        // const data = {
        //   userName: this.registrationForm.get('userName')?.value,
        //   regEmail: this.registrationForm.get('regEmail')?.value,
        //   regPassword: this.registrationForm.get('regPassword')?.value,
        //   dob: dob,
        // };

        const data = {
          userName: 'userName',
          regEmail: this.registrationForm.get('regEmail')?.value,
          regPassword: '1234567',
          dob: '1946-03-08',
        };

        console.log(data);

        this.http.post(serverPath + '/registration', data).subscribe(
          (response: any) => {
            console.log(response);
            if (response.status === 'Не правильно передані данні') {
              console.error(response.status);
              this.statusMessage = 'Помилка реєстрації.';
              // setTimeout(() => {
              //   location.reload();
              // }, 1000);
            } else if (response.status === 'Не правильний ключ-пошта') {
              console.error(response.status);
              this.statusMessage = 'Помилка реєстрації.';
              // setTimeout(() => {
              //   location.reload();
              // }, 1000);
            } else {
              this.statusMessage = 'Вітаємо в Discussio!';
              localStorage.setItem('user', JSON.stringify(response));
              setTimeout(() => {
                this.router.navigate(['/about-project']);
              }, 2000);
            }
          },
          (error: any) => {
            console.error(error);
            this.statusMessage = 'Помилка реєстрації.';
            // setTimeout(() => {
            //   location.reload();
            // }, 2000);
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
      // userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      regPassword: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      regEmail: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      dob: [null, [Validators.required]],
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

  copyDiscussio() {
    this.discussio = '@discussio.beta';
    if (this.discussio) {
      navigator.clipboard.writeText(this.discussio)
        .then(() => {
          this.isCopied = true;
          setTimeout(() => {
            this.isCopied = false;
          }, 2000);
        })
        .catch((error) => {
          this.isCopied = false;
        });
    }
  }

  checkEmail(): void {
    this.indexBtn = 1;

    if (this.registrationForm.get('regEmail')?.value)
      try {
        const data = {
          email: this.registrationForm.get('regEmail')?.value,
        };

        this.http.post(serverPath + '/registration', data).subscribe(
          (response: any) => {
            if (response) {
              // this.indexBtn = 1;
              console.error(response.status);
            } else {
              console.error('error');
            }
          },
        );
      } catch (error) {
        console.error(error);
      }
  }

  checkEmailCode(): void {
    this.indexBtn = 2;

    if (this.emailCheckCode)
      try {
        const data = {
          code: this.emailCheckCode,
        };

        this.http.post(serverPath + '/registration', data).subscribe(
          (response: any) => {
            if (response) {
              // this.indexBtn = 2;
              console.error(response.status);
            } else {
              console.error('error');
            }
          },
        );
      } catch (error) {
        console.error(error);
      }
  }
}






