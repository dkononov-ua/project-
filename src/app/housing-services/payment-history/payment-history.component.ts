import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject, debounceTime } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  loading = false;
  howmuch_pay: any;
  tariff: any;
  tariffValue: any;
  unit: string | undefined;
  consumed: any;
  calc_howmuch_pay: any;

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  formErrors: any = {
    flat_id: '',
    comunal_name: '',
    comunal_address: '',
    comunal_site: '',
    comunal_phone: '',
    iban: '',
    edrpo: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
    },
    comunal_company: {
      required: 'Обов`язково',
    },
    comunal_address: {
      required: 'Обов`язково',
    },
    comunal_site: {
      required: 'Обов`язково',
    },
    comunal_phone: {
      required: 'Обов`язково',
    },
    iban: {
      required: 'Обов`язково',
    },
    edrpo: {
      required: 'Обов`язково',
    },
  };

  houses: { id: number, name: string }[] = [];
  selectedMonth: string | undefined;
  selectedYear: number | undefined;
  comunStatisticsMonth!: FormGroup;
  comunStatisticsYear!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  comunal_name: any;
  public selectedFlatId: any;
  public selectedComunal: any | null;

  constructor(private snackBar: MatSnackBar, private fb: FormBuilder, private dataService: DataService, private http: HttpClient, private hostComunComponent: HostComunComponent) {
  }

  openSnackBar(message: string) {
    this.snackBar.open('Дані збережено', 'Закрити', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  ngOnChanges() {
    switch (this.comunal_name) {
      case 'Холодна вода':
        this.unit = 'м³';
        break;
      case 'Газ':
        this.unit = 'м³';
        break;
      case 'Електроенергія':
        this.unit = 'кВтг';
        break;
      case 'Heating':
        this.unit = 'Гкал';
        break;
      default:
        this.unit = '';
        break;
    }
    this.comunStatisticsMonth.patchValue({ unit: this.unit });
  }

  ngOnInit(): void {
    const previousData = JSON.parse(localStorage.getItem('previousData') || '{}');

    this.comunStatisticsYear = this.fb.group({});
    this.comunStatisticsMonth = this.fb.group({
      comunal_company: ['', Validators.required],
      comunal_address: ['', Validators.required],
      comunal_site: ['', Validators.required],
      comunal_phone: ['', Validators.required],
      iban: ['', Validators.required],
      edrpo: ['', Validators.required],

      personalAccount: ['', Validators.required],
      comunal_before: ['', Validators.required],
      comunal_now: ['', Validators.required],
      consumed: ['', Validators.required],
      tariff: ['', Validators.required],
      calc_howmuch_pay: ['', Validators.required],
      howmuch_pay: ['', Validators.required],
      about_pay: ['', Validators.required],
    });

    const userJson = localStorage.getItem('user');
    this.selectedFlatId = localStorage.getItem('house');
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;

    if (selectedYear && userJson) {
      this.http.post('http://localhost:3000/comunal/get/comunal', {
        auth: JSON.parse(userJson),
        flat_id: JSON.parse(this.selectedFlatId).flat_id,
        comunal_name: comunalName,
        when_pay_y: JSON.parse(selectedYear)
      })
        .subscribe((response: any) => {
          localStorage.setItem('comunal_inf', JSON.stringify(response));
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }

    this.selectedYear = selectedYear ? JSON.parse(selectedYear) : null;
    this.selectedMonth = selectedMonth ? JSON.parse(selectedMonth) : null;

    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);

    if (userJson && com_inf) {
      const value = com_inf.comunal.find((value: any) => {
        return value.when_pay_y === String(this.selectedYear) &&
          value.when_pay_m === this.selectedMonth &&
          value.comunal_name === comunalName;
      });

      if (value) {
        console.log(value);
        this.comunStatisticsMonth.patchValue({
          comunal_company: value.comunal_company,
          comunal_address: value.comunal_address,
          comunal_site: value.comunal_site,
          comunal_phone: value.comunal_phone,
          iban: value.iban,
          edrpo: value.edrpo,

          personalAccount: value.personalAccount,
          comunal_before: value.comunal_before,
          comunal_now: value.comunal_now,
          howmuch_pay: value.howmuch_pay,
          about_pay: value.about_pay,
        });
        this.calculateConsumed();
        this.comunStatisticsMonth.valueChanges.pipe(
          debounceTime(1000)
        ).subscribe(() => {
          this.calculateConsumed();
        });
      }
    } else {
      console.log('user not found');
    }
  }


  calculateConsumed(): void {
    const comunal_before = this.comunStatisticsMonth.get('comunal_before')?.value;
    const comunal_now = this.comunStatisticsMonth.get('comunal_now')?.value;

    let tariff;
    const consumed = comunal_now - comunal_before;
    if (consumed <= 250) {
      tariff = 1.44;
    } else {
      tariff = 1.68;
    }
    const calc_howmuch_pay = tariff * consumed;

    this.comunStatisticsMonth.patchValue({
      consumed: consumed.toFixed(2),
      calc_howmuch_pay: calc_howmuch_pay.toFixed(2),
      tariff: tariff.toFixed(2),
    });
    console.log(tariff)
  }

  onSubmit(): void {
    const { comunal_company, comunal_address, comunal_site, comunal_phone, iban, edrpo, personalAccount, comunal_now } = this.comunStatisticsMonth.value;
    const formData = { comunal_company, comunal_address, comunal_site, comunal_phone, iban, edrpo, personalAccount, comunal_before: comunal_now };

    localStorage.setItem('previousData', JSON.stringify(formData));

    this.onSubmitSaveComunStatisticsMonth();
  }


  fillPreviousData(): void {
    const previousData = JSON.parse(localStorage.getItem('previousData') || '{}');
    this.comunStatisticsMonth.patchValue(previousData);
  }

  onSubmitSaveComunStatisticsMonth() {
    this.loading = true;

    const comunal_name = localStorage.getItem('comunal_name');
    const userJson = localStorage.getItem('user');

    console.log(JSON.parse(localStorage.getItem('selectedMonth')!));
    if (userJson) {
      if (this.comunStatisticsMonth) {
        const comunalData = {
          comunal_company: this.comunStatisticsMonth.get('comunal_company')?.value,
          comunal_address: this.comunStatisticsMonth.get('comunal_address')?.value,
          comunal_site: this.comunStatisticsMonth.get('comunal_site')?.value,
          comunal_phone: this.comunStatisticsMonth.get('comunal_phone')?.value,
          iban: this.comunStatisticsMonth.get('iban')?.value,
          edrpo: this.comunStatisticsMonth.get('edrpo')?.value,

          personalAccount: this.comunStatisticsMonth.get('personalAccount')?.value,
          comunal_before: this.comunStatisticsMonth.get('comunal_before')?.value,
          comunal_now: this.comunStatisticsMonth.get('comunal_now')?.value,
          consumed: this.comunStatisticsMonth.get('consumed')?.value,
          tariff: this.comunStatisticsMonth.get('tariff')?.value,
          calc_howmuch_pay: this.comunStatisticsMonth.get('calc_howmuch_pay')?.value,
          howmuch_pay: this.comunStatisticsMonth.get('howmuch_pay')?.value,
          about_pay: this.comunStatisticsMonth.get('about_pay')?.value,
        };
        this.http
          .post('http://localhost:3000/comunal/add/comunal', {
            auth: JSON.parse(userJson),
            flat_id: JSON.parse(this.selectedFlatId).flat_id,
            comunal_name: JSON.parse(comunal_name!).comunal,
            when_pay_y: JSON.parse(localStorage.getItem('selectedYear')!),
            when_pay_m: JSON.parse(localStorage.getItem('selectedMonth')!),
            comunal: comunalData,
          })
          .subscribe(
            (response: any) => {
              localStorage.removeItem('selectedMonth');
              location.reload
            },
          );
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
}
