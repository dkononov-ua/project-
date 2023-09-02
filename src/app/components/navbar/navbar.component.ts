import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log(this.isMenuOpen)
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}
