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

  constructor() { }

  ngOnInit() {
  }

}
