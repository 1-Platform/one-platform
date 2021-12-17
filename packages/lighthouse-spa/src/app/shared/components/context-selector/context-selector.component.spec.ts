import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('default values for context select', () => {
    expect(component.isOpen).toBeFalsy();
    expect(component.searchInputValue).toBe('');
    expect(component.toggleText).toBe('');
  });

  it('should be hidden', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const el = fixture.debugElement.query(
        By.css('.pf-c-context-selector__menu')
      );
      expect(el).toBeNull();
    });
  });

  it('should reveal options', fakeAsync(() => {
    component.isOpen = true;
    tick();
    fixture.detectChanges();
    expect(component.isOpen).toBeTruthy();
    const el = fixture.debugElement.query(
      By.css('.pf-c-context-selector__menu')
    );
    expect(el).toBeTruthy();
  }));
});
