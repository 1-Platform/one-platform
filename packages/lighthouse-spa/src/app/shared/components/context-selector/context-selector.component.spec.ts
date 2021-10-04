import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextSelectorComponent } from './context-selector.component';

describe('ContextSelectorComponent', () => {
  let component: ContextSelectorComponent;
  let fixture: ComponentFixture<ContextSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContextSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
