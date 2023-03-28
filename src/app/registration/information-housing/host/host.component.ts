import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Injectable, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from '../../information-user/user.service';
import { ValidationService } from '../../validation.service';
import { trigger, animate, transition, style, query, group, animateChild } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
  ]
})

@Injectable({
  providedIn: 'root'
})

export class AppComponent implements OnInit {

  constructor(private userService: UserService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  onSubmit(email: string, password: string) {
    this.userService.getUserInfo(email, password).subscribe((response) => {
      console.log(response);
      // тут ви можете обробити відповідь сервера та відобразити її на сторінці
    });
  }
}

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
  template: '<app-address></app-address>',
})

export class HostComponent implements OnInit {

  public selectedFlatId$ = new BehaviorSubject<any>(undefined);

  houseCreate!: FormGroup;
  selectHouse!: FormGroup;
  errorMessage$ = new Subject<string>();
  houses: { id: number, name: string }[] = [];
  data = '';
  showInput = false;

  formErrors: any = {
    flat_id: '',
  };

  validationMessages: any = {
    flat_id: {
      required: 'houseId обов`язково',
      minlength: 'Мінімальна довжина 4 символи',
      maxlength: 'Максимальна довжина 20 символів',
    },
  };

  houseForm: FormGroup | undefined;
  addressHouse: FormGroup<{ flat_id: FormControl<any>; country: FormControl<any>; region: FormControl<any>; city: FormControl<any>; street: FormControl<any>; houseNumber: FormControl<any>; apartment: FormControl<any>; flat_index: FormControl<any>; private: FormControl<any>; rent: FormControl<any>; live: FormControl<any>; who_live: FormControl<any>; subscribers: FormControl<any>; }> | undefined;

  saveData() {
    if (this.data.trim()) {
      // зберігаємо дані
      this.showInput = false;
    }
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private validationService: ValidationService,
  ) {
  }

  ngOnInit(): void {

    this.selectHouse = new FormGroup({
      house: new FormControl()
    });
    console.log('Пройшла перевірка оселі')
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      // const user = JSON.parse(userJson)
      this.http.post('http://localhost:3000/flatinfo/localflatid', JSON.parse(userJson))
        .subscribe((response: any | undefined) => {
          this.houses = response.ids.map((item: { flat_id: any; }, index: number) => ({
            id: index + 1,
            name: item.flat_id
          }));

        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
    this.initializeForm();
  }

  onSubmitSaveHouseCreate(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/flat_id', { auth: JSON.parse(userJson), new: this.houseCreate.value })
        .subscribe((response: any) => {
          console.log(response);
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('house not found');
    }
  }

  onSubmitSelectHouse(): void {
    const selectedFlatId = this.selectHouse.get('house')?.value;
    console.log('Ви вибрали оселю з ID:', selectedFlatId);

    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: selectedFlatId })
        .subscribe((response: any) => { }, (error: any) => {
          console.error(error);
        });
      this.selectedFlatId$.next(selectedFlatId);
    } else {
      console.log('user not found');
    }
  }


  initializeForm(): void {
    this.houseCreate = this.fb.group({
      flat_id: [null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]]
    });

    this.houseCreate.valueChanges.subscribe((data) => {
      this.formErrors = this.validationService.validateForm(this.houseCreate, this.validationMessages, this.formErrors);
    });
  }
}
