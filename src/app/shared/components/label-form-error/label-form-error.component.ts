import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'label-form-error',
  imports: [],
  templateUrl: './label-form-error.component.html',
})
export class LabelFormErrorComponent {

  control = input.required<AbstractControl>();

  get message() {

    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
    ? FormUtils.getTextError(errors)
    : null;

  }

}
