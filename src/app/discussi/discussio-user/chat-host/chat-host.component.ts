import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
})

export class ChatHostComponent implements AfterViewInit {
  loading: boolean = true;

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
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

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }
}
