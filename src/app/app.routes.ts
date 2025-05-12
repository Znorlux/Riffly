import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // ruta raíz
  { path: 'login', component: LoginComponent }, // futura página de login
  { path: '**', redirectTo: '' }, // todo lo demás va a home
];
