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

  public getProfileMovies(username: string, page: number, pagesize: number, ordering: string | undefined): Observable<{movie_list:Movie[], count: number}> {
    let offset = page * pagesize;
    let url = `/profile/${username}/movies?offset=${offset}`;
    if(ordering !== undefined)
      url = `${url}&ordering=${ordering}`;
    return this._requestHelper.get(url);
  }

}
