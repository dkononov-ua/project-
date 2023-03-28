import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidationService } from '../../validation.service';

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
    metro: new FormControl({ value: '', disabled: true }),
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

  constructor(private fb: FormBuilder, private http: HttpClient, private validationService: ValidationService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmitSaveHouseAboutData(): void {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.houseAbout })
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
