import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutoResizeTextarea]'
})
export class AutoResizeTextareaDirective implements AfterViewInit {

  constructor(private textArea: ElementRef) {}

  ngAfterViewInit() {
    this.resize();
  }

  @HostListener('input')
  onInput() {
    this.resize();
  }

  private resize() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
