import { Component, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import * as ServerConfig from 'src/app/config/path-config';
import { MatDialog } from '@angular/material/dialog';
import { animations } from '../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';
import { AuthGoogleService } from 'src/app/auth/auth-google.service';
import { formErrors, validationMessages, onValueChanged } from '../validation';
import { DataService } from 'src/app/services/data.service';
import { StatusDataService } from 'src/app/services/status-data.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UpdateMetaTagsService } from 'src/app/services/updateMetaTags.service';

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
    animations.appearance,
    animations.swichCard,
  ],

})

export class LoginComponent implements OnInit, OnDestroy {

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
  subscriptions: any[] = [];
  authorization: boolean = false;

  logForm: boolean = false;

  toogleForm() {
    this.logForm = !this.logForm;
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
    private authGoogleService: AuthGoogleService,
    private dataService: DataService,
    private statusDataService: StatusDataService,
    private loaderService: LoaderService,
    private updateMetaTagsService: UpdateMetaTagsService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    this.updateMetaTagsInService();
    this.getCheckDevice();
    this.getServerPath();
    this.checkUserAuthorization();
    this.initializeForm();
  }

  private updateMetaTagsInService(): void {
    const data = {
      title: 'Вхід на сайт Discussio™. Платформа для управління нерухомістю. Пошук оселі та орендарів!',
      description: 'Увійдіть в свій профіль Discussio',
      keywords: 'Discussio, Вхід, вхід, Логін, логін, Login, зайти',
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
    this.authGoogleService.singAuthGoogle('login');
  }

  async login(): Promise<void> {
    this.loaderService.setLoading(true);
    this.sharedService.clearCache();
    try {
      const response: any = await this.http.post(this.serverPath + '/login', this.loginForm.value).toPromise();
      if (response.status === true) {
        this.sharedService.setStatusMessage('З поверненням!');
        localStorage.setItem('user', JSON.stringify(response));
        setTimeout(() => {
          this.sharedService.setStatusMessage('Оновлюємо дані');
          this.dataService.getInfoUser().subscribe((response: any) => {
            setTimeout(() => {
              if (response.status === true) {
                this.sharedService.setStatusMessage('Оновлено');
                this.statusDataService.setUserData(response.cont, 0);
                setTimeout(() => {
                  this.router.navigate(['/user']);
                  this.sharedService.setStatusMessage('');
                  this.loaderService.setLoading(false);
                }, 1500);
              } else {
                this.sharedService.setStatusMessage('Помилка оновлення даних');
                setTimeout(() => {
                  location.reload();
                }, 1500);
              }
            }, 1500);
          })
        }, 1500);
      } else {
        this.sharedService.setStatusMessage('Неправильний логін або пароль');
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    } catch (error) {
      this.loading = false;
      this.sharedService.setStatusMessage('Сталася помилка на сервері.');
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
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

