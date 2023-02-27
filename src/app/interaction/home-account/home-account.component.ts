import { Component } from '@angular/core';

@Component({
  selector: 'app-home-account',
  templateUrl: './home-account.component.html',
  styleUrls: ['./home-account.component.scss']
})
export class HomeAccountComponent {
  notificationsCount: number = 1;
  showNotifications: boolean = false;

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
