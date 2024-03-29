import { Component, OnInit } from '@angular/core';
import { serverPath, path_logo } from 'src/app/config/server-config';
import { animations } from '../interface/animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.right1,
    animations.swichCard,
  ],
})
export class HomeComponent implements OnInit {
  loginCheck: boolean = false;
  authorization: boolean = false;
  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
  path_logo = path_logo;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor() { }

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.authorization = true;
    } else {
      this.authorization = false;
    }
  }

}
