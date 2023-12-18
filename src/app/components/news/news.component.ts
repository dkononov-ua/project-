import { Component } from '@angular/core';
import { serverPath, path_logo } from 'src/app/config/server-config';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})


export class NewsComponent {
  path_logo = path_logo;


}
