/**
 * Request DTO para la solicitud de inicio de sesión.
 * Corresponde al LoginRequestDTO de tu API.
 */
export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    email: string;
    message: string;
    token: string;
    status: number;
}

export interface RegisterRequest{
    email: string;
    dni: string;
    phone_number: string;
    password: string;
}


export interface RegisterReponse{
    id: number,
    email: string,
    message: string,
    status: number
}
