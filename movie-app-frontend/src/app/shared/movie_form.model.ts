import { FormControl } from "@angular/forms";

export interface MovieFormModel {
    title: FormControl<string>;
    description: FormControl<string> ;
}

export interface MovieFormPayload {
    title: string;
    description: string;
}