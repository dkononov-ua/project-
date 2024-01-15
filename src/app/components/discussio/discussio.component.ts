import { Component, OnInit } from '@angular/core';
import { serverPath, path_logo } from 'src/app/config/server-config';

@Component({
  selector: 'app-discussio',
  templateUrl: './discussio.component.html',
  styleUrls: ['./discussio.component.scss']
})
export class DiscussioComponent implements OnInit {

  path_logo = path_logo;


  constructor() { }

  ngOnInit() {
  }

}
