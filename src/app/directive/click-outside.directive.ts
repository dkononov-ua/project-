import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement) {
    // console.log('Target element:', targetElement);
    // console.log('ElementRef:', this.elementRef.nativeElement);
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    // console.log('Clicked inside:', clickedInside);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

}
