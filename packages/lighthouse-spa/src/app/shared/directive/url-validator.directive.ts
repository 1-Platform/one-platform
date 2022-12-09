import { Directive } from '@angular/core';
import { UntypedFormControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import * as yup from 'yup';

@Directive({
  selector: '[urlValidator][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true },
  ],
})
export class UrlValidatorDirective {
  validator: ValidatorFn;
  constructor() {
    this.validator = this.urlValidator();
  }

  validate(c: UntypedFormControl) {
    return this.validator(c);
  }

  urlValidator(): ValidatorFn {
    return (control: UntypedFormControl) => {
      const url = control.value;
      try {
        if (yup.string().url().isValidSync(url)) {
          return null;
        } else {
          throw new Error('Invalid URL');
        }
      } catch (e) {
        return { urlValidator: { valid: false } };
      }
    };
  }
}
