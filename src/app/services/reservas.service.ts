import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(
    private readonly http: HttpClient
  ) { }

  public postReserva(data: any): Observable<any> {
    // Basic POST to the backend for creating a reservation
    const apiUrl = 'http://localhost:8080/api/v1/appointments/register';
    return this.http.post(apiUrl, data);
  }
}
