import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
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
