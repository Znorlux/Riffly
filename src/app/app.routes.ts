import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateComponent } from './pages/create/create.component';
import { YouTubeDownloadComponent } from './pages/youtube-download/youtube-download.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // ruta raíz - acceso público
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Solo usuarios autenticados
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard], // Solo usuarios autenticados
  },
  {
    path: 'youtube-download',
    component: YouTubeDownloadComponent,
    canActivate: [AuthGuard], // Solo usuarios autenticados
  },
  {
    path: 'collaboration',
    loadComponent: () =>
      import('./pages/collaboration/collaboration.component').then(
        (m) => m.CollaborationComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'learning',
    loadComponent: () =>
      import('./pages/learning/learning.component').then(
        (m) => m.LearningComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: 'not-found', component: NotFoundComponent }, // Página 404
  { path: '**', redirectTo: 'not-found' }, // Cualquier ruta no encontrada va a 404
];
