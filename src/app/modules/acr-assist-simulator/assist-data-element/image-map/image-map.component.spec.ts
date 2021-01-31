import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageMapComponent } from './image-map.component';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';

describe('ImageMapComponent', () => {
  let component: ImageMapComponent;
  let fixture: ComponentFixture<ImageMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMapComponent);
    component = fixture.componentInstance;
    component.DataElement = new ChoiceDataElement();
    fixture.detectChanges();
  });

  it('Created the ImageMapComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Called displayValue(val) with empty value', () => {
    component.displayValue('');
    expect(component.SelectionValue).toEqual('Image Map Diagram');
  });

  it('Called displayValue(val) with valid value', () => {
    const value = 'test';
    component.displayValue('test');
    expect(component.SelectionValue).toEqual('Selected Value : ' + value);
  });

});
