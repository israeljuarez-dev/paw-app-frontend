import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { VeterinaryServicesComponent } from './pages/veterinary-services/veterinary-services.component';

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
    // canActivate: [authGuard] // Si necesitas proteger esta ruta
  }
];
