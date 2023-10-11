import { Component } from '@angular/core';
@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
})

export class ChatHostComponent {
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
}
