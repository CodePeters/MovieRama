import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormGroupDirective, NgForm, } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { MovieFormModel } from '../../shared/movie_form.model';
import { MovieService } from '../../services/movie.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-submit-movie',
  templateUrl: './submit-movie.component.html',
  styleUrl: './submit-movie.component.css'
})
export class SubmitMovieComponent {

  matcher = new MyErrorStateMatcher();
  public messageMaxLength = 4000;
  public mainForm: FormGroup<MovieFormModel>;
  
  constructor(
    private readonly _movieService: MovieService,
    private readonly _authenticationService: AuthService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.mainForm = this.formBuilder.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
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

  public submit(): void {
    const payload = {
      title: this.mainForm.value.title!,
      description: this.mainForm.value.description!,
    };

    this._movieService.submitMovie(payload).subscribe({
      next: (response: void) => {
        this.openSnackBar("Movie Submission successful!")
        this._router.navigateByUrl(this._activatedRoute.snapshot.queryParams['returnUrl'] || '/');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        // this.errors.set(err.error.errors);
      }
    });
  }

}