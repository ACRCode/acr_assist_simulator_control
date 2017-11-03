import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpresssionBlockComponent } from './expresssion-block.component';

describe('ExpresssionBlockComponent', () => {
  let component: ExpresssionBlockComponent;
  let fixture: ComponentFixture<ExpresssionBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpresssionBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpresssionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
