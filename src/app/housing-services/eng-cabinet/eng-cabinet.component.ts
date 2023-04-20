import { Component } from '@angular/core';
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
  ]
})
export class EngCabinetComponent {
  formErrors: any = {
    flat_id: '',
    accountFor: '',
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
    accountFor: {
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

  public selectedFlatId: any | null;
  comunCabinet!: FormGroup;
  errorMessage$ = new Subject<string>();
  isDisabled?: boolean;
  formDisabled?: boolean;
  selectHouse: any;
  userImg: any;
  account_for: any;

  constructor(private dataService: DataService, private fb: FormBuilder, private http: HttpClient, private hostComunComponent: HostComunComponent) {
    // this.hostComunComponent.selectedFlatId$.subscribe((selectedFlatId: any) => {
    //   this.selectedFlatId = selectedFlatId;
    //   const userJson = localStorage.getItem('user');
    //   if (userJson) {
    //     this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
    //       .subscribe((response: any) => {
    //         if (response !== null) {
    //           this.comunCabinet = this.fb.group({
    //             flat_id: [response.flat_id],
    //             comunal_name: [response.flat.comunal_name],
    //             comunal_address: [response.flat.comunal_address],
    //             comunal_site: [response.flat.comunal_site],
    //             comunal_phone: [response.flat.comunal_phone],
    //             IBAN: [response.flat.IBAN],
    //             EDRPO: [response.flat.EDRPO],
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
    const userJson = localStorage.getItem('user');
    const houseJson = localStorage.getItem('house');
    if (userJson !== null) {
      if (houseJson !== null) {
        this.dataService.getData().subscribe((response: any) => {
          this.user.firstName = response.userData.inf.firstName;
          this.user.lastName = response.userData.inf.lastName;
          this.user.surName = response.userData.inf.surName;
          this.user.email = response.userData.inf.email;
          this.user.password = response.userData.inf.password;
          this.user.dob = response.userData.inf.dob;

          this.house.region = response.houseData.flat.region;
          this.house.flat_id = response.houseData.flat.flat_id;
          this.house.country = response.houseData.flat.country;
          this.house.city = response.houseData.flat.city;
          this.house.street = response.houseData.flat.street;
          this.house.houseNumber = response.houseData.flat.houseNumber;
          this.house.apartment = response.houseData.flat.apartment;
          this.house.flat_index = response.houseData.flat.flat_index;
          this.house.private = response.houseData.flat.private;
          this.house.rent = response.houseData.flat.rent;
          this.house.live = response.houseData.flat.live;
          this.house.who_live = response.houseData.flat.who_live;
        });
      }
    }
  }

  onSubmitSaveComunCabinet(): void {
    console.log(this.comunCabinet.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.comunCabinet.value, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
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
      accountFor: [null, [
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

