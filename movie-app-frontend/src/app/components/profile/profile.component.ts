import { Component, ViewChild} from '@angular/core';
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
import { Sort, MatSort, MatSortable} from '@angular/material/sort';
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
  public page = 1;
  public pageSize = 10;
  public totalMovies = 0;
  public totalPages = 0;

  @ViewChild(MatSort, {static:false}) sort!: MatSort;

  ngAfterViewInit(){
    console.log(this.sort);
    this.sort.sort(({ id: 'date', start: 'asc'}) as MatSortable);

  }

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _authenticationService: AuthService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _reviewService: ReviewService,
    private readonly _movieService: MovieService,
    private router: Router,

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

  public getUser() {
    return this._authenticationService.currentUserObject()?.user.username;
  }

  selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
    if(this.page > this.totalPages) this.page = this.totalPages;
    this.getProfileMovies();
	}

	formatInput(input: HTMLInputElement) {
    const FILTER_PAG_REGEX = /[^0-9]/g;
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

  public ordering: string | undefined = 'date';

  sortData(sort: Sort) {
    const data = this.movie_list.slice();
    if (!sort.active || sort.direction === '') {
      this.movie_list = data;
      this.ordering = undefined;
      return;
    }


    switch (sort.active) {
      case 'likes':
        console.log('here')
        this.ordering = 'likes';
        break;
      case 'hates':
        this.ordering = 'hates';
        break;
      case 'date':
        this.ordering = 'date';
        break;
      default:
        this.ordering = undefined;
    }
    if(sort.direction !== 'asc')
      this.ordering = `-${this.ordering}`;
    this.page = 1;
    this.getProfileMovies();
  }

  public getProfileMovies(): void {

    this._profileService.getProfileMovies(this.username || '', this.page-1, this.pageSize, this.ordering).subscribe({
      next: (response: {movie_list:Movie[], count: number} ) => {
        // console.log(response)
        this.movie_list = response.movie_list
        this.totalMovies = response.count;
        this.totalPages = Math.ceil(this.totalMovies / this.pageSize);
        this.movie_list = response.movie_list;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  public get_profile_link(profile_id: string | undefined){
    if(profile_id===undefined) return;
    this.router.navigateByUrl(`/profile/${profile_id}`);
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
