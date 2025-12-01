import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDTO, LoginResponseDTO } from '../models/auth.models'; // Definiremos estos modelos
import { environment } from '../../environments/environment';
// Asume un archivo de entorno

@Injectable({
  // 'root' hace que el servicio esté disponible en toda la aplicación (Angular moderno)
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl =  environment.apiUrl + '/auth'; // La URL base de tu API

  /**
   * Envía la solicitud de inicio de sesión a la API.
   * @param credentials Datos de inicio de sesión (email y password).
   * @returns Un Observable con la respuesta de la API.
   */
  login(credentials: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, credentials);
  }

  // Aquí podrías agregar métodos para guardar y obtener el token, etc.
}
