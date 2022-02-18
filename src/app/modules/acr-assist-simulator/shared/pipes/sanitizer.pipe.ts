import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'SanitizerPipe'
})
export class SanitizerPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): string {
      if(!url) return null;
      return this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl(url));

  }

}
