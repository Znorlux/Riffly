import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FollowingComponent } from './pages/following/following.component';
import { CreateComponent } from './pages/create/create.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // ruta raíz - acceso público
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard], // Solo usuarios no autenticados
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard], // Solo usuarios no autenticados
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Solo usuarios autenticados
  },
  {
    path: 'following',
    component: FollowingComponent,
    canActivate: [AuthGuard], // Solo usuarios autenticados
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard], // Solo usuarios autenticados
  },
  { path: '**', redirectTo: '' }, // todo lo demás va a home
];
