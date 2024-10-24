import { Injectable } from '@angular/core';
import { InterceptorService } from './interceptor.service';
import { ReviewPayload } from '../shared/review_submit.model';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private readonly _requestHelper: InterceptorService
  ) { }

  public submitReview(payload: ReviewPayload): Observable<void> {
    return this._requestHelper.post(`/profile/movie/${payload.movie_id}/review`, payload);
  }

}
