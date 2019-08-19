import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[acrIntegerMaxRestrict]'
})
export class IntegerMaxRestrictDirective {

//   private regex: RegExp = new RegExp(/^(?:[0-9]{0,3}(?:\.[0-9]{0,2})?)?$/);

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    const value: number = +next;
    // if (next && (next === '.' || value > 100.00 || !String(next).match(this.regex))) {
    //   event.preventDefault();
    // }
  }
}
