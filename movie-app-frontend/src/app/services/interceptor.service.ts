import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environment/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly _authService: AuthService
  ) { }

  public get(url: string, queryOptions: any = {}): Observable<any> {
    const options = {
      ...queryOptions,
      headers: this._constructRequestHeaders()
    }

    return this._httpClient.get(this._decorateUrl(url), options);
  }

  public post(url: string, body: any): Observable<any> {
    return this._httpClient.post(this._decorateUrl(url), body, {headers: this._constructRequestHeaders()});
  }


  private _decorateUrl(url: string): string {
    return `${environment.apiUrl}${url}`;
  }



  private _constructRequestHeaders(): HttpHeaders {
    let headerDict: Record<string, string>= {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET, PUT, POST",
      // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    }

    if (this._authService.currentUserToken()==='') return new HttpHeaders();

    headerDict['Authorization'] = `Token ${this._authService.currentUserToken()}`

    return new HttpHeaders({
      Authorization: `Token ${this._authService.currentUserToken()}`
    });
  }
}
