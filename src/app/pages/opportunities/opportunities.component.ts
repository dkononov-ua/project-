import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss'],
  animations: [
    trigger('cardAnimation1', [
      transition('void => *', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1200ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition('* => void', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('1200ms ease-in-out', style({ transform: 'scale(0.5)', opacity: 0 }))
      ]),
    ]),
  ],
})

export class OpportunitiesComponent {
  constructor(private el: ElementRef) {}

  scrollToAnchor(anchor: string): void {
    const element = this.el.nativeElement.querySelector(`#${anchor}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }


}
