import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentServiceService } from '../../services/appointment-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppointmentRegisterRequest } from '../../models/reserva.models';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  appointmentForm!: FormGroup;

  // API URL is managed by the service; keep this constant only if needed locally

  constructor(
    private readonly fb: FormBuilder,
    private readonly appointmentService: AppointmentServiceService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      customer_information: this.fb.group({
        customer_first_name: ['', Validators.required],
        customer_last_name: ['', Validators.required],
        customer_dni: ['', Validators.required],
        customer_phone_number: ['', Validators.required],
        customer_email: ['', [Validators.required, Validators.email]]
      }),
      pet_information: this.fb.group({
        pet_first_name: ['', Validators.required],
        pet_last_name: ['', Validators.required],
        pet_gender: ['MALE', Validators.required],
        pet_specie: ['', Validators.required],
        pet_birth_date: ['', Validators.required],
        // Remove hard-coded owner id; backend should set owner from token or return an error
        pet_owner_id: [null]
      }),
      observations: ['Max ha estado estornudando mucho esta semana.', Validators.required],
      veterinary_id: [1, Validators.required],
      veterinary_service_id: [1, Validators.required],
      shift_id: [4, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      console.error('El formulario es inválido. Revise los campos.');
      return;
    }

    const appointmentData: AppointmentRegisterRequest = this.appointmentForm.value;
    // Remove null owner id to let backend derive owner from token
    if (appointmentData.pet_information && appointmentData.pet_information.pet_owner_id == null) {
      // @ts-ignore - delete to avoid including null in request
      delete appointmentData.pet_information.pet_owner_id;
    }
    console.log('Datos a enviar:', appointmentData);
    // Extra debug: stringify the object to inspect the outgoing payload shape
    // eslint-disable-next-line no-console
    console.debug('[reserva] outgoing payload:', JSON.stringify(appointmentData));

    // Require authentication: if not logged in, prompt and redirect
    if (!this.authService.isAuthenticated()) {
      alert('Debe iniciar sesión para reservar una cita. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    // Convert property names to camelCase for backend compatibility (if needed)
    const backendPayload = this.convertKeysToCamel(appointmentData) as AppointmentRegisterRequest;
    // Llamar al servicio
    this.appointmentService.registerAppointment(backendPayload).subscribe({
      next: (response) => {
        // Manejar la respuesta exitosa (status 201)
        console.log('✅ Cita registrada con éxito!', response);
        alert(`¡${response.message} (ID: ${response.data.id})`);
        this.appointmentForm.reset();
      },
      error: (error) => {
        // Manejar errores — mostrar detalles del backend si están disponibles
        console.error('❌ Error al registrar la cita (full http error):', error);

        const serverBody = error?.error;
        if (serverBody) {
          console.error('❌ Detalle de respuesta del servidor:', serverBody);
          const parsed = this.parseServerError(serverBody);
          alert(parsed ?? 'Error al registrar la cita. Verifique la consola para más detalles.');
          return;
        }

        // General fallback
        alert('Error al registrar la cita. Verifique la consola para más detalles.');
      }
    });
  }

  // Helper: convert snake_case keys recursively to camelCase
  private convertKeysToCamel(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(v => this.convertKeysToCamel(v));
    }
    if (obj !== null && obj.constructor === Object) {
      const newObj: any = {};
      const keys = Object.keys(obj);
      for (const key of keys) {
        const parts = key.split('_');
        const camelKey = parts.map((p, i) => i === 0 ? p : p[0].toUpperCase() + p.slice(1)).join('');
        newObj[camelKey] = this.convertKeysToCamel(obj[key]);
      }
      return newObj;
    }
    return obj;
  }

  private parseServerError(serverBody: any): string | null {
    if (!serverBody) return null;
    if (typeof serverBody === 'string') return serverBody;
    if (serverBody.message) return serverBody.message;
    if (Array.isArray(serverBody.errors)) return serverBody.errors.join('\n');
    const fieldLists = ['violations', 'fieldErrors', 'errors', 'fieldViolations'];
    for (const k of fieldLists) {
      const d = serverBody[k];
      if (Array.isArray(d)) {
        return d.map((it: any) => it.message || JSON.stringify(it)).join('\n');
      }
    }
    return JSON.stringify(serverBody);
  }
}
