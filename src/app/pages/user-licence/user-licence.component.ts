import { Component } from '@angular/core';
import { animations } from '../../interface/animation';

@Component({
  selector: 'app-user-licence',
  templateUrl: './user-licence.component.html',
  styleUrls: ['./user-licence.component.scss'],
  animations: [
    animations.top1,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class UserLicenceComponent {

}
