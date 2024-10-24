import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router';
import { Movie, MovieResonse } from '../../shared/movie.model';
import { MatChipSelectionChange} from '@angular/material/chips';
import { Sort} from '@angular/material/sort';
import { MovieService } from '../../services/movie.service';
import { HttpErrorResponse } from "@angular/common/http";
import { ReviewService } from '../../services/review.service';
import { ReviewPayload } from '../../shared/review_submit.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  public movie_list: Movie[] = []

  constructor(
    private readonly _authenticationService: AuthService,
    private readonly _movieService: MovieService,
    private readonly _reviewService: ReviewService,
    private router:Router,
  ) {
    this.loadMovies();
  }

  public is_authenticated(){
    if(this._authenticationService.currentUserToken())
      return true;
    this.router.navigate(['login']);
    return false;
  }

  public getUser() {
    return this._authenticationService.currentUserObject()?.user.username;
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

  public loadMovies(): void {
    this._movieService.getMovies().subscribe({
      next: (response: MovieResonse ) => {
        this.movie_list = response.movie_list
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
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