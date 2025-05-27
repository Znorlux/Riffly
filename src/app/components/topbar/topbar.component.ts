import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  isUserMenuOpen = false;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del usuario actual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cerrar el menú cuando se hace clic fuera de él
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'US';

    const firstName = this.currentUser.username?.charAt(0).toUpperCase() || '';
    const secondChar = this.currentUser.username?.charAt(1).toUpperCase() || '';

    return firstName + secondChar;
  }

  getUserAvatar(): string {
    return (
      this.currentUser?.profileImage ||
      'https://placehold.co/100x100/333/yellow?text=' + this.getUserInitials()
    );
  }

  onLogout(): void {
    this.authService.logout();
    this.uiService.showNotification('Sesión cerrada exitosamente', 'success');
    this.router.navigate(['/']);
    this.isUserMenuOpen = false;
  }

  onProfile(): void {
    // TODO: Implementar navegación a perfil
    this.uiService.showNotification('Función de perfil próximamente', 'info');
    this.isUserMenuOpen = false;
  }
}
