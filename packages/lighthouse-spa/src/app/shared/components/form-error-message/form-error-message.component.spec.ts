import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { FormErrorMessageComponent } from './form-error-message.component';

describe('FormErrorMessageComponent', () => {
  let component: FormErrorMessageComponent;
  let fixture: ComponentFixture<FormErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [FormErrorMessageComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorMessageComponent);
    component = fixture.componentInstance;
    const form = new UntypedFormGroup({
      username: new UntypedFormControl(''),
    });
    component.control = form.controls['username'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
