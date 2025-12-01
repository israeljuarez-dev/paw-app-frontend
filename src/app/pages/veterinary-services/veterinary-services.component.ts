// src/app/pages/veterinary-services/veterinary-services.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Servicios
import { VeterinaryService } from '../../services/veterinary-service.service';
import { NotificationService } from '../../services/notification.service';

// Modelos
import {
  VeterinaryServiceResponse,
  VeterinaryServiceListResponse,
  PaginationParams
} from '../../models/veterinary-service.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-veterinary-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './veterinary-services.component.html',
  styleUrls: ['./veterinary-services.component.css']
})
export class VeterinaryServicesComponent implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private vetService = inject(VeterinaryService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);

  // Signals para estado reactivo
  loading = signal(false);
  loadingServices = signal(false);
  services = signal<VeterinaryServiceResponse[]>([]);
  totalServices = signal(0);

  // Paginación
  pageSize = signal(5);
  pageIndex = signal(0);
  pageSizeOptions = [5, 10, 25];

  // Formulario para crear/editar servicio
  serviceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: ['', [Validators.required, Validators.min(0.01)]]
  });

  // Columnas para la tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'actions'];

  ngOnInit(): void {
    this.loadServices();
  }

  /**
   * Cargar servicios con paginación
   */
  loadServices(): void {
    this.loadingServices.set(true);

    const params: PaginationParams = {
      pageActual: this.pageIndex() + 1, // API usa base 1
      pageSize: this.pageSize()
    };

    this.vetService.getServices(params).subscribe({
      next: (response) => {
        this.services.set(response.data);
        this.totalServices.set(response.data.length); // Ajustar según tu API
        this.loadingServices.set(false);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.notification.showError('Error al cargar los servicios veterinarios');
        this.loadingServices.set(false);
      }
    });
  }

  /**
   * Manejar cambio de página
   */
  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
    this.loadServices();
  }

  /**
   * Crear nuevo servicio veterinario
   */
  onCreateService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      this.notification.showError('Por favor, completa correctamente todos los campos.');
      return;
    }

    this.loading.set(true);

    const serviceData = {
      name: this.serviceForm.value.name!,
      description: this.serviceForm.value.description!,
      price: parseFloat(this.serviceForm.value.price!)
    };

    this.vetService.createService(serviceData).subscribe({
      next: (response) => {
        this.notification.showSuccess(response.message || 'Servicio creado exitosamente!');

        // Resetear formulario
        this.serviceForm.reset();

        // Recargar lista de servicios
        this.loadServices();

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al crear servicio:', error);

        let message = 'Error al crear el servicio veterinario.';
        if (error.error && error.error.message) {
          message = error.error.message;
        } else if (error.status === 400) {
          message = 'Datos inválidos. Verifica la información ingresada.';
        }

        this.notification.showError(message);
        this.loading.set(false);
      }
    });
  }

  /**
   * Eliminar un servicio
   */
  onDeleteService(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.vetService.deleteService(id).subscribe({
        next: (response) => {
          this.notification.showSuccess(response.message || 'Servicio eliminado exitosamente!');
          this.loadServices();
        },
        error: (error) => {
          console.error('Error al eliminar servicio:', error);
          this.notification.showError('Error al eliminar el servicio');
        }
      });
    }
  }

  /**
   * Editar un servicio (precargar datos en formulario)
   */
  onEditService(service: VeterinaryServiceResponse): void {
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      price: service.price.toString()
    });

    // Scroll al formulario
    document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Limpiar formulario
   */
  clearForm(): void {
    this.serviceForm.reset();
  }
}
