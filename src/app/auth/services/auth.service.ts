import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/IAuthResponse';
import { User } from '@auth/interfaces/IUser';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _authStatus = signal<AuthStatus>('checking');
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);

  private readonly http = inject(HttpClient);

  getStatusValidate = rxResource({
    loader: () => this.checkStatus()
  })

  authStatus = computed<AuthStatus>(() => {
    if( this._authStatus() === 'checking' ) return 'checking';

    if( this._user() ) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${ baseUrl }/auth/login`, {
      email,
      password
    }).pipe(
      map((res) => this.handleAuthSuccess(res)),
      catchError((error: any) => this.handleAuthError(error)
      )
    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if ( !token ) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${ baseUrl }/auth/check-status`, {
    }).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      map(() => true),
      catchError((error: any) => this.handleAuthError(error)
      )
    )

  }

  registerUser(email: string, password: string, fullName: string) {
    return this.http.post<AuthResponse>(`${ baseUrl }/auth/register`, {
      email,
      password,
      fullName
    }).pipe(
      tap((res) => this.handleAuthSuccess(res)),
      map(() => true),
      catchError((error: any) => this.handleAuthError(error)
      )
    )
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleAuthSuccess( res: AuthResponse ) {
    this._user.set(res.user);
    this._authStatus.set('authenticated');
    this._token.set(res.token);

    localStorage.setItem('token', res.token);

    return(true);
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false)
  }

}
