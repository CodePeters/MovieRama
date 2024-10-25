import { Injectable } from '@angular/core';
import { InterceptorService } from './interceptor.service';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(
    private readonly _requestHelper: InterceptorService
  ) { }

  public getSummary(movie: string): Observable<{response:string}> {
    const params = new URLSearchParams()
    params.set('movie', movie)
    let url = 'https://crimson-lab-b155-123abcd-24543eq3s-234awq2.georgepetrou08.workers.dev/';
    return this._requestHelper.get_with_provided_url(`${url}?${params.toString()}`);
  }

}
