import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { VeterinaryServicesComponent } from './pages/veterinary-services/veterinary-services.component';

import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path:'reservas',
    component: ReservaComponent
  },
  {
    path: 'login',
    canActivate: [authGuard],
    component: LoginComponent
  },
  {
    path: 'signin',
    canActivate: [authGuard],
    component: RegisterComponent
  },
  {
    path: 'veterinary-services',
    component: VeterinaryServicesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'mis-reservas', // ⬅️ La URL a la que haces clic en la barra de navegación
    component: MisReservasComponent, // ⬅️ El componente que has creado
    canActivate: [authGuard]
  }
];
