import { Component } from '@angular/core';
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})

export class HostComponent {
  
  isMenuOpen = true;
  hideMenu = false;

  onToggleMenu() {
    if (this.isMenuOpen) {
      this.openMenu();
      setTimeout(() => {
        this.hideMenu = !this.hideMenu;
      }, 500);
    } else {
      this.hideMenu = !this.hideMenu;
      setTimeout(() => {
        this.openMenu();
      }, 100);
    }
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
