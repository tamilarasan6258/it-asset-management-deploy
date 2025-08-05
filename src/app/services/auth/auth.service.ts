import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthUser, LoginResponse, MessageResponse } from '../../models/auth.model';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.auth_apiBaseUrl;

  private token: string | null = null;
  private user: AuthUser | null = null;
  private logoutTimer: any;
  private sessionExpiredMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }


  restoreSession(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.token) {
        this.refreshAccessToken().subscribe({
          next: (res) => {
            this.setSession(res.token, res.user);

            resolve();
          },
          error: () => {
            resolve();
          }
        });
      } else {

        resolve();
      }
    });
  }

  login(credentials: { email: string; password: string }) :Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((res) => {

        this.setSession(res.token, res.user);
      })
    );
  }

  //set the token at the time of login
  setSession(token: string, user: AuthUser) {
    
    this.token = token;
    this.user = user;

    const expiresAt = this.getTokenExpiration(token);
    const now = Date.now();
    const timeout = expiresAt - now;

    if (timeout <= 0) {
      this.logout(); // already expired
    } else {
      this.startAutoLogout(timeout);
    }
  }

  refreshAccessToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap(res => {
        this.setSession(res.token, res.user); // update memory token and timer
      })
    );
  }



  private getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // exp is in seconds
    } catch {
      return Date.now(); // fallback to now if invalid
    }
  }

  private startAutoLogout(expireInMs: number) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    // Schedule logout
    this.logoutTimer = setTimeout(() => {
      this.logout('Your session has expired');
      this.router.navigate(['/login']);
    }, expireInMs);

    // ⏱️ Schedule refresh 5s before actual expiry
    const refreshBeforeMs = expireInMs - 5000; // 5 seconds before token expires
    if (refreshBeforeMs > 0) {
      setTimeout(() => {
        this.refreshAccessToken().subscribe({
          next: () => {
            console.log('🔁 Token refreshed proactively');
          },
          error: () => {
            console.log('⚠️ Refresh failed');
            this.logout('Your session has expired');
            this.router.navigate(['/login']);
          },
        });
      }, refreshBeforeMs);
    }
  }



  getToken(): string | null {
    return this.token;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  logout(message?: string) {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => console.log('Refresh token cleared'),
        error: (err) => console.warn('Logout error', err),
      });

    this.token = null;
    this.user = null;

    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    this.logoutTimer = null;

    if (message) {
      this.sessionExpiredMessage = message;
    }
  }

  forgotPassword(email: string) :Observable<MessageResponse>  {
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password/${token}`, { password });
  }



  getSessionExpiredMessage(): string | null {
    const msg = this.sessionExpiredMessage;
    this.sessionExpiredMessage = null; // clear after reading once
    return msg;
  }


  isAuthenticated(): boolean {
    // const token = sessionStorage.getItem('token');
    const token = this.getToken();

    if (!token) return false;                           //checks if the token is valid(if token-valid, not expired, exists)

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));      //decoding/extracting the payload part of the JWT token(JWT token format : header.payload.signature)->to extract payload use[1]
      return payload.exp > Date.now() / 1000;                     //payload.exp-expiration time of token in seconds, Date.now()-current time
      //if the exp time is in the future the token is still valid and return true
    } catch {
      return false;
    }
  }


}
