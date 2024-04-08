import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

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
    trigger('scrollAnimation', [
      state('up', style({ transform: 'translateY(0)' })),
      state('down', style({ transform: 'translateY(-100%)' })),
      transition('up <=> down', animate(300)),
    ]),
  ],
})

export class OpportunitiesComponent {
  indexPage: number = 0;
  togglePageNext() {
    if (this.indexPage !== 8) {
      this.indexPage++;
      this.scrollToAnchor('top');
    }
  }

  togglePagePrev() {
    if (this.indexPage !== 0) {
      this.indexPage--;
      this.scrollToAnchor('top');
    }
  }

  constructor(
    private el: ElementRef,
    private sharedService: SharedService,
  ) { }

  scrollToAnchor(anchor: string): void {
    const element = this.el.nativeElement.querySelector(`#${anchor}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}


