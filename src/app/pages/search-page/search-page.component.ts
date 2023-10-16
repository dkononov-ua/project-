import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { path_logo } from 'src/app/shared/server-config';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2500ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2000ms 400ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('3000ms 600ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2500ms 500ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),

  ],
})

export class SearchPageComponent {
  path_logo = path_logo;

  constructor(private router: Router) { }

  goToSearchHouse() {
    this.router.navigate(['/search/house/']);
  }

  goToSearchTenant() {
    this.router.navigate(['/search/tenants/']);
  }
}
