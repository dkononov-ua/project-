import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginCheck: boolean = false;
  authorization: boolean = false;
  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
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
