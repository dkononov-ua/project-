import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-chat-host',
  templateUrl: './chat-host.component.html',
  styleUrls: ['./chat-host.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('2000ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation2', [
      transition('void => *', [
        style({ transform: 'translateX(230%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation3', [
      transition('void => *', [
        style({ transform: 'translateY(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ]),
    trigger('cardAnimation4', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
    ]),
    trigger('cardAnimation5', [
      transition('void => *', [
        style({ transform: 'translateY(100%)' }),
        animate('1200ms 100ms ease-in-out', style({ transform: 'translateY(0)' }))
      ]),
    ])
  ],
})

export class ChatHostComponent implements AfterViewInit {
  loading: boolean = true;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);
  }
}
