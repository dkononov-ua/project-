import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-comun',
  templateUrl: './about-comun.component.html',
  styleUrls: ['./about-comun.component.scss']
})
export class AboutComunComponent {

  constructor(private router: Router) { }

  goToHostComun() {
    this.router.navigate(['/housing-services/host-comun']);
  }
}
