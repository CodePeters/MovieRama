import { Component} from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { User } from '../../shared/user';
import { ProfileService } from '../../services/profile.service';
import { Movie } from '../../shared/movie.model';
import { ReviewService } from '../../services/review.service';
import { ReviewPayload } from '../../shared/review_submit.model';
import { MovieService } from '../../services/movie.service';
import { Sort} from '@angular/material/sort';
import { Observable } from "rxjs";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  public username: string|undefined;
  public movie_list :Movie[] = [];
  // public currentUser$: Observable<User | null>;
  public userobj: User|null;
  public currentUser$: Observable<User | null>;

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _authenticationService: AuthService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _reviewService: ReviewService,
    private readonly _movieService: MovieService
  ){
    this.username = _activatedRoute.snapshot.paramMap.get('username') || '' ;
    this.getProfileMovies();

    this._activatedRoute.params.subscribe(params => {
      this.username = _activatedRoute.snapshot.paramMap.get('username') || ''
      this.getProfileMovies();
    })

    this.userobj=this._authenticationService.currentUserObject();
    this.currentUser$ = this._authenticationService.currentUser$;
    this._subscribeToUserChanges();
    console.log( this.userobj);
  }




private _subscribeToUserChanges(): void {
  this.currentUser$.subscribe((user: User | null) => this.userobj = user)
}
  

  public is_authenticated(){
    if(this._authenticationService.currentUserToken())
      return true;
    this._router.navigate(['login']);
    return false;
  }


  public getProfileMovies(): void {

    this._profileService.getProfileMovies(this.username || '').subscribe({
      next: (response: {movie_list:Movie[]} ) => {
        // console.log(response)
        this.movie_list = response.movie_list;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  changeSelected(i:number, b: boolean) {
    this.movie_list[i].selected = b;
  }

  sortData(sort: Sort) {
    const data = this.movie_list.slice();
    if (!sort.active || sort.direction === '') {
      this.movie_list = data;
      return;
    }

    this.movie_list = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'likes':
          return this.compare(a.likes, b.likes, isAsc);
        case 'hates':
          return this.compare(a.hates, b.hates, isAsc);
        default:
          return 0;
      }
    });
  }

  public compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

 

  public like(movie: Movie){
    let payload: ReviewPayload ={movie_id: movie.id, action: 'Like' };
    if(movie.review==='L'){
      payload = {movie_id: movie.id, action:'UnLike' }
    }
    this._reviewService.submitReview(payload).subscribe({  
      next: (response ) => {
        if(movie.review==='L'){
          movie.likes -= 1;
          movie.review = null;
          return
        }
        movie.likes += 1;
        movie.review = 'L';
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  public hate(movie: Movie){
    let payload: ReviewPayload ={movie_id: movie.id, action: 'Hate' };
    if(movie.review==='H'){
      payload = {movie_id: movie.id, action:'UnHate' }
    }
    this._reviewService.submitReview(payload).subscribe({  
      next: (response ) => {
        if(movie.review==='H'){
          movie.hates -= 1;
          movie.review = null;
          return
        }
        movie.hates += 1;
        movie.review = 'H';
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  public getLikeColor(review: string | null){
    return this._movieService.getLikeColor(review)
  }

  public getHateColor(review: string | null ){
    return this._movieService.getHateColor(review)
  }

  public disableLikeButton(movie_username:  string | undefined, review: string | null){
    let current_user = this._authenticationService.currentUserObject()?.user.username;
    return this._movieService.disableLikeButton(current_user, movie_username, review)
  }

  public disableHateButton(movie_username: string | undefined, review: string | null){
    let current_user = this._authenticationService.currentUserObject()?.user.username;
    return this._movieService.disableHateButton(current_user, movie_username, review)
  }

}
