import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { FormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
const moment = _rollupMoment || _moment;

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

registerLocaleData(localeUk);
interface Subscribers {
  user_id: any;
  firstName: string;
  lastName: string;
  surName: string;
  photo: string | undefined;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;
  tell: number;
  mail: string;
}
@Component({
  selector: 'app-agree-create',
  templateUrl: './agree-create.component.html',
  styleUrls: ['./agree-create.component.scss'],
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
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})
export class AgreeCreateComponent implements OnInit {
  @ViewChild('agreeContainer') agreeContainer: ElementRef | undefined;
  message: string = '';
  subscribers: Subscribers[] = [];
  selectedFlatId: string | any;
  isOnline = true;
  isOffline = false;
  selectedSubscriber: any;
  houseData: any;
  userData: any;
  isLoading: boolean = true;
  months: number | undefined;
  days: number = 0;
  years: number | undefined;
  rentDueDate: number | undefined;
  penalty?: number = 0;
  conditions: string = '';
  maxPenalty?: number = 0;
  agreement_type: number = 0;
  subscriber_tell: any = '';
  subscriber_mail: string = '';
  owner_tell: any = '';
  owner_mail: string = '';
  phonePattern = '^[0-9]{10}$';
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;
  currentStep: number = 1;
  changeStep(step: number): void {
    this.currentStep = step;
  }
  isCityDisabled: boolean = true;
  isStreetDisabled: boolean = true;
  isHouseNumberDisabled: boolean = true;
  isApartmentNumberDisabled: boolean = true;
  isApartmentSizeDisabled: boolean = true;
  isRentPriceDisabled: boolean = true;
  loading: boolean = true;
  isContainerVisible = false;
  isCheckboxChecked = false;
  isCheckboxPenalty = false;
  additional_conditions = false;
  agreementDate: any = moment();
  formSubmitted: boolean = false;
  agreementCreated: boolean | undefined;
  statusMessage: string | undefined;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  openContainer() {
    this.isContainerVisible = true;
  }

  closeContainer() {
    this.isContainerVisible = false;
  }

  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        try {
          await this.getAgent();
          await this.getHouse();
          await this.getSubs();
          this.route.params.subscribe(params => {
            this.selectedSubscriber = params['selectedSubscriber?.user_id'] || null;
            this.foundSubscriber();
          });
          this.loading = false;
        } catch (error) {
          console.error(error);
          this.loading = false;
        }
      }
    });
  }

  async getHouse(): Promise<void> {
    try {
      const response: any = await this.dataService.getData().toPromise();
      this.houseData = response.houseData;
      if (this.houseData.imgs === 'Картинок нема') {
        this.houseData.imgs = ['http://localhost:3000/img/flat/housing_default.svg'];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getAgent(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/userinfo/agent';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.userData = response;
    } catch (error) {
      console.error(error);
    }
  }

  async getSubs(): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: this.selectedFlatId,
      offs: 0,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      this.subscribers = response;
    } catch (error) {
      console.error(error);
    }
  }

  foundSubscriber(): void {
    if (this.selectedSubscriber) {
      const foundSubscriber = this.subscribers.find((subscribers) => subscribers.user_id === this.selectedSubscriber);
      if (foundSubscriber) {
        this.selectedSubscriber = foundSubscriber;
      }
    } else { }
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onDateChange(selectedDate: Moment): void {
    this.agreementDate = selectedDate;
  }

  sendFormAgreement(subscriber: Subscribers): void {
    this.formSubmitted = true;
    if (!this.isFormEmpty()) {
      const selectedFlatId = this.selectedFlatIdService.getSelectedFlatId();
      const userJson = localStorage.getItem('user');
      this.agreementDate = this.datePipe.transform(this.agreementDate, 'yyyy-MM-dd');
      if (userJson && selectedFlatId && subscriber) {
        const data = {
          auth: JSON.parse(userJson),
          flat_id: selectedFlatId,
          owner: {
            user_id: this.userData?.cont?.user_id,
            firstName: this.userData?.inf?.firstName,
            lastName: this.userData?.inf?.lastName,
            surName: this.userData?.inf?.surName,
            tell: this.userData?.cont?.tell,
            mail: this.userData?.cont?.mail,
            owner_img: this.userData?.img[0].img,
          },

          subscriber: {
            user_id: this.selectedSubscriber?.user_id,
            firstName: this.selectedSubscriber?.firstName,
            lastName: this.selectedSubscriber?.lastName,
            surName: this.selectedSubscriber?.surName,
            tell: this.selectedSubscriber?.tell,
            mail: this.selectedSubscriber?.mail,
            subscriber_img: this.selectedSubscriber?.img,
          },

          house: {
            flat_id: this.houseData?.about.flat_id,
            city: this.houseData?.flat.city,
            houseNumber: this.houseData?.flat.houseNumber,
            apartment: this.houseData?.flat.apartment,
            area: this.houseData?.param.area,
            price: this.houseData?.about.price_m,
            street: this.houseData?.flat.street,
          },

          terms: {
            agreementDate: this.agreementDate,
            month: this.months || 0,
            days: this.days || 0,
            year: this.years || 0,
            rent_due_data: this.rentDueDate,
            penalty: this.penalty,
            max_penalty: this.maxPenalty,
            agree: this.isCheckboxChecked,
            about: this.conditions,
            agreement_type: this.agreement_type,
          }
        };
        this.http.post('http://localhost:3000/agreement/add/agreement', data)
          .subscribe(
            (response: any) => {
              this.loading = true;
              if (response.status === 'Данні введено не правильно') {
                console.error(response.status);
                setTimeout(() => {
                  this.statusMessage = 'Помилка формування угоди.';
                  setTimeout(() => {
                    location.reload();
                  }, 2000);
                }, 2000);
              } else {
                setTimeout(() => {
                  this.statusMessage = 'Угода надіслана на розгляд орендарю!';
                  setTimeout(() => {
                    this.router.navigate(['/house/agree-review']);
                  }, 3000);
                }, 2000);
              }
            },
            (error: any) => {
              console.error(error);
              setTimeout(() => {
                this.statusMessage = 'Помилка формування угоди.';
                setTimeout(() => {
                  location.reload();
                }, 2000);
              }, 2000);
            }
          );
        this.loading = false;
      } else {
        console.log('User, flat, or subscriber not found');
        this.loading = false;
      }
    }
  }


  isFormEmpty(): boolean {
    return !this.rentDueDate || isNaN(Number(this.months));
  }

  showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.message = '';
  }
}

