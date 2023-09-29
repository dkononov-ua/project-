import { Component } from '@angular/core';
import { path_logo } from 'src/app/shared/server-config';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent {
  loading = true;
  path_logo = path_logo;

}
