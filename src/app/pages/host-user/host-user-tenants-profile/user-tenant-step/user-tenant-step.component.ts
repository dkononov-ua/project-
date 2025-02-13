import { Component, OnInit } from '@angular/core';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-user-tenant-step',
  templateUrl: './user-tenant-step.component.html',
  styleUrls: ['./../../../step.scss'],
  animations: [
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
    animations.top,
    animations.top1,
  ],
})
export class UserTenantStepComponent implements OnInit {
  authorization: boolean = false;

  constructor() { }

  ngOnInit() {
    this.checkUserAuthorization();

  }

  // Перевірка на авторизацію користувача
  async checkUserAuthorization() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }
}
