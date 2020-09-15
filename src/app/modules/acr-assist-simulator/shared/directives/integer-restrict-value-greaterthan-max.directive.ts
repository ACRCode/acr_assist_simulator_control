import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[acrIntegerMaxRestrict]'
})
export class IntegerMaxRestrictDirective {

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    const value: number = +next;
  }
}
