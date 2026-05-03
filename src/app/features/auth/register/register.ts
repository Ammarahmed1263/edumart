import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AuthHero } from '../auth-hero/auth-hero';
import { Button } from '../../../shared/components/button/button';

// 1. Fixed the typo in the function name
function checkPassword(form: AbstractControl): ValidationErrors | null {
  const passw = form.get('password')?.value;
  const confirmPassw = form.get('confirmPassword')?.value;
  // If passwords match, return null (no errors). If they don't, return the missMatch error.
  return passw === confirmPassw ? null : { missMatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthHero, Button],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})
export class Register {
  private authServices = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  success = signal<boolean | null>(null);

  registerForm = new FormGroup(
    {
      userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: checkPassword,
    },
  );

  get userName() {
    return this.registerForm.get('userName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  registerSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // 4. We no longer need the manual password check here because the custom validator handles it!
    // The form will simply be marked as invalid and stop at the 'if' statement above.

    const payload = {
      userName: this.registerForm.value.userName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
    };
    this.success.set(null);
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authServices.register(payload).subscribe({
      next: (data) => {
        console.log('success', data);
        console.log('Registration successful!', data);
        this.isLoading.set(false);
        console.log(data);
        this.success.set(true);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err.message);
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.data?.message || 'Registration failed.');
      },
    });
  }
}
