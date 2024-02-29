import { Component, OnInit } from '@angular/core';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { animations } from '../../interface/animation';

@Component({
  selector: 'app-support-us',
  templateUrl: './support-us.component.html',
  styleUrls: ['./support-us.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.top1,
    animations.top2,
    animations.top3,
    animations.top4,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})
export class SupportUsComponent implements OnInit {
  path_logo = path_logo;

  constructor() { }

  ngOnInit() {
  }

}
