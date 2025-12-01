import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentRegisterRequest, AppointmentRegisterResponse } from '../models/reserva.models'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class AppointmentServiceService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/appointments/register';

  constructor(private readonly http: HttpClient) { }

  registerAppointment(data: AppointmentRegisterRequest): Observable<AppointmentRegisterResponse> {
    return this.http.post<AppointmentRegisterResponse>(this.apiUrl, data);
  }
}
