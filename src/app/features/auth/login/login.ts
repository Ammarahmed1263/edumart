import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthHero } from './../auth-hero/auth-hero';
import { Button } from './../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AuthHero, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  showPassword: boolean = false;

  loginData = {
    email: '',
    password: '',
  };

  handleSumbit(form: NgForm) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginData).subscribe({
      next: (data) => {
        console.log('the data isssss', data);
        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.router.createUrlTree(['/home']);
      },
      error: (err) => {
        console.log('error form login', err);
        this.isLoading.set(false);
        const backendMessage = err.error?.data?.message || 'Login failed. Please try again';
        // console.log('backEnd meesage is', backendMessage);
        this.errorMessage.set(backendMessage);
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
