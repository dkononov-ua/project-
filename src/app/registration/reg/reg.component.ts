import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    // Перевірка валідності форми
    if (this.registrationForm.invalid) {
      return;
    }

    // Перенаправлення на сторінку користувача при введенні правильного логіну та паролю
    if (this.registrationForm.controls['username'].value === 'admin' &&
        this.registrationForm.controls['password'].value === 'password') {
      this.router.navigate(['/user-info']);
    } else {
      alert('Невірний логін або пароль');
    }
  }
}
