import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { User } from '../../shared/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import {trigger, style, animate, transition }from '@angular/animations';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('flyInOut', [transition('void => *', [style({transform: 'translateX(-40%)'}), animate('0.5s')])]),
    trigger('flyOutIN', [ transition('void => *', [style({transform: 'translateX(+40%)'}), animate('0.5s')])])
  ]
})
export class HeaderComponent {

  public currentToken$: Observable<string | null>;
  public currentUser$: Observable<User | null>;
  public username: string|undefined;
  public show_login_button = true;

  constructor(
    private readonly _authenticationService: AuthService,
    private readonly _userService: UserService,
    private readonly _router: Router
  ) {
    this.currentToken$ = this._authenticationService.currentToken$;
    this.currentUser$ = this._authenticationService.currentUser$;
    this._subscribeToUserChanges();
    this._loadCurrentUser();
  }

  private _subscribeToUserChanges(): void {
    this.currentToken$.subscribe((token: string | null) => {
      this._setMenuItems(token);
    });
    this.currentUser$.subscribe((user: User | null) => this.username = user?.user.username)
  }

  private _loadCurrentUser(): void {
    if (this._authenticationService.currentUserToken()!=='') {
      this._userService.getCurrentUser().subscribe((response: User) => {
        this._authenticationService.login(response);
      });
    }
  }

  private _setMenuItems(token: string | null): void {
    // this._loadCurrentUser();
    if (token) {
      this.show_login_button = false;
    } else {
      this.show_login_button = true;
    }
  }

  public logout(){
    this._authenticationService.logout();
    this._router.navigateByUrl('/');
  }

}