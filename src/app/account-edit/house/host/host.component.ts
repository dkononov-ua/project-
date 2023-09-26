import { Component, ElementRef, HostListener } from '@angular/core';
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
    setTimeout(() => {
      this.hideMenu = true;
    }, 500);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const containerElement = this.el.nativeElement.querySelector('.container-card');
    const cardBoxElement = this.el.nativeElement.querySelector('.card-box');

    if (containerElement.contains(event.target as Node)) {
      if (!cardBoxElement.contains(event.target as Node)) {
        this.closeMenu();
      }
    }
  }

  constructor(
    private el: ElementRef,
  ) { }
}
