import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { HostComunComponent } from '../host-comun/host-comun.component';
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
    indicatorMonth: '',
    comunal_counter_before: '',
    comunal_counter_now: '',
  };

  user = {
    firstName: '',
    lastName: '',
    surName: '',
    email: '',
    password: '',
    dob: '',
    tell: '',
    telegram: '',
    facebook: '',
    instagram: '',
    mail: '',
    viber: '',
  };

  house = {
    flat_id: '',
    country: '',
    region: '',
    city: '',
    street: '',
    houseNumber: '',
    apartment: '',
    flat_index: '',
    private: '',
    rent: '',
    live: '',
    who_live: '',
    subscribers: '',
  };

  validationMessages: any = {
    account_for: {
      required: 'houseId обов`язково',
    },
    personalAccount: {
      required: 'Обов`язково',
    },
    indicatorMonth: {
      required: 'Обов`язково',
    },
    comunal_counter_before: {
      required: 'Обов`язково',
    },
    comunal_counter_now: {
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

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) {
  }

  ngOnInit(): void {
    this.comunCabinet = this.fb.group({
      account_for: ['', Validators.required],
      personalAccount: ['', Validators.required],
      indicatorMonth: ['', Validators.required],
      comunal_counter_before: ['', Validators.required],
      comunal_counter_now: ['', Validators.required],
    });

    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    localStorage.getItem('selectedComunal');

    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          this.comunCabinet.setValue({
            account_for: response.userData.inf.lastName + ' ' + response.userData.inf.firstName + ' ' + response.userData.inf.surName,
            personalAccount: response.comunal.personalAccount,
            indicatorMonth: response.comunal.indicatorMonth,
            comunal_counter_before: response.comunal.comunal_counter_before,
            comunal_counter_now: response.comunal.comunal_counter_now,
          });

          this.house.flat_id = response.houseData.flat.flat_id;
        });
      }
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
      indicatorMonth: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^[0-9]+$/),
      ]],
      comunal_counter_before: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(/^[0-9]+$/),
      ]],
      comunal_counter_now: [null, [
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

