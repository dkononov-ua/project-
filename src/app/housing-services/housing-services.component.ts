import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-housing-services',
  templateUrl: './housing-services.component.html',
  styleUrls: ['./housing-services.component.scss']
})
export class HousingServicesComponent {

  constructor(private router: Router, private dataService: DataService) { }

  goToHostComun() {
    this.router.navigate(['/housing-services/host-comun']);
  }

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: any) => {
      console.log(data);
    });
  }
}
