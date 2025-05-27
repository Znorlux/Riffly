// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { FeaturedCarouselComponent } from '../../components/featured-carousel/featured-carousel.component';
import { SongListComponent } from '../../components/song-list/song-list.component';
import { MusicFiltersComponent } from '../../shared/components/music-filters/music-filters.component';
import { MusicService } from '../../services/music.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    FeaturedCarouselComponent,
    SongListComponent,
    MusicFiltersComponent,
  ],
  standalone: true,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  musicPrompt = '';
  isGenerating = false;

  constructor(
    private musicService: MusicService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de loading
    this.uiService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isGenerating = loading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateMusic(): void {
    if (!this.musicPrompt.trim() || this.isGenerating) {
      return;
    }

    this.uiService.setLoading(true);

    this.musicService
      .generateMusic(this.musicPrompt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newSong) => {
          this.uiService.showNotification(
            '¡Música generada exitosamente!',
            'success'
          );
          this.musicPrompt = '';
          this.uiService.setLoading(false);
        },
        error: (error) => {
          this.uiService.showNotification('Error al generar música', 'error');
          this.uiService.setLoading(false);
        },
      });
  }
}
