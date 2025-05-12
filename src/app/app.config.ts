// src/app/app.config.ts
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig = [
  provideHttpClient(),
  provideRouter(routes, withEnabledBlockingInitialNavigation()),
  // … cualquier otro provider global que necesites
];
