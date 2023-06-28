import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

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


interface Agree {
  flat: {
    agreementDate: string;
    agreement_id: string;
    apartment: string;
    city: string;
    flat_id: string;
    houseNumber: string;
    max_penalty: string;
    month: number;
    owner_email: string;
    owner_firstName: string;
    owner_id: string;
    owner_lastName: string;
    owner_surName: string;
    owner_tell: string;
    owner_img: string;
    penalty: string;
    price: string;
    rent_due_data: number;
    street: string;
    subscriber_email: string;
    subscriber_firstName: string;
    subscriber_id: string;
    subscriber_lastName: string;
    subscriber_surName: string;
    subscriber_tell: string;
    year: number;
    area: number;
  };
  img: string[];
}

@Component({
  selector: 'app-agree-u',
  templateUrl: './agree-u.component.html',
  styleUrls: ['./agree-u.component.scss'],
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
      transition('* => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('* => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('* => *', [
        style({ transform: 'translateY(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('* => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation5', [
      transition('* => *', [
        style({ transform: 'translateY(100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ]),
    trigger('cardAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],

})
export class AgreeUComponent implements OnInit {
  selectedFlatId: string | null = null;
  agree: Agree[] = [];
  houseData: any;
  userData: any;
  loading: boolean = true;
  isMonthDisabled = true;
  isYearDisabled = true;
  isRentDataDisabled = true;
  isCityDisabled = true;
  isStreetDisabled = true;
  isApartmentNumberDisabled = true;
  isHouseNumberDisabled = true;
  isApartmentSizeDisabled = true;
  isCheckboxPenalty = true;
  isRentPriceDisabled = true;
  isCheckboxChecked = false;
  isContainerVisible = false;

  selectedAgreement: any;
  flatId: string | null | undefined;
  selectedFlatAgree: any;
  statusMessage: string | undefined;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<any> {
    this.route.params.subscribe(params => {
      this.selectedFlatAgree = params['selectedFlatAgree'] || null;
      console.log(this.selectedFlatAgree);
    });

    console.log(this.flatId)
    await this.getAgree();
    this.loadData();
    this.onChange()

  }

  loadData(): void {
    this.dataService.getData().subscribe(
      (response: any) => {
        this.houseData = response.houseData;
        this.userData = response.userData;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  async getAgree(): Promise<void> {
    const userJson = localStorage.getItem('user');
    const user_id = JSON.parse(userJson!).email;
    const url = 'http://localhost:3000/agreement/get/yagreements';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
      offs: 0
    };

    try {
      const response = (await this.http.post(url, data).toPromise()) as Agree[];
      console.log(response);
      this.agree = response;
      console.log(this.agree);
    } catch (error) {
      console.error(error);
    }
  }

  onSelectionChange(): void {
    if (this.selectedFlatId) {
      console.log('You selected a dwelling with ID:', this.selectedFlatId);

      this.selectedAgreement = this.agree.find((agreement) => agreement.flat.flat_id === this.selectedFlatId);
      if (this.selectedAgreement) {
      }
    } else {
      console.log('Nothing selected');
    }
  }

  onChange(): void {
    if (this.selectedFlatAgree) {
      console.log('You selected a dwelling with ID:', this.selectedFlatAgree);

      this.selectedAgreement = this.agree.find((agreement) => agreement.flat.flat_id === this.selectedFlatAgree);
      this.selectedFlatId = this.selectedFlatAgree
      console.log(this.selectedAgreement)
      if (this.selectedAgreement) {
      }
    } else {
      console.log('Nothing selected');
    }
  }

  openContainer(): void {
    this.isContainerVisible = true;
  }

  closeContainer(): void {
    this.isContainerVisible = false;
  }

  agreeAgreement(a: any): void {
    this.loading = true;

    const selectedFlatId = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedFlatId) {
      const data = {
        auth: JSON.parse(userJson),
        agreement_id: this.selectedAgreement.flat.agreement_id,
        flat_id: selectedFlatId,
        user_id: this.selectedAgreement.flat.subscriber_id,
        i_agree: true,
      };

      this.http.post('http://localhost:3000/agreement/accept/agreement', data)
        .subscribe(
          (response: any) => {
            console.log(response)
            setTimeout(() => {
              this.loading = false;
              setTimeout(() => {
                this.statusMessage = 'Угода підписана!';
                setTimeout(() => {
                  this.router.navigate(['/user/concluded-agree']);
                }, 4000);
              }, 100);
            }, 3000);
          },
          (error: any) => {
            console.error(error);
            setTimeout(() => {
              this.loading = false;
              this.statusMessage = 'Помилка підписання угоди.';
            }, 3000);
          }
        );
    } else {
      console.log('User, flat, or subscriber not found');
      this.loading = false;
    }
  }






}
