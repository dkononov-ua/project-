import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HostComunComponent } from '../host-comun/host-comun.component';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-eng-cabinet',
  templateUrl: './eng-cabinet.component.html',
  styleUrls: ['./eng-cabinet.component.scss'],
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
  ],
  template: '{{ selectedFlatId }}'
})
export class EngCabinetComponent implements OnInit {

  formErrors: any = {
    flat_id: '',
    account_for: '',
    personalAccount: '',
    comunal_before: '',
    comunal_now: '',
  };

  user = {
    firstName: '',
    lastName: '',
    surName: '',
  };

  validationMessages: any = {
    account_for: {
      required: 'houseId обов`язково',
    },
    personalAccount: {
      required: 'Обов`язково',
    },
    comunal_before: {
      required: 'Обов`язково',
    },
    comunal_now: {
      required: 'Обов`язково',
    },
  };

  public selectedComunal: any | null;
  public selectedFlatId: any | null;
  public comunal_name!: string | any;
  houses: { id: number, name: string }[] = [];
  addressHouse: FormGroup | undefined;

  comunCabinet!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  userImg: any;
  account_for: any;
  selectedMonth: string | null | undefined;
  selectedYear: string | null | undefined;
  comunal_before: any;

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) {
  }

  ngOnInit(): any {

    this.comunCabinet = this.fb.group({
      account_for: ['', Validators.required],
      personalAccount: ['', Validators.required],
      comunal_before: ['', Validators.required],
      comunal_now: ['', Validators.required],
    });

    const userJson = localStorage.getItem('user');
    this.selectedFlatId = localStorage.getItem('house');
    const comunalName = JSON.parse(localStorage.getItem('comunal_name')!).comunal;
    const selectedYear = localStorage.getItem('selectedYear');
    const selectedMonth = localStorage.getItem('selectedMonth');

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
        if (value.comunal_name === comunalName) {
          if (value.when_pay_y === String(this.selectedYear)) {
            if (value.when_pay_m === this.selectedMonth) {
              console.log(value);
              this.dataService.getData().subscribe((response: any) => {
                this.comunCabinet.setValue({
                  account_for: response.userData.inf.lastName + ' ' + response.userData.inf.firstName + ' ' + response.userData.inf.surName,
                  personalAccount: value.personalAccount,
                  comunal_before: value.comunal_before,
                  comunal_now: value.comunal_now,
                });
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

  onSubmitSaveComunCabinet(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/comunal', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId, comunal: this.selectedComunal, new: this.comunCabinet.value })
        .subscribe((response: any) => {
        }, (error: any) => {
          console.log(this.selectedFlatId)
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveComunCabinet(): void {
    this.comunCabinet.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetComunCabinet() {
    this.comunCabinet.reset();
  }

  private initializeForm(): void {
    this.comunCabinet = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]],
      account_for: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      personalAccount: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
      ]],
      comunal_before: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/),
      ]],
      comunal_now: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
    });

    this.comunCabinet.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const comunCabinet = this.comunCabinet;
    for (const field in comunCabinet.controls) {
      const control = comunCabinet.get(field);
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

