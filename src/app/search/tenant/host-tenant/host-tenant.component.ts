import { Component } from '@angular/core';

@Component({
  selector: 'app-host-tenant',
  templateUrl: './host-tenant.component.html',
  styleUrls: ['./host-tenant.component.scss']
})
export class HostTenantComponent {
  isSearchTermCollapsed: boolean = false;

  toggleSearchTerm() {
    this.isSearchTermCollapsed = !this.isSearchTermCollapsed;
  }
}
