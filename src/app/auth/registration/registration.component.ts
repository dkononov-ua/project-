import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import * as ServerConfig from 'src/app/config/path-config';
import { MatDialog } from '@angular/material/dialog';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { AuthGoogleService } from 'src/app/auth/auth-google.service';
import { checkPasswordStrength, onValueChanged, formErrors, validationMessages } from '../validation';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/MM/YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../auth.component.scss'],
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
    animations.appearance,
  ],
})

export class RegistrationComponent implements OnInit, OnDestroy {

  // імпорт шляхів до медіа
  pathPhotoUser = ServerConfig.pathPhotoUser;
  pathPhotoFlat = ServerConfig.pathPhotoFlat;
  pathPhotoComunal = ServerConfig.pathPhotoComunal;
  path_logo = ServerConfig.pathLogo;
  serverPath: string = '';
  // ***

  // експортую значення помилок
  formErrors: any = formErrors;
  validationMessages: any = validationMessages;

  minDate: Date;
  maxDate: Date;

  passwordType = 'password';
  passwordType1 = 'password';
  emailCheckCode: string = '';
  changePassCode: any;
  agreementAccepted: boolean = false;
  passStrengthMessage: string = '';

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  changePassForm!: FormGroup;

  indexCard: number = 0;
  indexBtn: number = 1;
  isMobile = false;
  disabledEmail: boolean = false;
  passMatch: any;
  passMatchMessage: any;
  changePassword1: any;
  passlenght: any;
  passCheckLenght: any;
  loginEmail: any;
  validateAgeMessage: any;
  validateAgeDate: boolean = false;
  loading = false;
  // відображення на сторінці на яку пошту відправлено код
  emailAcc: any;
  // лічильник помикових внесень коду
  counterPass: number = 5;
  counterWrongEnteredPass: number = 5;
  timeLeft: number = 0;
  checkDob: boolean = false;

  nextBtn(indexBtn: number) {
    if (indexBtn)
      this.indexBtn = indexBtn;
    this.disabledEmail = true;
  }

  togglePasswordVisibility1() {
    this.passwordType1 = this.passwordType1 === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  subscriptions: any[] = [];
  authorization: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private authGoogleService: AuthGoogleService,
    private updateMetaTagsService: UpdateMetaTagsService,
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
    this.counterWrongEnteredPass = 5;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    this.updateMetaTagsInService();
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.initializeForm();
    this.calcWrongPass();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Реєстрація на сайті Discussio™. Платформа для управління нерухомістю. Пошук оселі та орендарів!',
      description: 'Зареєструватись на нащому сайті',
      keywords: 'Discussio, реєстрація, зареєструватись, створити профіль, registration',
      image: '',
    }
    this.updateMetaTagsService.updateMetaTags(data)
  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }

  // Перевірка на пристрій
  async getCheckDevice() {
    this.subscriptions.push(
      this.sharedService.isMobile$.subscribe((status: boolean) => {
        this.isMobile = status;
      })
    );
  }

  // підписка на шлях до серверу
  async getServerPath() {
    this.subscriptions.push(
      this.sharedService.serverPath$.subscribe(async (serverPath: string) => {
        this.serverPath = serverPath;
      })
    );
  }

  openGoogleAuth() {
    // if (!this.agreementAccepted) {
    //   this.sharedService.setStatusMessage('Треба ознайомитись з угодою користувача');
    //   setTimeout(() => {
    //     this.sharedService.setStatusMessage('');
    //   }, 1000);
    // } else {
    //   this.authGoogleService.singAuthGoogle('registration');
    // }
    this.authGoogleService.singAuthGoogle('registration');
  }

  registrationCheck(): void {
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('dob')?.value) {
        const dob = moment(this.registrationForm.get('dob')?.value._i).format('YYYY-MM-DD');
        const data = {
          regEmail: this.registrationForm.get('email')?.value,
          regPassword: this.registrationForm.get('regPassword')?.value,
          dob: dob,
        };
        // console.log(data)
        this.loading = true;
        this.http.post(this.serverPath + '/registration/first', data).subscribe(
          (response: any) => {
            // console.log(response)
            if (response.status === 'Не правильно передані данні') {
              this.sharedService.setStatusMessage('Помилка реєстрації.');
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
            else if (response.status === 'Ви вже зареєстровані') {
              this.sharedService.setStatusMessage('Користувач з таким email вже зареєстрований');
              setTimeout(() => {
                location.reload();
              }, 2000);
            } else {
              this.sharedService.setStatusMessage('На вашу пошту було надіслано код безпеки.');
              setTimeout(() => {
                this.sharedService.setStatusMessage('');
                this.loading = false;
                this.indexBtn = 2;
              }, 2000);
            }
            this.loading = false;
          },
          (error: any) => {
            console.error(error);
            this.loading = false;
            this.sharedService.setStatusMessage('Помилка реєстрації.');
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        );
      }
    }
  }

  async registration(): Promise<void> {
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('dob')?.value) {
        const dob = moment(this.registrationForm.get('dob')?.value._i).format('YYYY-MM-DD');
        const data = {
          regEmail: this.registrationForm.get('email')?.value,
          regPassword: this.registrationForm.get('regPassword')?.value,
          dob: dob,
          passCode: this.emailCheckCode,
        };
        try {
          const response: any = await this.http.post(this.serverPath + '/registration/second', data).toPromise();
          if (response.status === 'Не правильно передані данні') {
            this.sharedService.setStatusMessage('Помилка реєстрації');
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else if (response.status === "Не правильний код") {
            this.invalidСodeCheck();
          } else {
            this.sharedService.clearCache();
            this.sharedService.setStatusMessage('Вітаємо в Discussio!');
            setTimeout(() => {
              this.sharedService.setStatusMessage('Переходимо до налаштування профілю!');
              localStorage.setItem('user', JSON.stringify(response));
              setTimeout(() => {
                this.router.navigate(['/user/edit']);
              }, 2000);
            }, 1000);
          }
        } catch (error) {
          console.error(error);
          this.sharedService.setStatusMessage('Помилка реєстрації.');
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      } else {
        this.checkDob = false;
      }
    }
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
          this.indexBtn = 1;
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
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
      dob: [null, [Validators.required]],
    });
    // Підписка на пошту та перевірка на валідність
    this.registrationForm.get('dob')?.valueChanges.subscribe(value => {
      this.formErrors.dob = '';
      onValueChanged(this.registrationForm);
    });
    // Підписка на пошту та перевірка на валідність
    this.registrationForm.get('email')?.valueChanges.subscribe(value => {
      this.formErrors.email = '';
      onValueChanged(this.registrationForm);
    });
    // Підписка на зміни поле regPassword
    this.registrationForm.get('regPassword')?.valueChanges.subscribe(value => {
      // Якщо length >= 5 викликаємо перевірку сили паролю
      const password = this.registrationForm.get('regPassword')?.value;
      if (password.length >= 5) {
        this.passStrengthMessage = checkPasswordStrength(password);
        // Якщо поле regPassword перевірено та валідне, активуємо поле confirmPassword
        if (this.registrationForm.get('regPassword')?.valid) {
        } else {
          // Якщо поле regPassword не валідне, відключаємо поле confirmPassword та скидаємо його значення
        }
      }
    });
  }

}
