import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-housing-services',
  templateUrl: './housing-services.component.html',
  styleUrls: ['./housing-services.component.scss']
})
export class HousingServicesComponent {

  constructor(private router: Router) { }

  goToHostComun() {
    this.router.navigate(['/housing-services/host-comun']);
  }
}
