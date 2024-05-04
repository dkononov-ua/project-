import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-licence',
  templateUrl: './user-licence.component.html',
  styleUrls: ['./user-licence.component.scss']
})



export class UserLicenceComponent {
  goBack(): void {
    this.location.back();
  }

  constructor(
    private location: Location,
    private sharedService: SharedService,
  ) {
  }

}
