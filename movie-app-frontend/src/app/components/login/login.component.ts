import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { LoginFormModel } from '../../shared/auth-form';
import { User } from '../../shared/user';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  matcher = new MyErrorStateMatcher();
  public mainForm: FormGroup<LoginFormModel>;

  constructor(
    private readonly _userService: UserService,
    private readonly _authenticationService: AuthService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.mainForm = this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
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

  public login(): void {
    const payload = {
        username: this.mainForm.value.username!,
        password: this.mainForm.value.password!
    };

    this._userService.userLogin(payload).subscribe({
      next: (response: User) => {
        // If successful, store the user and redirect to the previous page
        this._authenticationService.login(response);
        this.openSnackBar("Login Successful!")
        this._router.navigateByUrl(this._activatedRoute.snapshot.queryParams['returnUrl'] || '/');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }

    });
  }
}