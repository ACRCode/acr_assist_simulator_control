import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedElementComponent } from './computed-element.component';
import { ValueBlockComponent } from '../value-block/value-block.component';
import { StringUtilityService } from '../shared/services/string-utility.service';

describe('ComputedElementComponent', () => {
  let component: ComputedElementComponent;
  let fixture: ComponentFixture<ComputedElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputedElementComponent , ValueBlockComponent ],
      providers : [StringUtilityService]
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
