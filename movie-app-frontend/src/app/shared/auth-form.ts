import { FormControl } from "@angular/forms";

export interface LoginFormModel {
  username: FormControl<string>;
  password: FormControl<string> ;
}

export interface RegisterFormModel {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}