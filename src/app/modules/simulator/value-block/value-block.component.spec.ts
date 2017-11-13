import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueBlockComponent } from './value-block.component';

describe('ValueBlockComponent', () => {
  let component: ValueBlockComponent;
  let fixture: ComponentFixture<ValueBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
