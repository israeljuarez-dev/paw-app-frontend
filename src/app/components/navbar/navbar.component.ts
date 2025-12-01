// src/app/components/navbar/navbar.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

// Services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoggedIn = signal(false);
  userEmail = signal('');

  constructor() {
    this.checkAuthStatus();
  }

  ngOnInit() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.isLoggedIn.set(this.authService.isAuthenticated());
    if (this.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      this.userEmail.set(user?.email || '');
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.userEmail.set('');
    this.router.navigate(['/']);
  }
}
