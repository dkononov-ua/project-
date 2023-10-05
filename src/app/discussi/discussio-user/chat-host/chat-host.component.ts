import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
})

export class ChatHostComponent implements AfterViewInit {
  loading: boolean = true;

  chatOpen: boolean = false;
  chatMenuOpen: boolean = true;

  openChat(): void {
    this.chatOpen = true;
    this.chatMenuOpen = false;
  }

  openMenuChat(): void {
    this.chatMenuOpen = true;
    this.chatOpen = false;
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
