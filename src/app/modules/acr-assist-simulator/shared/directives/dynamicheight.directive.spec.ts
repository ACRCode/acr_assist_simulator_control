import { DynamicHeightDirective } from './dynamicheight.directive';
import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('DynamicHeightDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestLayoutComponent, DynamicHeightDirective],
    });
  });

  it('Created the DynamicHeightDirective', () => {
    const directive = new DynamicHeightDirective(null);
    expect(directive).toBeTruthy();
  });

  it('DynamicHeightDirective applied to calculate the height of simulator div dynamically', () => {
    const fixture = createTestComponent('<div #simulatorResultsBlock><div acrDynamicHeightDirective [simulatorElement]="simulatorResultsBlock"></div></div>');
    expect(fixture).toBeDefined();
  });

  it('DynamicHeightDirective applied to calculate the height of carousal div dynamically', () => {
    const fixture = createTestComponent('<div #simulatorResultsBlock> <div acrDynamicHeightDirective [carouselElement]="simulatorResultsBlock"></div></div>');
    expect(fixture).toBeDefined();
  });
});

@Component({
  selector: 'acr-test-layout',
  template: `<span>PlaceHolder HTML to be Replaced</span>`
})

export class TestLayoutComponent implements OnInit {
  constructor() {   }
  ngOnInit() {   }
}

function createTestComponent(template: string): ComponentFixture<TestLayoutComponent> {
  return TestBed
    .overrideComponent(TestLayoutComponent, {set: {template: template}} )
    .createComponent(TestLayoutComponent);
}
