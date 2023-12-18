import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comun-page',
  templateUrl: './comun-page.component.html',
  styleUrls: ['./comun-page.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(300%)' }),
        animate('2500ms 0ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
  ],
})
export class ComunPageComponent {

  constructor(private router: Router) { }

  goToHostComun() {
    this.router.navigate(['/housing-services/host-comun']);
  }
}
