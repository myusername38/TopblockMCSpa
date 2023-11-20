import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-dual-selector',
  templateUrl: './form-dual-selector.component.html',
  styleUrls: ['./form-dual-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormDualSelectorComponent,
    },
  ],
})
export class FormDualSelectorComponent implements OnInit, ControlValueAccessor {
  @Input()
  value: boolean | null = null;

  @Input()
  falseLabel: string;

  @Input()
  trueLabel: string;

  @Input()
  fieldTitle: string;

  @Input()
  required: boolean = false;

  onChange = (quantity) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  constructor() {}

  ngOnInit(): void {}

  onFalse() {
    if (this.disabled) {
      return;
    }
    this.value = false;
    this.onChange(this.value);
  }

  onTrue() {
    if (this.disabled) {
      return;
    }
    this.value = true;
    this.onChange(this.value);
  }

  writeValue(value: boolean): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
