import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-dropdown',
  templateUrl: './form-dropdown.component.html',
  styleUrls: ['./form-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FormDropdownComponent,
    },
  ],
})
export class FormDropdownComponent implements OnInit, ControlValueAccessor {
  @Input()
  value: string;

  @Input()
  options: { name: string, slug: string }[] = [];

  @Input()
  name: string;

  @Input()
  placeholder: string;

  @Input()
  required: boolean = false;

  @Input()
  hasError: boolean = false;

  @Input()
  icon: string = 'icon-trophy';

  onChange = (slug) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  get selectDisplay() {
    if (!this.value) {
      return this.placeholder;
    }
    const option = this.options.find(x => x.slug === this.value)
    return option ? option.name : this.placeholder;
  }

  get selectOptions() {
    return this.options.filter(x => x.slug !== this.value);
  }

  get hasValue() {
    return this.selectDisplay  !== this.placeholder;
  }

  constructor() {}

  writeValue(value: string): void {
    this.value = value;
    this.onChange(value);
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
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
