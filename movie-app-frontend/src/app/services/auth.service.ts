import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { User } from '../shared/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUserObject : User | null =null;
  public currentUserObject(): User | null {
    return this._currentUserObject;
  }

  private _currentUser$ = new BehaviorSubject<User | null>(null);

  private _currentToken$ = new BehaviorSubject<string | null>(null);

  constructor() { 
    this._currentToken$.next(localStorage.getItem('token') || null);
  }

  public get currentUser$(): Observable<User | null> {
    return this._currentUser$.asObservable();
  }

  public get currentToken$(): Observable<string | null> {
    return this._currentToken$.asObservable();
  }

  public currentUserToken(): string {
    return localStorage.getItem('token') || '';
  }

  public login(user: User) {
    localStorage.setItem('token', user.token);
    this._currentUser$.next(user);
    this._currentToken$.next(user.token);
    this. _currentUserObject = user;
  }

  public logout() {
    localStorage.removeItem('token');
    this._currentUser$.next(null);
    this._currentToken$.next(null);
  }

}