import { Directive, Input, ElementRef, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[acrDynamicHeightDirective]'
})
export class DynamicHeightDirective implements AfterViewChecked  {

  @Input() simulatorElement: any;
  @Input() carouselElement: any;

  constructor(private dynamicElement: ElementRef) { }

  ngAfterViewChecked() {
    if (this.dynamicElement !== undefined) {
      if (this.simulatorElement !== undefined) {
        this.setDynamicHeightForSimualtorDiv(this.simulatorElement);
      } else if (this.carouselElement !== undefined) {
        this.setDynamicHeightForCarouselDiv(this.carouselElement);
      }
    }
  }

  private setDynamicHeightForSimualtorDiv(simulatorElement: any) {
    const simulatorResultsBlockHeight = simulatorElement.offsetHeight;
    this.dynamicElement.nativeElement.style.height = (window.innerHeight - 100) - simulatorResultsBlockHeight + 'px';
  }

  private setDynamicHeightForCarouselDiv(carouselElement: any) {
    const simulatorResultsBlockHeight = carouselElement.offsetHeight;
    this.dynamicElement.nativeElement.style.height = (window.innerHeight - 200) - simulatorResultsBlockHeight + 'px';
  }
}
