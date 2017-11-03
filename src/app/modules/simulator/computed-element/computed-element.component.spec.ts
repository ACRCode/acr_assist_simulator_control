import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedElementComponent } from './computed-element.component';

describe('ComputedElementComponent', () => {
  let component: ComputedElementComponent;
  let fixture: ComponentFixture<ComputedElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputedElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputedElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
