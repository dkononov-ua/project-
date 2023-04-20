import { Component, OnInit } from '@angular/core';
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

  formErrors: any = {
    flat_id: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
    },
  };

  comunStatistics!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  selectedFlatId: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) {
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
    console.log(this.comunStatistics.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.comunStatistics.value, flat_id: this.selectedFlatId })
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
    this.comunStatistics.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetComunStatistics() {
    this.comunStatistics.reset();
  }

  private initializeForm(): void {
    this.comunStatistics = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
    });
  }
}
