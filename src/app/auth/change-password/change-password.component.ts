import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { MatDialog } from '@angular/material/dialog';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthGoogleService } from 'src/app/auth/auth-google.service';
import { checkPasswordStrength, checkPasswordMatch, formErrors, validationMessages, onValueChanged } from '../validation';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../auth.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
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

export class ChangePasswordComponent implements OnInit {
  // експортую значення помилок
  formErrors: any = formErrors;
  validationMessages: any = validationMessages;

  changeStep: number = 0;

  path_logo = path_logo;
  passwordType = 'password';
  passwordType1 = 'password';
  emailCheckCode: string = '';
  changePassCode: any;
  agreementAccepted: boolean = false;
  passStrengthMessage: string = '';

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  changePassForm!: FormGroup;

  isMobile = false;
  passMatch: any;
  passMatchMessage: any;
  confirmPassword: any;
  passwordlenght: any;
  passCheckLenght: any;
  loginEmail: any;
  loading = false;
  // лічильник помикових внесень коду
  counterPass: number = 5;
  counterWrongEnteredPass: number = 5;
  timeLeft: number = 0;

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
    this.counterWrongEnteredPass = 5;
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.initializeForm();
    this.loading = false;
    this.calcWrongPass();
  }

  async invalidСodeCheck(): Promise<void> {
    const counterEnteredPass = localStorage.getItem('counterWrongEnteredPass');
    this.counterWrongEnteredPass = Number(counterEnteredPass);
    if (this.counterWrongEnteredPass !== 0) {
      this.sharedService.setStatusMessage('Помилковий код!');
      this.counterPass--;
      localStorage.setItem('counterWrongEnteredPass', JSON.stringify(this.counterPass));
      setTimeout(() => {
        this.sharedService.setStatusMessage(`Лишилось спроб - ${this.counterPass}`);
        setTimeout(() => {
          this.sharedService.setStatusMessage(``);
          this.loading = false;
        }, 2000);
      }, 1000);
    } else if (this.counterWrongEnteredPass === 0) {
      this.sharedService.setStatusMessage('Спроби введення коду вичерпані!');
      setTimeout(() => {
        this.sharedService.setStatusMessage('Форми заблоковані на 5хв!');
        setTimeout(async () => {
          this.sharedService.setStatusMessage('');
          this.loading = false;
          this.router.navigate(['/auth/registration']);
          await this.calcWrongPass();
          setTimeout(() => {
            location.reload();
          }, 100);
        }, 2000);
      }, 2000);
    }
  }

  async calcWrongPass(): Promise<void> {
    const counterEnteredPass = localStorage.getItem('counterWrongEnteredPass');
    if (counterEnteredPass) {
      this.counterWrongEnteredPass = Number(counterEnteredPass);
    }
    // console.log(this.counterWrongEnteredPass)
    const savedEndTime = localStorage.getItem('blockEndTime');
    if (this.counterWrongEnteredPass === 0 && !savedEndTime) {
      const timeout = 5 * 60 * 1000; // 5 хвилин в мілісекундах
      const endTime = Date.now() + timeout;
      this.blockAllForms(); // Блокуємо форми
      const timerInterval = setInterval(() => {
        const currentTime = Date.now();
        this.timeLeft = Math.round((endTime - currentTime) / 1000);
        // Збереження часу до розблокування в localStorage
        localStorage.setItem('blockEndTime', endTime.toString());
        if (this.timeLeft <= 0) {
          clearInterval(timerInterval); // Зупиняємо таймер
          this.unblockAllForms(); // Розблоковуємо форми
          localStorage.removeItem('blockEndTime'); // Видаляємо час зберігання з localStorage
        }
      }, 1000); // Оновлюємо кожну секунду
    } else if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const currentTime = Date.now();
      this.timeLeft = Math.round((endTime - currentTime) / 1000);
      if (this.timeLeft > 0) {
        this.blockAllForms(); // Блокуємо форми
        this.startTimer(); // Запускаємо таймер
      } else {
        localStorage.removeItem('blockEndTime'); // Видаляємо старий час зберігання з localStorage
      }
    }
  }

  private startTimer(): void {
    const timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(timerInterval); // Зупиняємо таймер
        this.unblockAllForms(); // Розблоковуємо форми
        localStorage.removeItem('blockEndTime'); // Видаляємо час зберігання з localStorage
      }
    }, 1000); // Оновлюємо кожну секунду
  }

  private blockAllForms(): void {
    this.sharedService.clearCache();
    this.registrationForm.disable();
    this.loginForm.disable();
    this.changePassForm.disable();
  }

  private unblockAllForms(): void {
    this.registrationForm.enable();
    this.loginForm.enable();
    this.changePassForm.enable();
    localStorage.setItem('counterWrongEnteredPass', JSON.stringify(5));
  }

  async sendCodeForChangePass(): Promise<void> {
    this.loading = true;
    const data = { email: this.changePassForm.get('email')?.value };
    this.http.post(serverPath + '/registration/forgotpass1', data)
      .subscribe((response: any) => {
        if (response.status === 'На вашу пошту було надіслано код безпеки') {
          this.changeStep = 1;
          this.changePassForm.get('email')?.disable();
          this.sharedService.setStatusMessage('На вашу пошту було надіслано код безпеки.');
          this.sharedService.clearCache();
          setTimeout(() => {
            this.sharedService.setStatusMessage('');
            this.loading = false;
          }, 2000);
        } else {
          this.sharedService.setStatusMessage('Помилка надсилання коду безпеки.');
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      }, (error: any) => {
        console.error(error);
        this.sharedService.setStatusMessage('Сталася помилка на сервері');
        setTimeout(() => {
          location.reload();
        }, 2000);
      });
  }

  onChangePassword() {
    this.loading = true;
    const data = {
      email: this.changePassForm.get('email')?.value,
      password: this.changePassForm.get('changePassword')?.value,
      passCode: this.changePassCode,
    };
    this.http.post(serverPath + '/registration/forgotpass2', data).subscribe(
      (response: any) => {
        if (response.status === 'Не правильно передані данні') {
          console.error(response.status);
          this.sharedService.setStatusMessage('Помилка реєстрації');
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else if (response.status === "Не правильний код") {
          this.invalidСodeCheck();
        } else {
          localStorage.setItem('user', JSON.stringify(response));
          this.sharedService.setStatusMessage('Пароль змінено, Вітаємо в Discussio!');
          setTimeout(() => {
            this.router.navigate(['/user/info']);
            this.sharedService.setStatusMessage('');
          }, 2000);
        }
      },
      (error: any) => {
        console.error(error);
        this.sharedService.setStatusMessage('Помилка, повторіть будь ласка пізніше');
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    );
  }

  private initializeForm(): void {
    this.changePassForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      changePassword: [{ value: '', disabled: false },
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(25),
        Validators.pattern(/.*\d.*/),  // Перевірка на наявність цифри
        Validators.pattern(/[A-Za-z\p{L}]+/u)
      ]],
      confirmPassword: [{ value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(25),
        Validators.pattern(/.*\d.*/),  // Перевірка на наявність цифри
        Validators.pattern(/[A-Za-z\p{L}]+/u)
      ]]
    });

    // Підписка на пошту та перевірка на валідність
    this.changePassForm.get('email')?.valueChanges.subscribe(value => {
      this.formErrors.email = '';
      onValueChanged(this.changePassForm);
    });

    // Підписка на зміни поле changePassword
    this.changePassForm.get('changePassword')?.valueChanges.subscribe(value => {
      // Якщо length >= 5 викликаємо перевірку сили паролю
      const password = this.changePassForm.get('changePassword')?.value;
      if (password.length >= 5) {
        this.passStrengthMessage = checkPasswordStrength(password);
        // Якщо поле changePassword перевірено та валідне, активуємо поле confirmPassword
        if (this.changePassForm.get('changePassword')?.valid) {
          this.changePassForm.get('confirmPassword')?.enable();
        } else {
          // Якщо поле changePassword не валідне, відключаємо поле confirmPassword та скидаємо його значення
          this.changePassForm.get('confirmPassword')?.disable();
          this.changePassForm.get('confirmPassword')?.setValue('');
        }
      }
    });
    // Підписка на зміни поле confirmPassword та перевірка на збіг
    this.changePassForm.get('confirmPassword')?.valueChanges.subscribe(value => {
      const password = this.changePassForm.get('changePassword')?.value;
      const confirmPassword = this.changePassForm.get('confirmPassword')?.value;
      this.passMatchMessage = checkPasswordMatch(password, confirmPassword);
    });
  }


}

