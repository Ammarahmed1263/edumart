import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthHero } from './../auth-hero/auth-hero';
import { ButtonComponent } from './../../../shared/components/button/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AuthHero, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})

export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);


  isLoading = signal<boolean>(false);
  showPassword: boolean = false;
  returnUrl: string = '/';

  loginData = {
    email: '',
    password: '',
  };

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  handleSubmit(form: NgForm) {
    this.isLoading.set(true);

    this.authService.login(this.loginData).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.toast.success('Logged in successfully! Welcome back.');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        console.log('error form login', err);
        this.isLoading.set(false);
      },
    });
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
