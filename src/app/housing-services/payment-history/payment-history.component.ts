import { Component, HostListener, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject } from 'rxjs';

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

  years = [2023, 2022, 2021, 2020 ];

  selectedMonth: string | undefined;
  selectedYear: number | undefined;

  // months: string[] = [];

  // generateMonthList(): void {
  //   const currentDate = new Date();
  //   let prevYear = '';

  //   for (let i = 0; i < 60; i++) {
  //     const year = currentDate.getFullYear() - Math.floor(i / 12);
  //     const month = (currentDate.getMonth() - (i % 12) + 12) % 12;
  //     const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  //     this.months.push(monthName);

  //     if (month === 0) {
  //       this.months.push(year.toString());
  //       prevYear = year.toString();
  //     }
  //   }
  // }

  onMouseWheel(event: WheelEvent): void {
    const monthList = document.querySelector('.month-list');
    if (monthList) {
      monthList.scrollTop += event.deltaY;
      event.preventDefault();
    }
  }

  formErrors: any = {
    flat_id: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
    },
  };

  ComunStatistics!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  selectedFlatId: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) {
    // this.generateMonthList();
    // this.hostComunComponent.selectedFlatId$.subscribe((selectedFlatId: any) => {
    //   this.selectedFlatId = selectedFlatId;
    //   const userJson = localStorage.getItem('user');
    //   if (userJson) {
    //     this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
    //       .subscribe((response: any) => {
    //         if (response !== null) {
    //           this.ComunStatistics = this.fb.group({
    //             flat_id: [response.flat_id],
    //             totalPaid: [response.flat.totalPaid],
    //             monthAveragePaid: [response.flat.monthAveragePaid],
    //             monthPredictedPaid: [response.flat.monthPredictedPaid],
    //             totalConsumption: [response.flat.totalConsumption],
    //             monthAverageConsumption: [response.flat.monthAverageConsumption],
    //             monthPredictedConsumption: [response.flat.monthPredictedConsumption],
    //             consumed: [response.flat.consumed],
    //             comunal_counter_before: [response.flat.comunal_counter_before],
    //             comunal_counter_now: [response.flat.comunal_counter_now],
    //             tariff: [response.flat.tariff],
    //             calculation: [response.flat.calculation],
    //           });
    //         }
    //       }, (error: any) => {
    //         console.error(error);
    //       });
    //   } else {
    //     console.log('user not found');
    //   }
    //   this.initializeForm();
    // });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmitSaveComunStatistics(): void {
    console.log(this.ComunStatistics.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.ComunStatistics.value, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveComunStatistics(): void {
    this.ComunStatistics.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetComunStatistics() {
    this.ComunStatistics.reset();
  }

  private initializeForm(): void {
    this.ComunStatistics = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
    });
  }
}
