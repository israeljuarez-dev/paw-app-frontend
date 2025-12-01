// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequestDTO, LoginResponseDTO, RegisterReponse, RegisterRequest } from '../models/auth.models';
import { environment } from '../../environments/environment';
import { UserStorageService } from './user-storage.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(UserStorageService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  login(credentials: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: LoginResponseDTO) => {
          if (response.status === 200) {
            this.storage.saveUser(response);
            this.notification.showSuccess('¡Inicio de sesión exitoso!');
            this.router.navigate(['/']);
          }
        })
      );
  }

  register(credentials: RegisterRequest): Observable<RegisterReponse> {
    return this.http.post<RegisterReponse>(`${this.apiUrl}/users/register`, credentials);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.storage.isLoggedIn();
  }

  // Método para cerrar sesión
  logout(): void {
    this.storage.clean();
    this.notification.showInfo('Sesión cerrada correctamente');
  }

  // Obtener información del usuario actual
  getCurrentUser() {
    return this.storage.getUser();
  }

    getToken(): string | null {
    return this.storage.getToken();
  }
}
