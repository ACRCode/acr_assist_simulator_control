import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[acrNumericOnly]'
})
export class NumericOnlyDirective {

  private regex: RegExp = new RegExp(/^(?:[0-9]{0,3}(?:\.[0-9]{0,2})?)?$/);
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

    if (next && (next === '.' || value > 100.00 || !String(next).match(this.regex))) {
      event.preventDefault();
    }
  }
}

