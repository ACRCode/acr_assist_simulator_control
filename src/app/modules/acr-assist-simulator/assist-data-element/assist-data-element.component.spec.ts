import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistDataElementComponent } from './assist-data-element.component';

describe('AssistDataElementComponent', () => {
  let component: AssistDataElementComponent;
  let fixture: ComponentFixture<AssistDataElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistDataElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistDataElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
