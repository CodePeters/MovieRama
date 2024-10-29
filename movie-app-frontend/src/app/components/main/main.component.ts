import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router';
import { Movie, MovieResonse } from '../../shared/movie.model';
import { Sort, MatSort, MatSortable} from '@angular/material/sort';
import { MovieService } from '../../services/movie.service';
import { HttpErrorResponse } from "@angular/common/http";
import { ReviewService } from '../../services/review.service';
import { ReviewPayload } from '../../shared/review_submit.model';
import { AiService } from '../../services/ai.service';
import { inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
  imports: [MatIconModule, MatProgressSpinnerModule, NgbTooltipModule],
	standalone: true,
	template: `
		<div class="modal-header" style="background-color: rgb(39, 39, 39); color: white;">
			<h4 class="modal-title">AI Movie Summary</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body"  style="background-color: rgb(39, 39, 39); color: white;">
			<p>{{ summary }}</p>
		</div>
		<div class="modal-footer"  style="background-color: rgb(24, 24, 24); color: white;">
      <button type="button" class="btn btn-outline-danger d-flex align-items-center justify-content-center" 
      ngbTooltip="This will invalidate the cached descitpion and will request the AI model to produce another different response. New rsponse will be cahed till invalidated again."
      (click)="regenerate()">
        @if(passedMovie?.loading){
          <mat-spinner class="mx-1" diameter="20"></mat-spinner>
        }@else{
          <mat-icon>
            autorenew
          </mat-icon>
        }
        Renew
      </button>
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);

	@Input() summary: string='';
  @Input() passedMovie: Movie | undefined = undefined;

  constructor(
    private readonly _aiService: AiService,
  ) {}

  regenerate() {
    if(this.passedMovie===undefined) return;
    this.passedMovie.loading=true;
    this._aiService.getSummary(this.passedMovie.title, true).subscribe({  
      next: (response ) => {
        this.summary = response.response;
        if(this.passedMovie!==undefined)
          this.passedMovie.loading=false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });

	}
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  public movie_list: Movie[] = []
  public page = 1;
  public pageSize = 10;
  public totalMovies = 0;
  public totalPages = 0;
  public loading: boolean = true;
  public search_text: string | undefined = undefined;

  public resetText(){
    this.search_text = undefined;
    this.loadMovies();
  }

  @ViewChild(MatSort, {static:false}) sort!: MatSort;

  ngAfterViewInit(){
    console.log(this.sort);
    this.sort.sort(({ id: 'date', start: 'asc'}) as MatSortable);

  }

  constructor(
    private readonly _authenticationService: AuthService,
    private readonly _movieService: MovieService,
    private readonly _reviewService: ReviewService,
    private readonly _aiService: AiService,
    private router: Router,

  ) {
    this.loadMovies();
  }

  public get_profile_link(profile_id: string | undefined){
    if(profile_id===undefined) return;
    this.router.navigateByUrl(`/profile/${profile_id}`);
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

  selectPage(page: string) {
		this.page = parseInt(page, 10) || 1;
    if(this.page > this.totalPages) this.page = this.totalPages;
    this.loadMovies();
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
    this.loadMovies();
  }

  public loadMovies(): void {
    this.loading =true;
    this._movieService.getMovies(this.page-1, this.pageSize, this.ordering, this.search_text).subscribe({
      next: (response: MovieResonse ) => {
        this.movie_list = response.movie_list
        this.totalMovies = response.count;
        this.totalPages = Math.ceil(this.totalMovies / this.pageSize);
        this.loading = false;
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

  private modalService = inject(NgbModal);
  // public loading = false;
	open(movie: Movie) {
    movie.loading=true;
    this._aiService.getSummary(movie.title).subscribe({  
      next: (response ) => {
        movie.loading=false;
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.summary = response.response;
        modalRef.componentInstance.passedMovie = movie;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });

	}

}
