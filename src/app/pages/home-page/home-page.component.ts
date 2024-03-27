import { Component, OnInit } from '@angular/core';
import { serverPath, path_logo } from 'src/app/config/server-config';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  path_logo = path_logo;

  constructor() { }

  ngOnInit() {
  }

}
