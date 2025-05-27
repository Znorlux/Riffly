import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // ruta raíz
  { path: 'login', component: LoginComponent }, // página de login
  { path: 'register', component: RegisterComponent }, // página de registro
  { path: 'dashboard', component: DashboardComponent }, // dashboard principal
  { path: '**', redirectTo: '' }, // todo lo demás va a home
];
