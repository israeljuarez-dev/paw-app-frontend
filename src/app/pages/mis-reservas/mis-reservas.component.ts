import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';

// Interfaz para la estructura de una Mascota
interface Mascota {
  nombre: string;
  especie: string;
  genero: string;
  edad: string;
}

// Interfaz para la estructura de un Cliente
interface Cliente {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
}

// Interfaz para la estructura de un Servicio Médico
interface ServicioMedico {
  especialidad: string;
  descripcion: string;
  fecha: string;
  estado: 'Pagado' | 'No pagado';
}

// Interfaz principal para la estructura de una Reserva
interface Reserva {
  tipo: 'Cita Programada' | 'Historial';
  mascota: Mascota;
  cliente: Cliente;
  servicioMedico: ServicioMedico;
}

@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit{

  // Esta lista se llenaría con datos de tu API de Spring Boot
  reservas: Reserva[] = [];

  // URL base de tu API (ejemplo)
  private apiUrl = 'https://tudominio.com/api/reservas';

  constructor() { }

  ngOnInit(): void {
    // Aquí es donde realizarías la llamada HTTP a tu API de Spring Boot
    // Ejemplo (simulado):
    // this.http.get<Reserva[]>(this.apiUrl).subscribe(data => {
    //   this.reservas = data;
    // });

    // Por ahora, usamos datos simulados para que el *template* funcione:
    this.reservas = [
      {
        tipo: 'Cita Programada',
        mascota: { nombre: 'Coco', especie: 'Perro', genero: 'Macho', edad: '2 años' },
        cliente: { nombre: 'Daniela', apellido: 'Gómez', dni: '76382910', telefono: '987654123' },
        servicioMedico: { especialidad: 'Medicina general', descripcion: 'Revisión de rutina', fecha: '12/01/2026', estado: 'No pagado' }
      },
      {
        tipo: 'Cita Programada',
        mascota: { nombre: 'Luna', especie: 'Gato', genero: 'Hembra', edad: '1 año' },
        cliente: { nombre: 'Ana', apellido: 'Torres', dni: '76543218', telefono: '912345678' },
        servicioMedico: { especialidad: 'Odontología', descripcion: 'Limpieza dental', fecha: '20/02/2026', estado: 'No pagado' }
      },
      {
        tipo: 'Historial',
        mascota: { nombre: 'Coco', especie: 'Perro', genero: 'Macho', edad: '2 años' },
        cliente: { nombre: 'Daniela', apellido: 'Gómez', dni: '76382910', telefono: '987654123' },
        servicioMedico: { especialidad: 'Dermatología', descripcion: 'Tratamiento de irritación', fecha: '02/09/2025', estado: 'Pagado' }
      }
    ];
  }

  // Métodos de acción para los botones
  editarReserva(reserva: Reserva): void {
    console.log('Editar reserva:', reserva);
    // Lógica para navegar a la página de edición
  }

  cancelarReserva(reserva: Reserva): void {
    console.log('Cancelar reserva:', reserva);
    // Lógica para enviar la solicitud de cancelación a la API
  }

}
