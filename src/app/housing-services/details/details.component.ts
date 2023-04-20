import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { HostComunComponent } from '../host-comun/host-comun.component';
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

  formErrors: any = {
    flat_id: '',
    comunal_name: '',
    comunal_address: '',
    comunal_site: '',
    comunal_phone: '',
    IBAN: '',
    EDRPO: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
    },
    comunal_name: {
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
    IBAN: {
      required: 'Обов`язково',
    },
    EDRPO: {
      required: 'Обов`язково',
    },
  };

  comunDetails!: FormGroup;
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
    //           this.comunDetails = this.fb.group({
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
    this.initializeForm();
  }

  onSubmitSaveComunDetails(): void {
    console.log(this.comunDetails.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.comunDetails.value, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
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
      IBAN: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/),
      ]],
      EDRPO: [null, [
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
