
/**
 * Información del dueño de la mascota.
 * Corresponde a CustomerInfoDTO en el backend.
 */
export interface CustomerInformation {
  customer_first_name: string;
  customer_last_name: string;
  customer_dni: string;
  customer_phone_number: string;
  customer_email: string;
}

export interface PetInformation {
  pet_first_name: string;
  pet_last_name: string;
  pet_gender: 'MALE' | 'FEMALE' | 'OTHER';
  pet_specie: string;
  pet_birth_date: string; // Formato 'YYYY-MM-DD'
  pet_owner_id: number; // Requerido según el DTO de Spring Boot
}

// --- Interfaz Principal de Solicitud (Request) ---

/**
 * Estructura del cuerpo JSON para registrar una nueva cita.
 * Corresponde a VeterinaryAppointmentRegisterRequestDTO.
 */
export interface AppointmentRegisterRequest {
  customer_information: CustomerInformation;
  pet_information: PetInformation;

  observations: string;

  veterinary_id: number;
  veterinary_service_id: number;
  shift_id: number;
}

export interface OwnerResponse {
  id: number;
  first_name: string;
  last_name: string;
  dni: string;
  phone_number: string;
  email: string;
}

export interface PetResponse {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  specie: string;
  birth_date: string; // Formato 'YYYY-MM-DD'
  owner: OwnerResponse;
}

export interface VeterinaryResponse {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string; // Formato 'YYYY-MM-DD'
  speciality: string;
  phone_number: string;
  email: string;
  dni: string;
}

export interface VeterinaryServiceResponse {
  id: number;
  name: string;
  description: string;
  price: number;
}


export interface ShiftResponse {
  id: number;
  shift_date: string; // Formato 'YYYY-MM-DD'
  start_time: string; // Formato 'HH:MM:SS'
  end_time: string; // Formato 'HH:MM:SS'
  available: boolean;
}


export interface AppointmentDataResponse {
  id: number;
  status: string; // Enum AppointmentStatusEnum en el backend
  observations: string;
  register_date: string; // Formato 'YYYY-MM-DD'
  pet: PetResponse;
  veterinary: VeterinaryResponse;
  veterinary_service: VeterinaryServiceResponse;
  shift: ShiftResponse;
}

export interface AppointmentRegisterResponse {
  message: string;
  status: number;
  data: AppointmentDataResponse;
}
