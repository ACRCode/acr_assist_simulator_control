import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMapComponent } from './image-map.component';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';

describe('ImageMapComponent', () => {
  let component: ImageMapComponent;
  let fixture: ComponentFixture<ImageMapComponent>;

  beforeEach(async(() => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
