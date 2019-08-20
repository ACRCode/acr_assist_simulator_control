import { Directive, Output, Input, HostListener } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';

@Directive({
  selector: '[acrClipboard]'
})
export class ClipboardDirective {

  @Input() clipboard: any;
  @Output() clipboardCopy: EventEmitter<string> = new EventEmitter<string>();
  @Output() clipboardError: EventEmitter<Error> = new EventEmitter<Error>();

  constructor(
    private clipboardService: ClipboardService) {
    this.clipboardService = clipboardService;
    this.clipboard = '';
  }

  @HostListener('click', ['$event.target'])
  copyToClipboard() {
    this.clipboardService
      .copy(this.clipboard)
      .then(
        (value: string): void => {
          this.clipboardCopy.emit(value);
        }
      )
      .catch(
        (error: Error): void => {
          this.clipboardError.emit(error);
        }
      );
  }
}
