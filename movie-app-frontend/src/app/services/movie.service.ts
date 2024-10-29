import { Injectable } from '@angular/core';
import { InterceptorService } from './interceptor.service';
import { MovieResonse } from '../shared/movie.model';
import { Observable } from "rxjs";
import { MovieFormPayload } from '../shared/movie_form.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(
    private readonly _requestHelper: InterceptorService
  ) { }

  public getMovies(page: number, pagesize: number, ordering: string | undefined, search_text: string | undefined): Observable<MovieResonse> {

    let offset = page * pagesize;
    const params = new URLSearchParams()
    let url = `/movies?offset=${offset}`;

    if(ordering !== undefined)
      params.set('ordering', ordering);
    if(search_text !== undefined)
      params.set('search_text', search_text);

    url = `${url}&${params.toString()}`;
    return this._requestHelper.get(url);
  }

  public submitMovie(payload: MovieFormPayload): Observable<void> {
    return this._requestHelper.post('/movie', payload);
  }

  public getLikeColor(review: string | null){
    if(review=='L')
      return '#00d500';
    return 'grey';
  }

  public disableLikeButton(current_username: string | undefined, movie_username: string  | undefined, review: string | null){
    if(current_username===movie_username)
      return true;
    else if(review==='H')
      return true;
    return false;
  }

  public getHateColor(review: string | null){
    if(review==='H')
      return 'red'
    return 'grey';
  }

  public disableHateButton(current_username: string | undefined, movie_username: string  | undefined, review: string | null){
    if(current_username===movie_username)
      return true;
    else if(review==='L')
      return true;
    return false;  
  }

}
