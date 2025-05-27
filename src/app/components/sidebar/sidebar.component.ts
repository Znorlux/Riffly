import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UiService } from '../../services/ui.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { APP_CONFIG } from '../../core/constants/app.constants';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  appName = APP_CONFIG.name;
  sidebarCollapsed = false;
  menuItems: any;

  constructor(public uiService: UiService) {
    this.menuItems = this.uiService.getSidebarMenu();
  }

  ngOnInit(): void {
    this.uiService.sidebarCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((collapsed) => {
        this.sidebarCollapsed = collapsed;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMenuItemClick(item: any): void {
    // Aquí puedes agregar lógica adicional cuando se hace clic en un item del menú
    console.log('Menu item clicked:', item);
  }
}
