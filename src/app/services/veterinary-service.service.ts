// src/app/services/veterinary-service.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  VeterinaryServiceRequest,
  VeterinaryServiceResponse,
  VeterinaryServiceListResponse,
  VeterinaryServiceCreateResponse,
  PaginationParams
} from '../models/veterinary-service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VeterinaryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/veterinary-services`;

  /**
   * Crear un nuevo servicio veterinario
   */
  createService(serviceData: VeterinaryServiceRequest): Observable<VeterinaryServiceCreateResponse> {
    return this.http.post<VeterinaryServiceCreateResponse>(this.apiUrl, serviceData);
  }

  /**
   * Obtener lista de servicios veterinarios con paginación
   */
  getServices(params: PaginationParams): Observable<VeterinaryServiceListResponse> {
    let httpParams = new HttpParams()
      .set('pageActual', params.pageActual.toString())
      .set('pageSize', params.pageSize.toString());

    return this.http.get<VeterinaryServiceListResponse>(this.apiUrl, { params: httpParams });
  }

  /**
   * Obtener todos los servicios (sin paginación)
   */
  getAllServices(): Observable<VeterinaryServiceListResponse> {
    return this.http.get<VeterinaryServiceListResponse>(this.apiUrl);
  }

  /**
   * Obtener un servicio por ID
   */
  getServiceById(id: number): Observable<VeterinaryServiceResponse> {
    return this.http.get<VeterinaryServiceResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualizar un servicio existente
   */
  updateService(id: number, serviceData: VeterinaryServiceRequest): Observable<VeterinaryServiceCreateResponse> {
    return this.http.put<VeterinaryServiceCreateResponse>(`${this.apiUrl}/${id}`, serviceData);
  }

  /**
   * Eliminar un servicio
   */
  deleteService(id: number): Observable<{ message: string; status: number }> {
    return this.http.delete<{ message: string; status: number }>(`${this.apiUrl}/${id}`);
  }
}
