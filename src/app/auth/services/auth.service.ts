import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/IAuthResponse';
import { User } from '@auth/interfaces/IUser';
import { tap } from 'rxjs';
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

  authStatus = computed<AuthStatus>(() => {
    if( this._authStatus() === 'checking' ) return 'checking';

    if( this._user() ) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed(this._token);

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${ baseUrl }/auth/login`, {
      email,
      password
    }).pipe(
      tap((res) => {
        this._user.set(res.user);
        this._authStatus.set('authenticated');
        this._token.set(res.token);

        localStorage.setItem('token', res.token);
      })
    )
  }

}
