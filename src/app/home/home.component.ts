import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  indexPage: number = 1;
  isAccountOpenStatus: boolean = true;
  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  constructor() { }

  ngOnInit() {
  }

}
