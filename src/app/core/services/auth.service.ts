import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  MeResponse,
  User,
} from '../models/user.model';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  currentUser = signal<{ token: string | null; user: User | null }>({
    token: localStorage.getItem('token'),
    user: null,
  });

  constructor() {
    if (this.getToken()) {
      this.loadCurrentUser();
    }
  }

  private setAuthState(token: string | null, user: User | null) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.currentUser.set({ token, user });
  }

  login(userData: LoginPayload) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, userData).pipe(
      tap((response) => {
        const token = response?.data.token ?? null;
        this.setAuthState(token, response?.data.user ?? null);
      }),
    );
  }

  register(userData: RegisterPayload) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response) => {
        const token = response?.data.token ?? null;
        this.setAuthState(token, response?.data.user ?? null);
      }),
    );
  }

  loadCurrentUser() {
    return this.http.get<MeResponse>(`${this.apiUrl}/auth/me`).subscribe({
      next: (response) => {
        this.currentUser.update((state) => ({ ...state, user: response.data.user }));
      },
      error: () => {
        this.currentUser.update((state) => ({ ...state, user: null }));
      },
    });
  }

  logout() {
    sessionStorage.removeItem('chat_history');
    sessionStorage.removeItem('chat_is_open');
    this.setAuthState(null, null);
  }

  getToken() {
    return this.currentUser().token;
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
