import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  ngOnInit(): void {
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
}




