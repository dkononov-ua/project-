import { Component } from '@angular/core';
import { animations } from '../../interface/animation';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.top1,
    animations.right2,
    animations.swichCard,
  ],
})
export class NotFoundComponent {

}
