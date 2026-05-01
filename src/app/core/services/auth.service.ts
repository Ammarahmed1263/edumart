import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginPayload, RegisterPayload, AuthResponse } from '../models/user.model';
import { tap, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  currentUser = signal<{ token: string | null }>({ token: localStorage.getItem('token') });

  login(userData: LoginPayload): Observable<AuthResponse> {
    console.log(environment);

    console.log(environment.apiUrl);

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, userData).pipe(
      tap((response) => {
        let token = response?.data.token;
        localStorage.setItem('token', token);
        this.currentUser.set({ token });
      }),
    );
  }

  register(userData: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap((response) => {
        let token = response.data.token;
        localStorage.setItem('token', token);
        this.currentUser.set({ token });
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set({ token: null });
  }

  getToken() {
    return this.currentUser().token;
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
