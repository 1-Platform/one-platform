import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { UrlValidatorDirective } from './url-validator.directive';

@Component({
  //The input on this form is required, so we can easily set the form validity by giving it an empty/non-empty string.
  template: `<form #form="ngForm">
    <input name="url" [(ngModel)]="url" type="text" required urlValidator />
    <button type="submit">Submit</button>
  </form>`,
})
class URLValidatorTestComponent {
  url: string;

  @ViewChild('form')
  ngForm: NgForm;
}

describe('UrlValidatorDirective', () => {
  let form: URLValidatorTestComponent;
  let fixture: ComponentFixture<URLValidatorTestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [UrlValidatorDirective, URLValidatorTestComponent],
      imports: [FormsModule],
    }).createComponent(URLValidatorTestComponent);
    form = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new UrlValidatorDirective();
    expect(directive).toBeTruthy();
  });

  it('should allow submission of a valid form', async () => {
    //arrange
    form.url = 'https://google.com'; //valid value
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const ctrl = form.ngForm.form.get('url');
      expect(ctrl.valid).toBeTruthy();
      //assert
    });
  });

  it('should prevent submission of an invalid form', async () => {
    //arrange
    form.url = ''; //invalid value
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const ctrl = form.ngForm.form.get('url');
      expect(ctrl.valid).toBeFalsy();
    });
  });
});
