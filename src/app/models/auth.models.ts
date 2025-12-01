/**
 * Request DTO para la solicitud de inicio de sesión.
 * Corresponde al LoginRequestDTO de tu API.
 */
export interface LoginRequestDTO {
    email: string;
    password: string;
}

/**
 * Response DTO para la respuesta de inicio de sesión.
 * Corresponde al LoginResponseDTO de tu API.
 */
export interface LoginResponseDTO {
    email: string;
    message: string;
    token: string;
}
