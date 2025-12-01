// src/app/pages/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

// Angular Material imports
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LoginRequestDTO } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    // Angular Material modules
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  hidePassword = signal(true);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notification.showError('Por favor, completa correctamente todos los campos.');
      return;
    }

    this.loading.set(true);

    const requestData = this.loginForm.value as LoginRequestDTO;

    this.authService.login(requestData).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error de login:', error);

        let message = 'Ocurrió un error inesperado al iniciar sesión.';
        if (error.status === 401 || error.status === 403) {
          message = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (error.error?.message) {
          message = error.error.message;
        }

        this.errorMessage.set(message);
        this.notification.showError(message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
