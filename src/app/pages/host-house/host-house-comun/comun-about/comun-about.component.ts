import { Component } from '@angular/core';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-comun-about',
  templateUrl: './comun-about.component.html',
  styleUrls: ['./../../../pages.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.bot,
  ],
})
export class ComunAboutComponent {
  constructor(
    private sharedService: SharedService,
  ) { }
}
