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
  private readonly http = inject(HttpClient);
  private readonly storage = inject(UserStorageService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  private readonly apiUrl = environment.apiUrl;

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

    /**
     * Attempt to decode the JWT and return the payload object.
     * Returns null if token is absent or cannot be decoded.
     */
    public decodeToken(): Record<string, unknown> | null {
      const token = this.getToken();
      if (!token) return null;
      try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const normalized = payload.replaceAll('-', '+').replaceAll('_', '/');
        const json = atob(normalized);
        return JSON.parse(json);
      } catch (e) {
        // Not a JWT or invalid base64 — log and return null for debugging
        // eslint-disable-next-line no-console
        console.debug('[AuthService] Failed to decode token', e);
        return null;
      }
    }

    /**
     * Try to get a numeric/string user id from the decoded token or saved user.
     */
    public getUserId(): number | string | null {
      const user = this.getCurrentUser();
      if (user && (user.id || user.userId || user.sub)) {
        return user.id ?? user.userId ?? user.sub;
      }
      const decoded = this.decodeToken();
      if (!decoded) return null;
      // Try common claim names
      const sub = decoded['sub'];
      if (typeof sub === 'string' || typeof sub === 'number') return sub;
      const id = decoded['id'];
      if (typeof id === 'string' || typeof id === 'number') return id;
      const userId = decoded['userId'];
      if (typeof userId === 'string' || typeof userId === 'number') return userId;
      return null;
    }
}
