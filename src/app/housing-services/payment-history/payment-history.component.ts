import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(200%)' }),
        animate('1200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ])
  ],
  template: '{{ selectedFlatId }}'
})
export class PaymentHistoryComponent implements OnInit {

  months = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень'
  ];

  years = [2023, 2022, 2021, 2020];
  houses: { id: number, name: string }[] = [];


  selectedMonth: string | undefined;
  selectedYear: number | undefined;

  formErrors: any = {
    flat_id: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
    },
  };

  comunStatisticsMonth!: FormGroup;
  comunStatisticsYear!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  comunal_name: any;
  public selectedFlatId: any;
  public selectedComunal: any | null;

  constructor(private fb: FormBuilder, private dataService: DataService, private http: HttpClient, private hostComunComponent: HostComunComponent) {
  }

  ngOnInit(): void {
    this.comunStatisticsYear = this.fb.group({
      years: ['', Validators.required],
      totalPaid: ['', Validators.required],
      monthAveragePaid: ['', Validators.required],
      monthPredictedPaid: ['', Validators.required],
      totalConsumption: ['', Validators.required],
      monthAverageConsumption: ['', Validators.required],
      monthPredictedConsumption: ['', Validators.required],
    });

    this.comunStatisticsMonth = this.fb.group({
      month: ['', Validators.required],
      consumed: ['', Validators.required],
      howmuch_pay: ['', Validators.required],
      comunal_before: ['', Validators.required],
      comunal_now: ['', Validators.required],
      tariff: ['', Validators.required],
      calculation: ['', Validators.required],
    });

    this.selectedFlatId = localStorage.getItem('house');
    console.log(this.selectedFlatId)

    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    const comunal_name = localStorage.getItem('comunal_name');
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');

    console.log(this.selectedFlatId)
    console.log(comunal_name)

    if (userJson !== null) {
      if (houseJson !== null) {
        if (comunal_name !== null) {
          this.dataService.getData().subscribe((response: any) => {

            this.comunStatisticsYear.setValue({
              year: response.comunal.year,
              totalPaid: response.comunal.totalPaid,
              monthAveragePaid: response.comunal.monthAveragePaid,
              monthPredictedPaid: response.comunal.monthPredictedPaid,
              totalConsumption: response.comunal.totalConsumption,
              monthAverageConsumption: response.comunal.monthAverageConsumption,
              monthPredictedConsumption: response.comunal.monthPredictedConsumption,
            });

            //  tok.comunal.comunal_company, tok.comunal.comunal_counter, tok.comunal.comunal_before,
            //  tok.comunal.comunal_now, tok.comunal.edrpo, tok.comunal.iban, tok.comunal.payment_system,
            //   tok.comunal.howmuch_pay, tok.comunal.about_pay,

            this.comunStatisticsMonth.setValue({
              months: response.comunal.month,
              // consumed: response.comunal.consumed,
              howmuch_pay: response.comunal.howmuch_pay,
              comunal_before: response.comunal.comunal_before,
              comunal_now: response.comunal.comunal_now,
              // tariff: response.comunal.tariff,
              // calculation: response.comunal.calculation,
            });
          });
        }
      }
    }
  }

  onSelectionChangeYear(): void {
    console.log(123)
    localStorage.setItem('selectedYear', JSON.stringify({ flat_id: this.selectedFlatId }))
    localStorage.removeItem('selectedMonth')

    const userJson = localStorage.getItem('user');
    const comunal_name = localStorage.getItem('comunal_name');

    if (userJson) {
      this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: JSON.parse(this.selectedFlatId).flat_id,
        comunal_name: JSON.parse(comunal_name!).comunal,
        when_pay_y: this.selectedYear
      })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  onSelectionChangeMonth(): void {
    const userJson = localStorage.getItem('user');
    const selectedFlatId = localStorage.getItem('selectedFlatId');
    const comunal_name = localStorage.getItem('comunal_name');

    if (userJson) {
      this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: JSON.parse(this.selectedFlatId).flat_id,
        comunal_name: JSON.parse(comunal_name!).comunal,
        when_pay_y: this.selectedYear,
        when_pay_m: this.selectedMonth
      })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  onSubmitSaveComunStatisticsMonth() {
    const comunal_name = localStorage.getItem('comunal_name');
    const userJson = localStorage.getItem('user');
    if (userJson) {
      if (this.comunStatisticsMonth) {
        this.http.post('http://localhost:3000/comunal/add/comunal', {
          auth: JSON.parse(userJson),
          flat_id: JSON.parse(this.selectedFlatId).flat_id,
          comunal_name: JSON.parse(comunal_name!).comunal,
          when_pay_y: this.selectedYear,
          when_pay_m: this.selectedMonth,
          comunal: this.comunStatisticsMonth.value,
        })
          .subscribe((response: any) => {
            console.log(response);
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('comunCreate is not defined');
      }
    } else {
      console.log('user not found');
    }
  }

  saveComunStatistics(): void {
    this.comunStatisticsMonth.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetComunStatistics() {
    this.comunStatisticsMonth.reset();
  }

  private initializeForm(): void {
    this.comunStatisticsMonth = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
    });
    this.comunStatisticsYear = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
    });
  }
}
