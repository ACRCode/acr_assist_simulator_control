import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[acrNumericOnly]'
})
export class NumericOnlyDirective {

  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // debugger;
    // // Allow Backspace, tab, end, and home keys
    // if (this.specialKeys.indexOf(event.key) !== -1) {
    //   return;
    // }
    // let current: string = this.el.nativeElement.value;
    // let next: string = current.concat(event.key);
    // let value: number = +next;
    // if (next && (next === '.' || value > 100.00 || !String(next).match(this.regex))) {
    //   event.preventDefault();
    // }

    if (this.specialKeys.indexOf(event.key) !== -1 ||
      // to allow backspace, enter, escape, arrows  
      (event.which == 65 && event.ctrlKey == true) ||
      // Allow: Ctrl+C        
      (event.which == 67 && event.ctrlKey == true) ||
      // Allow: Ctrl+X
      (event.which == 88 && event.ctrlKey == true)
    ) {
      return;
    }
    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
