import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
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

  validate(c: FormControl) {
    return this.validator(c);
  }

  urlValidator(): ValidatorFn {
    return (control: FormControl) => {
      const url = control.value;
      try {
        if (yup.string().url().isValidSync(url) === true) {
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
