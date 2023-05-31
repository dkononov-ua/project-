import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form: FormGroup;

  @ViewChild('textArea', { static: false })
  textArea!: ElementRef;

  houseAbout = {
    distance_metro: new FormControl({ value: null, disabled: true }),
    distance_stops: new FormControl({ value: null, disabled: true }),
    distance_shop: new FormControl({ value: null, disabled: true }),
    distance_green: new FormControl({ value: null, disabled: true }),
    distance_parking: new FormControl({ value: null, disabled: true }),
    woman: new FormControl({ value: null, disabled: true }),
    man: new FormControl({ value: null, disabled: true }),
    family: new FormControl({ value: null, disabled: true }),
    students: new FormControl({ value: null, disabled: true }),
    animals: new FormControl({ value: null, disabled: true }),
    price_m: new FormControl({ value: null, disabled: true }),
    price_y: new FormControl({ value: null, disabled: true }),
    about: new FormControl({ value: null, disabled: true }),
    bunker: new FormControl({ value: null, disabled: true }),
  };

  public selectedFlatId: any | null;

  formErrors: any = {
    distance_metro: '',
    distance_stop: '',
    distance_shop: '',
    distance_green: '',
    distance_parking: '',
    woman: '',
    man: '',
    family: '',
    students: '',
    animals: '',
    price_m: '',
    price_y: '',
    about: '',
    bunker: '',
  };

  validationMessages: any = {
    distance_metro: {
      required: 'Обов`язково',
    },
    distance_stop: {
      required: 'Обов`язково',
    },
    distance_shop: {
      required: 'Обов`язково',
    },
    distance_green: {
      required: 'Обов`язково',
    },
    distance_parking: {
      required: 'Обов`язково',
    },
    woman: {
      required: 'Обов`язково',
    },
    man: {
      required: 'Обов`язково',
    },
    family: {
      required: 'Обов`язково',
    },
    students: {
      required: 'Обов`язково',
    },
    animals: {
      required: 'Обов`язково',
    },
    price_m: {
      required: 'Обов`язково',
    },
    price_y: {
      required: 'Обов`язково',
    },
    about: {
      required: 'Обов`язково',
    },
    bunker: {
      required: 'Обов`язково',
    },
  };

  isDisabled: boolean | undefined;
  formDisabled: boolean | undefined;
  aboutHouse!: FormGroup<{ distance_metro: FormControl<any>; distance_stop: FormControl<any>; distance_shop: FormControl<any>; distance_green: FormControl<any>; distance_parking: FormControl<any>; woman: FormControl<any>; man: FormControl<any>; family: FormControl<any>; students: FormControl<any>; animals: FormControl<any>; price_m: FormControl<any>; price_y: FormControl<any>; about: FormControl<any>; bunker: FormControl<any>; }>;

  constructor(private fb: FormBuilder, private http: HttpClient, private hostComponent: HostComponent,) {
    this.form = this.fb.group({
      about: ['']
    });

    this.hostComponent.selectedFlatId$.subscribe((selectedFlatId) => {
      this.selectedFlatId = selectedFlatId;
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.http.post('http://localhost:3000/flatinfo/localflat', { auth: JSON.parse(userJson), flat_id: this.selectedFlatId })
          .subscribe((response: any) => {
            if (response !== null) {
              this.aboutHouse = this.fb.group({
                distance_metro: [response.about.distance_metro],
                distance_stop: [response.about.distance_stop],
                distance_shop: [response.about.distance_shop],
                distance_green: [response.about.distance_green],
                distance_parking: [response.about.distance_parking],
                woman: [response.about.woman],
                man: [response.about.man],
                family: [response.about.family],
                students: [response.about.students],
                animals: [response.about.animals],
                price_m: [response.about.price_m],
                price_y: [response.about.price_y],
                about: [response.about.about],
                bunker: [response.about.bunker],
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

  ngAfterViewInit() {
    this.textArea.nativeElement.style.height = 'auto';
    this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
  }

  onInput() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmitSaveAboutHouse(): void {
    console.log(this.aboutHouse.value)
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.http.post('http://localhost:3000/flatinfo/add/about', { auth: JSON.parse(userJson), flat: this.aboutHouse.value, flat_id: this.selectedFlatId })
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
    this.aboutHouse = this.fb.group({
      distance_metro: [null, [
        Validators.required,
      ]],
      distance_stop: [null, [
        Validators.required,
      ]],
      distance_shop: [null, [
        Validators.required,
      ]],
      distance_green: [null, [
        Validators.required,
      ]],
      distance_parking: [null, [
        Validators.required,
      ]],
      woman: [null, [
        Validators.required,
      ]],
      man: [null, [
        Validators.required,
      ]],
      family: [null, [
        Validators.required,
      ]],
      students: [null, [
        Validators.required,
      ]],
      animals: [null, [
        Validators.required,
      ]],
      price_m: [null, [
        Validators.required,
      ]],
      price_y: [null, [
        Validators.required,
      ]],
      about: [null, [
        Validators.required,
      ]],
      bunker: [null, [
        Validators.required,
      ]],
    });

    this.aboutHouse.valueChanges?.subscribe(() => this.onValueChanged());
  }

  private onValueChanged() {
    this.formErrors = {};

    const aboutHouse = this.aboutHouse;
    for (const field in aboutHouse.controls) {
      const control = aboutHouse.get(field);
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
