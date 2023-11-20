import { ButtonType } from "src/app/enums/button-type.enum";

export enum AddFormItem {
  text = "text",
  textArea = "text-area",
  services = "services",
  boolean = "boolean",
  select = "select",
  checkbox = "checkbox",
  email = "email",
  date = "date",
  number = "number",
  password = "password",
  row = "",
}

export enum DialogType {
  form = "form",  
  confirmation = "confirmation",
}

export interface FormRow {
  items: FormItem[];
  remainingWidth: number;
}

export interface FormItem {
  slug: string;
  name: string;
  width?: number;
  required: boolean;
  type: AddFormItem;
  placeholder?: string;
  icon?: string;
  focused?: boolean;
  selectItems?: { slug: string; name: string }[];
  trueLabel?: string;
  falseLabel?: string;
  currentValue?: any;
  regex?: string;
}

export interface DialogFormData extends DialogData {
  formItems: FormItem[];
  submitText: string;
}

export interface DialogConfirmData extends DialogData {
  cancelText: string;
  successText: string;
  successButtonType: ButtonType;
}

export interface DialogData {
  title: string;
  subtitle: string;
  type?: DialogType;
  callback: Function;
}
