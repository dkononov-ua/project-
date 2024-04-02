import { Component } from '@angular/core';
import { animations } from '../../interface/animation';

@Component({
  selector: 'app-comun-about',
  templateUrl: './comun-about.component.html',
  styleUrls: ['./comun-about.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
  ],
})
export class ComunAboutComponent {

}
