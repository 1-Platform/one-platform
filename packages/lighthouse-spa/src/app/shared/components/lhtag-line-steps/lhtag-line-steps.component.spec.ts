import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LHTagLineStepsComponent } from './lhtag-line-steps.component';

describe('LHTagLineStepsComponent', () => {
  let component: LHTagLineStepsComponent;
  let fixture: ComponentFixture<LHTagLineStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LHTagLineStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LHTagLineStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
