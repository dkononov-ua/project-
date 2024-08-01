import { Component, OnInit } from '@angular/core';
import { animations } from '../../../../interface/animation';

@Component({
  selector: 'app-user-tenant-step',
  templateUrl: './user-tenant-step.component.html',
  styleUrls: ['./user-tenant-step.component.scss'],
  animations: [
    animations.right,
    animations.right1,
    animations.right2,
    animations.right3,
    animations.right4,
    animations.swichCard,
  ],
})
export class UserTenantStepComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
