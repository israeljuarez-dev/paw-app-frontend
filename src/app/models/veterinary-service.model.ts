// src/app/models/veterinary-service.model.ts
export interface VeterinaryServiceRequest {
  name: string;
  description: string;
  price: number;
}

export interface VeterinaryServiceResponse {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface VeterinaryServiceListResponse {
  message: string;
  status: number;
  data: VeterinaryServiceResponse[];
}

export interface VeterinaryServiceCreateResponse {
  message: string;
  status: number;
  data: VeterinaryServiceResponse;
}

export interface PaginationParams {
  pageActual: number;
  pageSize: number;
}
