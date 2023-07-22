import { Component } from '@angular/core';

@Component({
  selector: 'app-host-house',
  templateUrl: './host-house.component.html',
  styleUrls: ['./host-house.component.scss']
})
export class HostHouseComponent {

  isSearchTermCollapsed: boolean = false;

  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }
}
