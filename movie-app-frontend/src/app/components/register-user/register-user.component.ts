import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition,} from '@angular/material/snack-bar';
import { RegisterFormModel } from '../../shared/auth-form';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {

  matcher = new MyErrorStateMatcher();
  public mainForm: FormGroup<RegisterFormModel>;
  
  constructor(
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.mainForm = this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  openSnackBar(msg: string) {
    this._snackBar.open(msg, undefined, {
      // this._snackBar.open(msg, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
    });
  }

  public register(): void {
    const payload = {
        username: this.mainForm.value.username!,
        password: this.mainForm.value.password!,
        email: this.mainForm.value.email!
    };

    this._userService.registerUser(payload).subscribe({
      next: (response: void) => {
        // If successful, store the user and redirect to the previous page
        this.openSnackBar("Registration Successful!, Redirecting to login..")
        this._router.navigateByUrl(this._activatedRoute.snapshot.queryParams['returnUrl'] || '/login');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

}