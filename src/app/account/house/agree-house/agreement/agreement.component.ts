import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, NgModule, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { ChoseSubscribersService } from 'src/app/services/chose-subscribers.service';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { DataService } from 'src/app/services/data.service';

import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
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
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
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
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateY(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation5', [
      transition('void => *', [
        style({ transform: 'translateY(100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ])
  ],

})
export class AgreementComponent implements OnInit {
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
  years: number | undefined;
  rentDueDate: number | undefined;
  penalty?: number = 0;
  maxPenalty?: number = 0;

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
  agreementDate: any = moment();
  formSubmitted: boolean = false;
  agreementCreated: boolean | undefined;
  statusMessage: string | undefined;

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
  ) { }

  async ngOnInit(): Promise<any> {

    await this.loadData();
    await this.getAgent();

    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      if (selectedFlatId) {
        const offs = 0;
        await this.getSubs(selectedFlatId, offs);
        this.foundSubscriber();
      }
    });

    this.route.params.subscribe(params => {
      this.selectedSubscriber = params['selectedSubscriber?.user_id'] || null;
      console.log(this.selectedSubscriber);
      this.foundSubscriber();
    });
  }

  async loadData(): Promise<void> {
    this.dataService.getData().subscribe((response: any) => {
      this.houseData = response.houseData;
      this.loading = false;
      console.log(this.houseData)
    }, (error) => {
      console.error(error);
      this.loading = false;
    });
  }

  async getAgent(): Promise<any> {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      console.log(selectedFlatId);
      const userJson = localStorage.getItem('user');
      const url = 'http://localhost:3000/userinfo/agent';
      const data = {
        auth: JSON.parse(userJson!),
        flat_id: selectedFlatId,
      };
      console.log(selectedFlatId);
      try {
        const response = await this.http.post(url, data).toPromise() as any[];
        console.log(response);
        this.userData = response;
        if (!this.userData.cont.mail) {
          this.userData.cont.mail = 'Не вказано';
        }
      } catch (error) {
        console.error(error);
      }
    });
  }


  async getSubs(selectedSubscriberId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = 'http://localhost:3000/acceptsubs/get/subs';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedSubscriberId,
      offs: offs,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      console.log(response)
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
    } else {
      console.log('Nothing selected');
    }
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
            user_id: this.userData?.cont
              ?.user_id,
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
            month: this.months,
            year: this.years,
            rent_due_data: this.rentDueDate,
            penalty: this.penalty,
            max_penalty: this.maxPenalty,
            agree: this.isCheckboxChecked,
          }
        };

        console.log(data);
        this.loading = true;

        this.http.post('http://localhost:3000/agreement/add/agreement', data)
          .subscribe(
            (response: any) => {
              console.log(response)
              setTimeout(() => {
                this.loading = false;
                setTimeout(() => {
                  this.statusMessage = 'Угода надіслана на розгляд орендарю!';
                  setTimeout(() => {
                    this.router.navigate(['/agreements-h']);
                  }, 4000);
                }, 100);
              }, 3000);
            },
            (error: any) => {
              console.error(error);
              setTimeout(() => {
                this.loading = false;
                this.statusMessage = 'Помилка формування угоди.';
              }, 3000);
            }
          );
      } else {
        console.log('User, flat, or subscriber not found');
        this.loading = false;
      }
    }
  }

  isFormEmpty(): boolean {
    return  !this.rentDueDate || isNaN(Number(this.months));
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
