import { Directive, Output, Input, HostListener } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';

@Directive({
  selector: '[acrClipboard]'
})
export class ClipboardDirective {

  @Input() clipboard: any;
  @Output() clipboardCopy: EventEmitter<string>;
  @Output() clipboardError: EventEmitter<Error>;

  private clipboardService: ClipboardService;

  constructor(clipboardService: ClipboardService) {
    this.clipboardService = clipboardService;
    this.clipboardCopy = new EventEmitter();
    this.clipboardError = new EventEmitter();
    this.clipboard = '';
  }

  @HostListener('keydown', ['$event'])
  copyToClipboard(event: MouseEvent) {
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
