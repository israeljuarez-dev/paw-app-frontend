import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; // Módulos para formularios reactivos
import { AuthService } from '../services/auth.service'; // Importamos el servicio
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Inyección de dependencias moderna
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para manejar el estado reactivo
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Definición del FormGroup con validadores
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {
    // Es buena práctica asegurarse de que HttpClientModule esté importado en tu app.config.ts
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   */
  onSubmit(): void {
    this.errorMessage.set(null); // Limpiar errores previos

    if (this.loginForm.invalid) {
      // Marcar todos los campos como tocados para mostrar mensajes de error
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Por favor, completa correctamente todos los campos.');
      return;
    }

    this.loading.set(true);
    const requestData = this.loginForm.value as { email: string; password: string };

    this.authService.login(requestData)
      .subscribe({
        next: (response) => {
          // Éxito:
          console.log('Login exitoso:', response);

          // 1. Guardar el token (ejemplo)
          localStorage.setItem('auth_token', response.token);

          // 2. Redirigir al usuario (ejemplo a una ruta protegida)
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          // Error:
          console.error('Error de login:', error);
          let message = 'Ocurrió un error inesperado al iniciar sesión.';

          // Manejo específico del error del backend (adaptar según tu API)
          if (error.status === 401 || error.status === 403) {
             message = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
          } else if (error.error && error.error.message) {
             message = error.error.message;
          }

          this.errorMessage.set(message);
          this.loading.set(false);
        },
        complete: () => {
          // Se ejecuta siempre al finalizar (éxito o error)
          this.loading.set(false);
        }
      });
  }
}
