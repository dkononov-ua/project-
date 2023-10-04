import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
})

export class ChatHostComponent implements AfterViewInit {
  loading: boolean = true;

  isMenuOpen = false;
  isChatOpenStatus: boolean = true;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  goBack(): void {
    this.location.back();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private location: Location
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }
}
