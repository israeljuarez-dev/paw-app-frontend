// src/app/pages/register/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Inyección de dependencias
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  // Signals para estado reactivo
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Formulario reactivo con validaciones
  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
    /**
   * Maneja el envío del formulario de registro
   */
  onSubmit(): void {
    this.errorMessage.set(null); // Limpiar mensajes anteriores

    if (this.registerForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.registerForm.markAllAsTouched();
      this.notification.showError('Por favor, completa correctamente todos los campos.');
      return;
    }

    this.loading.set(true);

    // Crear objeto RegisterRequest según tu modelo
    const registerData = {
      email: this.registerForm.value.email!,
      dni: '00000000', // Valor temporal - necesitarías agregar este campo al formulario
      phone_number: '000000000', // Valor temporal - necesitarías agregar este campo al formulario
      password: this.registerForm.value.password!
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        // Éxito en el registro
        console.log('Registro exitoso:', response);

        if (response.status === 201 || response.status === 200) {
          // Mostrar notificación de éxito
          this.notification.showSuccess(
            response.message || '¡Registro exitoso! Ahora puedes iniciar sesión.'
          );

          // Redirigir a la página de login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      },
      error: (error: HttpErrorResponse) => {
        // Manejo de errores
        console.error('Error en registro:', error);

        let message = 'Ocurrió un error al registrar la cuenta.';

        if (error.status === 400) {
          message = 'Los datos proporcionados no son válidos.';
        } else if (error.status === 409) {
          message = 'El correo electrónico ya está registrado.';
        } else if (error.error?.message) {
          message = error.error.message;
        } else if (error.error?.details) {
          // Si el backend devuelve detalles de validación
          message = error.error.details.join(', ');
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
