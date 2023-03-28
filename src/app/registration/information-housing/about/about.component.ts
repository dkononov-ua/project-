import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from '../../validation.service';
import { HostComponent } from '../host/host.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {
  houseAbout = {
    distance_metro: new FormControl({ value: '', disabled: true }),
    distance_stops: new FormControl({ value: '', disabled: true }),
    distance_shop: new FormControl({ value: '', disabled: true }),
    distance_green: new FormControl({ value: '', disabled: true }),
    distance_parking: new FormControl({ value: '', disabled: true }),
    woman: new FormControl({ value: '', disabled: true }),
    man: new FormControl({ value: '', disabled: true }),
    family: new FormControl({ value: '', disabled: true }),
    students: new FormControl({ value: '', disabled: true }),
    animals: new FormControl({ value: '', disabled: true }),
    price_m: new FormControl({ value: '', disabled: true }),
    price_y: new FormControl({ value: '', disabled: true }),
    about: new FormControl({ value: '', disabled: true }),
    bunker: new FormControl({ value: '', disabled: true }),
  };

  public selectedFlatId: any | null;

  formErrors: any = {
    floor: '',
  };

  validationMessages: any = {
    floor: {
      required: 'Обов`язково',
      minlength: 'Мінімальна довжина 1 символ',
      pattern: 'Не коректно',
    },
  };

  isDisabled: boolean | undefined;
  formDisabled: boolean | undefined;
  aboutHouse!: FormGroup<{ distance_metro: FormControl<any>; distance_stops: FormControl<any>; distance_shop: FormControl<any>; distance_green: FormControl<any>; distance_parking: FormControl<any>; woman: FormControl<any>; man: FormControl<any>; family: FormControl<any>; students: FormControl<any>; animals: FormControl<any>; price_m: FormControl<any>; price_y: FormControl<any>; about: FormControl<any>; bunker: FormControl<any>; }>;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComponent: HostComponent,) {
    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId) => {
      this.selectedFlatId = selectedFlatId;
      console.log(222)
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            console.log(44444)
            console.log(this.selectedFlatId)
            if (response !== null) {
              this.aboutHouse = this.fb.group({
                distance_metro:[response.flat.distance_metro],
                distance_stops:[response.flat.distance_stops],
                distance_shop:[response.flat.distance_shop],
                distance_green:[response.flat.distance_green],
                distance_parking:[response.flat.distance_parking],
                woman:[response.flat.woman],
                man:[response.flat.man],
                family:[response.flat.family],
                students:[response.flat.students],
                animals:[response.flat.animals],
                price_m:[response.flat.price_m],
                price_y:[response.flat.price_y],
                about:[response.flat.about],
                bunker:[response.flat.bunker],
              });
            }
          }, (error: any) => {
            console.error(error);
          });
      } else {
        console.log('user not found');
      }
      this.initializeForm();
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmitSaveAboutHouse(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/addres', { auth: JSON.parse(userJson), new: this.aboutHouse.value, flat_id: this.selectedFlatId })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  saveAboutHouse(): void {
    this.aboutHouse.disable();
    this.isDisabled = true;
    this.formDisabled = true;
    // відправляємо дані на сервер і зберігаємо їх

    // після успішного збереження змінюємо стан на редагування
    this.isDisabled = false;
    this.formDisabled = false;
  }

  editAboutHouse(): void {
    this.aboutHouse.enable();
    this.isDisabled = false;
    this.formDisabled = false;
  }

  resetAboutHouse() {
    this.aboutHouse.reset();
  }

  private initializeForm(): void {
    this.aboutHouse.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const addressHouse = this.aboutHouse;
    for (const field in addressHouse.controls) {
      const control = addressHouse.get(field);
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
