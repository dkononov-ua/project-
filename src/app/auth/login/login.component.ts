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
import { formErrors, validationMessages, onValueChanged } from '../validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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

export class LoginComponent implements OnInit {

  // експортую значення помилок
  formErrors: any = formErrors;
  validationMessages: any = validationMessages;
  path_logo = path_logo;
  passwordType = 'password';
  emailCheckCode: string = '';
  changePassCode: any;
  agreementAccepted: boolean = false;
  passStrengthMessage: string = '';

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  changePassForm!: FormGroup;

  isMobile = false;
  loginEmail: any;
  loading = false;


  // відображення на сторінці на яку пошту відправлено код
  emailAcc: any;
  // лічильник помикових внесень коду
  counterPass: number = 5;
  counterWrongEnteredPass: number = 5;
  timeLeft: number = 0;

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
    private authGoogleService: AuthGoogleService,
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
    this.initializeForm();
    this.loading = false;
  }

  openGoogleAuth() {
    this.authGoogleService.singAuthGoogle('login');
  }

  async login(): Promise<void> {
    this.loading = true;
    this.http.post(serverPath + '/login', this.loginForm.value)
      .subscribe((response: any) => {
        if (response.status) {
          this.sharedService.clearCache();
          setTimeout(() => {
            this.sharedService.setStatusMessage('З поверненням!');
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
            this.sharedService.setStatusMessage('Неправильний логін або пароль.');
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 1000);
        }
      }, (error: any) => {
        this.loading = false;
        this.sharedService.setStatusMessage('Сталася помилка на сервері.');
        setTimeout(() => {
          location.reload();
        }, 2000);
      });
  }

  private initializeForm(): void {
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
    this.loginForm.valueChanges.subscribe(() => {
      this.formErrors.email = '';
      this.formErrors.password = '';
      onValueChanged(this.loginForm);
    });
  }

}

