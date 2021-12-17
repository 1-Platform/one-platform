import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { FormErrorMessageComponent } from './form-error-message.component';

describe('FormErrorMessageComponent', () => {
  let component: FormErrorMessageComponent;
  let fixture: ComponentFixture<FormErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormErrorMessageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorMessageComponent);
    component = fixture.componentInstance;
    const form = new FormGroup({
      username: new FormControl(''),
    });
    component.control = form.controls['username'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
