import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comun-page',
  templateUrl: './comun-page.component.html',
  styleUrls: ['./comun-page.component.scss']
})
export class ComunPageComponent {

  constructor(private router: Router) { }

  goToHostComun() {
    this.router.navigate(['/housing-services/host-comun']);
  }
}
