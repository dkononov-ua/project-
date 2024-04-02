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
import { MatDialog } from '@angular/material/dialog';
import { NewsComponent } from 'src/app/components/news/news.component';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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
    animations.top1,
    animations.top2,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],

})

export class RegistrationComponent implements OnInit {

  minDate: Date;
  maxDate: Date;

  path_logo = path_logo;
  passwordType = 'password';
  passwordType1 = 'password';
  emailCheckCode: string = '';
  changePassCode: any;
  agreementAccepted: boolean = false;
  errorMessage$: Subject<string> = new Subject<string>();
  passStrengthMessage: string = '';
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  changePassForm!: FormGroup;
  statusMessage: string | undefined;
  isCopied = false;
  discussio!: string;
  disabledEmail: boolean = false;
  passMatch: any;
  passMatchMessage: any;
  changePassword1: any;
  passlenght: any;
  passCheckLenght: any;
  loginEmail: any;
  validateAgeMessage: any;
  validateAgeDate: boolean = false;
  emailAcc: any;
  loading = false;

  nextBtn(indexBtn: number) {
    if (indexBtn)
      this.indexBtn = indexBtn;
    this.disabledEmail = true;
  }

  formErrors: any = {
    userName: '',
    password: '',
    email: '',
    regPassword: '',
    regEmail: '',
    dob: '',
    passwordEmail: '',
  };

  validationMessages: any = {
    regPassword: {
      required: "Пароль обов'язково",
      minlength: 'Мін. 7 символів.',
      maxlength: 'Не більше довжина 25 символів',
      pattern: 'Літеру та цифру',
    },

    userName: {
      required: "Ім'я обов'язково",
      minlength: 'Мінімальна довжина 3 символи',
      maxlength: 'Максимальна довжина 15 символів'
    },

    password: {
      required: "Пароль обов'язково",
      minlength: 'Мін. 7 символів.',
      maxlength: 'Не більше довжина 25 символів',
      pattern: 'Літеру та цифру',
    },

    email: {
      required: "Пошта обов'язкова",
      pattern: 'Невірно вказана пошта',
      minlength: 'Мінімальна довжина 7 символів',
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

  indexCard: number = 3;
  indexBtn: number = 1;
  isMobile = false;

  togglePasswordVisibility1() {
    this.passwordType1 = this.passwordType1 === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
  ) {
    // Отримання поточної дати
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    // Вирахування дати 18 років тому
    const minYear = currentYear - 80;
    const maxYear = currentYear - 18;
    const maxMonth = currentMonth;
    const maxDay = currentDay;

    // Створення об'єктів дати
    this.minDate = new Date(minYear, 0, 1);
    this.maxDate = new Date(maxYear, maxMonth, maxDay);
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.initializeForm();
    this.loading = false;
  }

  login(): void {
    this.loading = true;
    this.http.post(serverPath + '/login', this.loginForm.value)
      .subscribe((response: any) => {
        if (response.status) {
          setTimeout(() => {
            this.statusMessage = 'З поверненням!';
            localStorage.setItem('user', JSON.stringify(response));
            setTimeout(() => {
              this.router.navigate(['/user']);
              this.sharedService.setStatusMessage('Оновлюємо дані профілю');
              setTimeout(() => {
                location.reload();
              }, 1500);
            }, 1500);
          }, 1000);
        } else {
          setTimeout(() => {
            this.statusMessage = 'Неправильний логін або пароль.';
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 1000);
        }
      }, (error: any) => {
        this.loading = false;
        this.statusMessage = 'Сталася помилка на сервері.';
        setTimeout(() => {
          location.reload();
        }, 2000);
      });
  }

  registrationCheck(): void {
    if (this.registrationForm.valid && this.agreementAccepted) {
      if (this.registrationForm.get('dob')?.value) {
        const dob = moment(this.registrationForm.get('dob')?.value._i).format('YYYY-MM-DD');
        const data = {
          regEmail: this.registrationForm.get('regEmail')?.value,
          regPassword: this.registrationForm.get('regPassword')?.value,
          dob: dob,
        };
        // console.log(data)
        this.loading = true;
        this.http.post(serverPath + '/registration/first', data).subscribe(
          (response: any) => {
            // console.log(response);
            if (response.status === 'Не правильно передані данні') {
              console.error(response.status);
              this.statusMessage = 'Помилка реєстрації.';
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
            else if (response.status === 'Ви вже зареєстровані') {
              this.statusMessage = 'Користувач з таким email вже зареєстрований';
              setTimeout(() => {
                location.reload();
              }, 2000);
            } else {
              this.statusMessage = 'На вашу пошту було надіслано код безпеки.';
              setTimeout(() => {
                this.statusMessage = '';
                this.loading = false;
                this.indexBtn = 2;
              }, 2000);
            }
            this.loading = false;
          },
          (error: any) => {
            console.error(error);
            this.loading = false;
            this.statusMessage = 'Помилка реєстрації.';
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        );
      }
    }
  }

  registration(): void {
    if (this.registrationForm.valid && this.agreementAccepted) {
      if (this.registrationForm.get('dob')?.value) {
        const dob = moment(this.registrationForm.get('dob')?.value._i).format('YYYY-MM-DD');
        const data = {
          regEmail: this.registrationForm.get('regEmail')?.value,
          regPassword: this.registrationForm.get('regPassword')?.value,
          dob: dob,
          passCode: this.emailCheckCode,
        };
        this.http.post(serverPath + '/registration/second', data).subscribe(
          (response: any) => {
            // console.log(response);
            if (response.status === 'Не правильно передані данні') {
              console.error(response.status);
              this.statusMessage = 'Помилка реєстрації.';
              setTimeout(() => {
                location.reload();
              }, 1000);
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
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        );
      }
    }
  }

  sendCodeForChangePass() {
    this.emailAcc = this.loginForm.get('email')?.value;
    this.loading = true;

    const data = {
      email: this.loginForm.get('email')?.value,
    };

    // console.log(data);
    this.http.post(serverPath + '/registration/forgotpass1', data)
      .subscribe((response: any) => {
        // console.log(response)
        if (response.status === 'На вашу пошту було надіслано код безпеки') {
          this.indexCard = 2;
          this.statusMessage = 'На вашу пошту було надіслано код безпеки.';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        } else {
          this.statusMessage = 'Помилка надсилання коду безпеки.';
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      }, (error: any) => {
        console.error(error);
        this.errorMessage$.next('Сталася помилка на сервері');
        this.statusMessage = 'Сталася помилка на сервері.';
        setTimeout(() => {
          location.reload();
        }, 2000);
      });
  }

  onChangePassword() {
    this.loading = true;

    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.changePassForm.get('changePassword')?.value,
      passCode: this.changePassCode,
    };
    // console.log(data);
    this.http.post(serverPath + '/registration/forgotpass2', data).subscribe(
      (response: any) => {
        // console.log(response);
        if (response.status === 'Не правильно передані данні') {
          console.error(response.status);
          this.statusMessage = 'Помилка реєстрації.';
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          localStorage.setItem('user', JSON.stringify(response));
          this.statusMessage = 'Пароль змінено, Вітаємо в Discussio!';
          setTimeout(() => {
            this.router.navigate(['/user/info']);
          }, 2000);
        }
      },
      (error: any) => {
        console.error(error);
        this.statusMessage = 'Помилка, повторіть будь ласка пізніше.';
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    );
  }

  validateAge() {
    const birthDate = new Date(this.registrationForm.get('dob')?.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16) {
      const remainingYears = 16 - age;
      this.validateAgeDate = false;
      this.validateAgeMessage = `Для реєстрації вам потрібно почекати ще ${remainingYears} років`;
    } else {
      this.validateAgeMessage = '';
      this.validateAgeDate = true;
    }
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      regPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(25),
          Validators.pattern(/.*\d.*/),  // Перевірка на наявність цифри
          Validators.pattern(/[A-Za-z\p{L}]+/u)
        ],
      ],
      regEmail: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      dob: [null, [Validators.required]],
    });

    this.loginForm = this.fb.group({
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(25),
          Validators.pattern(/.*\d.*/),  // Перевірка на наявність цифри
          Validators.pattern(/[A-Za-z\p{L}]+/u)
        ],
      ],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/), Validators.minLength(7),
      ]],
    });

    this.changePassForm = this.fb.group({
      changePasswordEmail: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      changePassword: [{ value: '', disabled: false },
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(25),
        Validators.pattern(/.*\d.*/),  // Перевірка на наявність цифри
        Validators.pattern(/[A-Za-z\p{L}]+/u)
      ]],
      changePassword1: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(25),
        Validators.pattern(/.*\d.*/),  // Перевірка на наявність цифри
        Validators.pattern(/[A-Za-z\p{L}]+/u)
      ]]
    });

    this.changePassForm.get('changePassword')?.valueChanges.subscribe(value => {
      // Якщо поле changePassword валідне, активуємо поле changePassword1
      if (this.changePassForm.get('changePassword')?.valid) {
        this.changePassForm.get('changePassword1')?.enable();
      } else {
        // Якщо поле changePassword не валідне, відключаємо поле changePassword1 та скидаємо його значення
        this.changePassForm.get('changePassword1')?.disable();
        this.changePassForm.get('changePassword1')?.setValue('');
      }
    });

    this.loginForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.registrationForm.valueChanges?.subscribe(() => this.onValueChanged());
    this.changePassForm.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.checkPassword();
    this.validateAge();

    const loginForm = this.loginForm;
    const registrationForm = this.registrationForm;

    Object.keys(this.formErrors).forEach(field => {
      this.formErrors[field] = '';
    });

    Object.keys(loginForm.controls).forEach(field => {
      const control = loginForm.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });

    Object.keys(registrationForm.controls).forEach(field => {
      const control = registrationForm.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors as ValidationErrors).forEach(key => {
          this.formErrors[field] += messages[key] + ' ';
        }
        );
      }
    });
  }

  checkPassword() {
    if (this.loginEmail) {
      this.loginEmail = this.registrationForm.get('email')?.value.length || '';
    }
    // виклик перевірки на надійність
    this.passlenght = this.changePassForm.get('changePassword')?.value.length || 0;
    if (this.passlenght >= 5) {
      this.checkPasswordStrength();
      // виклик перевірки на співпадіння
      this.passCheckLenght = this.changePassForm.get('changePassword1')?.value.length || 0;
      if (this.passCheckLenght === this.passlenght) {
        this.passMatchMessage = this.changePassForm?.get('changePassword')?.value === this.changePassForm?.get('changePassword1')?.value ? 'ok' : 'Паролі не збігаються';
      } else if (this.passCheckLenght >= 7 && this.passCheckLenght !== this.passlenght) {
        this.passMatchMessage = 'Паролі не збігаються';
      } else {
        this.passMatchMessage = '';
      }
    } else {
      this.passStrengthMessage = '';
    }
  }

  checkPasswordStrength() {
    const password = this.changePassForm?.get('changePassword')?.value;
    const hasDigit = /\d/.test(password);
    // const hasLatinLetter = /[A-Za-z]/.test(password);
    const hasNoConsecutiveCharacters = !/(.)\1{2,}/.test(password);
    const hasMinimumLength = password.length >= 7;
    if (hasDigit && hasNoConsecutiveCharacters && hasMinimumLength) {
      this.passStrengthMessage = 'ok';
    } else {
      this.passStrengthMessage = '';
      if (!hasDigit) {
        this.passStrengthMessage += 'Мінімум 1 цифру. ';
      }
      // if (!hasLatinLetter) {
      //   this.passStrengthMessage += 'Мінімум 1 латинська літера. ';
      // }
      if (!hasNoConsecutiveCharacters) {
        this.passStrengthMessage += 'Більше двох символів підряд. ';
      }
      if (!hasMinimumLength) {
        this.passStrengthMessage += 'Мінімум 7 символів. ';
      }
    }
  }

  checkRegPasswordStrength() {
    const password = this.changePassForm?.get('changePassword')?.value;
    const hasDigit = /\d/.test(password);
    // const hasLatinLetter = /[A-Za-z]/.test(password);
    const hasNoConsecutiveCharacters = !/(.)\1{2,}/.test(password);
    const hasMinimumLength = password.length >= 7;
    if (hasDigit && hasNoConsecutiveCharacters && hasMinimumLength) {
      this.passStrengthMessage = 'ok';
    } else {
      this.passStrengthMessage = '';
      if (!hasDigit) {
        this.passStrengthMessage += 'Мінімум 1 цифру. ';
      }
      // if (!hasLatinLetter) {
      //   this.passStrengthMessage += 'Мінімум 1 латинська літера. ';
      // }
      if (!hasNoConsecutiveCharacters) {
        this.passStrengthMessage += 'Не більше двох символів підряд. ';
      }
      if (!hasMinimumLength) {
        this.passStrengthMessage += 'Мінімум 7 символів. ';
      }
    }
  }

}
