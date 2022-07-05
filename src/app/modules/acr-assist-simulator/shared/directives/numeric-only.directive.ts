import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[acrNumericOnly]'
})
export class NumericOnlyDirective {

  @Input('max') max: any;
  @Input('min') min: any;
  @Input('step') step = '1';
  private selected = false;
  private selectedIncludesDot = false;
  constructor(public _el: ElementRef, private control: NgControl) {}

  @HostListener('blur', ['$event'])
  blur(e: any) {
    if (!isNaN(Number.parseFloat(e.target.value))) {
      this.control.control.setValue(Number.parseFloat(e.target.value));
    } else {
      this.control.control.setValue(null);
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: any) {
    // increase value on Arrow Up
    if (e.keyCode === 38) {
      if (!this.step.includes('.')) {
        this.control.control.setValue(
          Math.floor(Number.parseFloat(e.target.value)) + 1
        );
      }
    }

    // decrease value on Arrow down
    if (e.keyCode === 40 && Number.parseFloat(e.target.value) > 0) {
      if (!this.step.includes('.')) {
        this.control.control.setValue(
          Math.floor(Number.parseFloat(e.target.value)) - 1
        );
      }
    }

    // Allow 2 chars after dot '.'
    // TODO: ensure that the third digit cannot even be typed...
    if (e.target.value.includes('.')) {
      const arr = e.target.value.split('.');
      if (arr[1] && arr[1].length > 2) {
        this.control.control.setValue(Math.trunc(e.target.value * 100) / 100);
      }
    }
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(e: any) {
    //console.log(e.target.selectionStart)
    const selectedString = e.target.value.substr(
      e.target.selectionStart,
      e.target.selectionEnd - e.target.selectionStart
    );

    if (selectedString) {
      this.selected = true;
      this.selectedIncludesDot = selectedString.includes('.');
    } else {
      this.selected = false;
    }

    // Allow only single dot '.'
    if (
      e.target.value.includes('.') &&
      e.keyCode === 190 &&
      !(this.selected && this.selectedIncludesDot)
    ) {
      e.preventDefault();
    }

    if (e.target.value.includes('.')) {
      const split_value = e.target.value.split('.');
      if (split_value[1].length>=2){
        e.preventDefault();
      }
    }

    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.keyCode === 67 && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.keyCode === 86 && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.keyCode === 88 && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.keyCode === 65 && e.metaKey === true) || // Cmd+A (Mac)
      (e.keyCode === 67 && e.metaKey === true) || // Cmd+C (Mac)
      (e.keyCode === 86 && e.metaKey === true) || // Cmd+V (Mac)
      (e.keyCode === 88 && e.metaKey === true) || // Cmd+X (Mac)
      (e.keyCode >= 35 && e.keyCode <= 40) // Home, End, Left, Right
    ) {
      return; // let it happen, don't do anything
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105) &&
      e.keyCode !== 190
    ) {
      e.preventDefault();
    }
  }
}

