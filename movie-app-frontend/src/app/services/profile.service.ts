import { Injectable } from '@angular/core';
import { InterceptorService } from './interceptor.service';
import { Observable } from "rxjs";
import { Movie } from '../shared/movie.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private readonly _requestHelper: InterceptorService
  ){}

  public getProfileMovies(username: string): Observable<{movie_list:Movie[]}> {
    return this._requestHelper.get(`/profile/${username}/movies`);
  }

}
