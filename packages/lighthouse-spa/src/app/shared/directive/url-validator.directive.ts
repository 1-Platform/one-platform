import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

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
        new URL(url);
        return null;
      } catch (e) {
        return { urlValidator: { valid: false } };
      }
    };
  }
}
