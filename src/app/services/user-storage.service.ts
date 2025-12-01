// src/app/services/user-storage.service.ts
import { Injectable } from '@angular/core';
import { LoginResponseDTO } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private readonly USER_KEY = 'auth-user';
  private readonly TOKEN_KEY = 'auth-token';

  clean(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public saveUser(user: LoginResponseDTO): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(this.TOKEN_KEY, user.token);
    }
  }

  public getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem(this.USER_KEY);
    return user !== null;
  }
}
