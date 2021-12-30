import { User } from '../interfaces/user.interface';
import { FbAuthInterface } from '../interfaces/fb.auth.interface';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { FbErrorKey, FbErrors } from '../interfaces/fb.errors.interface';


const fbErrors: FbErrors = {
  EMAIL_NOT_FOUND: 'Email not found',
  INVALID_EMAIL: 'Invalid email',
  INVALID_PASSWORD: 'Invalid password',
}

@Injectable()
export class AuthService {
  private loginEndpoint: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`;
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  get token(): string | null {
    const expDate = new Date(
      localStorage.getItem('fb-token-exp') || ''
    );
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  public login(user: User): Observable<FbAuthInterface> {
    return this.http.post<FbAuthInterface>(this.loginEndpoint, {...user, returnSecureToken: true})
      .pipe(
        tap((response) => this.setToken(response)),
        catchError((error) => this.handleError(error))
      );
  }

  public logout(): void {
    this.setToken(null);
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: FbAuthInterface | null): void {
    if (response) {
      const expDate = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem('fb-token', response.idToken.toString());
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  private handleError(error: HttpErrorResponse) {
    const errorKey: FbErrorKey = error.error.error.message;
    this.error$.next(
      fbErrors[errorKey] || ''
    )
    return throwError(error);
  }
}
