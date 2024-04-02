import { Component, OnInit } from '@angular/core';
import { animations } from '../../../../interface/animation';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-resident-menu',
  templateUrl: './resident-menu.component.html',
  styleUrls: ['./resident-menu.component.scss'],
  animations: [
    animations.top1,
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class ResidentMenuComponent implements OnInit {
  isMobile = false;

  constructor(
    private sharedService: SharedService
     ) {
    this.sharedService.isMobile$.subscribe((status: boolean) => {
      this.isMobile = status;
      // isMobile: boolean = false;
    });
  }

  ngOnInit() {

  }

}
