import { Injectable } from '@angular/core';
import { InterceptorService } from './interceptor.service';
import { Observable } from "rxjs";
import { User, CreateUserPayload, LoginUserPayload, } from '../shared/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly _requestHelper: InterceptorService
  ) { }

  public registerUser(payload: CreateUserPayload): Observable<void> {
    return this._requestHelper.post('/signup', payload);
  }

  public userLogin(payload: LoginUserPayload): Observable<User> {
    return this._requestHelper.post('/login', payload);
  }

  public getCurrentUser(): Observable<User> {
    return this._requestHelper.get('/user_details');
  }

}