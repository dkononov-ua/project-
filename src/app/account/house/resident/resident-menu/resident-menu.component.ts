import { Component, OnInit } from '@angular/core';
import { animations } from '../../../../interface/animation';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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

  constructor(private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    // перевірка який пристрій
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

}
