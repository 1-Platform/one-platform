import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackItemComponent } from './feedback-item.component';

describe('FeedbackItemComponent', () => {
  let component: FeedbackItemComponent;
  let fixture: ComponentFixture<FeedbackItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
