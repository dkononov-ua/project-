import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ValidationService } from '../../validation.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-param',
  templateUrl: './param.component.html',
  styleUrls: ['./param.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(165%)' }),
        animate('2000ms 200ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition('* => void', [
        animate('1000ms ease-in-out', style({ transform: 'translateX(130%)' }))
      ])
    ])
  ],

})
export class ParamComponent {
  houseForm!: FormGroup;
  houseCreate!: FormGroup;
  selectHouse!: FormGroup;
  isDisabled = false;
  formDisabled = false;
  errorMessage$ = new Subject<string>();
  showInput = false;
  houses: { id: string, name: string }[] = [];
  data = '';
  formBuilder: any;
  showCardFlagHouseParam: boolean = true;
  showCardFlagHouseForm: boolean = true;
  showCardFlagHouseAbout: boolean = true;

  houseParam = {
    rooms: new FormControl({ value: '', disabled: true }),
    repair_status: new FormControl({ value: '', disabled: true }),
    area: new FormControl({ value: '', disabled: true }),
    kitchen_area: new FormControl({ value: '', disabled: true }),
    balcony: new FormControl({ value: '', disabled: true }),
    floor: new FormControl({ value: '', disabled: true }),
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private validationService: ValidationService) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    throw new Error('Method not implemented.');
  }

  onSubmitSaveHouseParamData(): void {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.houseParam })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
  }
}
