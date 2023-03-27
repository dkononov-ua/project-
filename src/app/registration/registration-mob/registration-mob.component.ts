import { Component, Injectable, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ]
})

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://example.com/api';

  constructor(private http: HttpClient) { }

  saveData(data: any) {
    return this.http.post(`${this.apiUrl}/save`, data);
  }
}

@Component({
  selector: 'app-registration-mob',
  templateUrl: './registration-mob.component.html',
  styleUrls: ['./registration-mob.component.scss']
})
export class RegistrationMobComponent {
  formErrors: any = {
    password: '',
    email: '',
  };

  validationMessages: any = {
    password: {
      required: 'Пароль обов`язково',
      minlength: 'Мінімальна довжина 4 символів',
      maxlength: 'Максимальна довжина 15 символів'
    },
    email: {
      required: 'Пошта обов`язкова',
      pattern: 'Невірно вказаний пошта',
    },

  };

  userForm!: FormGroup
  dataService: any;
  userService: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm()

    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('login');
    const container = document.getElementById('container');

    registerButton?.addEventListener("click", () => {
      container?.classList.add("right-panel-active");
    });

    loginButton?.addEventListener("click", () => {
      container?.classList.remove("right-panel-active");
    });
  }

  onSubmit(): void {
    console.log('Form submitted');
    console.log(this.userForm.value);

    if (this.userService) {
      if (this.userForm.valid) {
        this.userService.saveData(this.userForm.value).subscribe(
          () => {
            console.log('Data saved successfully');
            // редірект на сторінку кабінету
            window.location.href = '/user-interaction';
          },
          (error: any) => console.error('Error saving data: ', error)
        );
      } else {
        alert('Форма містить помилки');
      }
    }
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(25)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})$/)]],
    });
  }

}





