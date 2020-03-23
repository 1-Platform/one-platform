import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackHomeComponent } from './feedback-home.component';

describe('HomeComponent', () => {
  let component: FeedbackHomeComponent;
  let fixture: ComponentFixture<FeedbackHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
