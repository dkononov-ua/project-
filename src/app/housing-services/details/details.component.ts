import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms 200ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class DetailsComponent {

  loading = false;

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

  comunDetails!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  selectedFlatId: any;
  selectedYear: string | null | undefined;
  selectedMonth: string | null | undefined;

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) { }

  ngOnInit(): any {
    this.comunDetails = this.fb.group({
      comunal_company: ['', Validators.required],
      comunal_address: ['', Validators.required],
      comunal_site: ['', Validators.required],
      comunal_phone: ['', Validators.required],
      iban: ['', Validators.required],
      edrpo: ['', Validators.required],
    });

    const userJson = localStorage.getItem('user');
    this.selectedFlatId = localStorage.getItem('house');
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;

    if (selectedYear) {
      if (userJson) {
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

      this.selectedYear = JSON.parse(selectedYear);
    }
    if (selectedMonth) {
      this.selectedMonth = JSON.parse(selectedMonth);
    }

    const com_inf = JSON.parse(localStorage.getItem('comunal_inf')!);
    if (userJson) {
      com_inf.comunal.forEach((value: any) => {
        console.log(value.when_pay_m);
        if (value.when_pay_y === String(this.selectedYear)) {
          if (value.when_pay_m === this.selectedMonth) {
            if (value.comunal_name === comunalName) {
              console.log(value);
              this.comunDetails.setValue({
                comunal_company: value.comunal_company,
                comunal_address: value.comunal_address,
                comunal_site: value.comunal_site,
                comunal_phone: value.comunal_phone,
                iban: value.iban,
                edrpo: value.edrpo,
              });
            }
          }
        }
      });
    }
    else {
      console.log('user not found');
    }
  }

    onSubmitSaveComunDetails() {
    this.loading = true;

    const comunal_name = localStorage.getItem('comunal_name');
    const userJson = localStorage.getItem('user');
    if (userJson) {
      if (this.comunDetails) {
        this.http.post('http://localhost:3000/comunal/add/comunal', {
          auth: JSON.parse(userJson),
          flat_id: JSON.parse(this.selectedFlatId).flat_id,
          comunal_name: JSON.parse(comunal_name!).comunal,
          when_pay_y: this.selectedYear,
          when_pay_m: this.selectedMonth,
          comunal: this.comunDetails.value,
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
    location.reload();
  }

  saveComunDetails(): void {
    this.comunDetails.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetComunDetails() {
    this.comunDetails.reset();
  }

  private initializeForm(): void {
    this.comunDetails = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
      comunal_name: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      comunal_address: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
      ]],
      comunal_site: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^[0-9]+$/),
      ]],
      comunal_phone: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/),
      ]],
      iban: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      edrpo: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
    });

    this.comunDetails.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const comunDetails = this.comunDetails;
    for (const field in comunDetails.controls) {
      const control = comunDetails.get(field);
      this.formErrors[field] = '';

      if (control && control.dirty && control.invalid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
