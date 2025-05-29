import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { TracksService } from '../../services/tracks.service';
import { CreatedTrackResponse } from '../../services/api.service';

@Component({
  selector: 'app-my-tracks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
  ],
  templateUrl: './my-tracks.component.html',
  styleUrls: ['./my-tracks.component.css'],
})
export class MyTracksComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tracks: CreatedTrackResponse[] = [];
  filteredTracks: CreatedTrackResponse[] = [];
  loading = false;
  searchQuery = '';
  selectedGenre = '';
  selectedMood = '';
  currentlyPlaying: string | null = null;

  // Opciones para filtros
  genres = [
    'POP',
    'ROCK',
    'ELECTRONIC',
    'HIP_HOP',
    'JAZZ',
    'CLASSICAL',
    'FOLK',
    'REGGAETON',
    'BLUES',
    'COUNTRY',
  ];
  moods = [
    'ALEGRE',
    'MELANCOLICO',
    'ENERGETICO',
    'RELAJANTE',
    'ROMANTICO',
    'NOSTALGICO',
    'MOTIVACIONAL',
    'MISTERIOSO',
    'EPICO',
    'INTIMO',
    'FESTIVO',
    'CONTEMPLATIVO',
  ];

  constructor(private tracksService: TracksService) {}

  ngOnInit(): void {
    this.loadTracks();
    this.subscribeToTracksUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTracks(): void {
    this.tracksService
      .loadMyTracks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tracks) => {
        this.tracks = tracks;
        this.applyFilters();
      });
  }

  private subscribeToTracksUpdates(): void {
    this.tracksService.tracks$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tracks) => {
        this.tracks = tracks;
        this.applyFilters();
      });

    this.tracksService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onGenreChange(): void {
    this.applyFilters();
  }

  onMoodChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedMood = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.tracks];

    // Filtro por búsqueda
    if (this.searchQuery.trim()) {
      filtered = this.tracksService.searchTracks(this.searchQuery);
    }

    // Filtro por género
    if (this.selectedGenre) {
      filtered = filtered.filter((track) => track.genre === this.selectedGenre);
    }

    // Filtro por estado de ánimo
    if (this.selectedMood) {
      filtered = filtered.filter((track) => track.mood === this.selectedMood);
    }

    this.filteredTracks = filtered;
  }

  playTrack(track: CreatedTrackResponse): void {
    if (this.currentlyPlaying === track.id) {
      this.pauseTrack();
    } else {
      this.currentlyPlaying = track.id;
      // Aquí podrías integrar con un reproductor de audio real
      console.log('Reproduciendo:', track.title, track.audioUrl);
    }
  }

  pauseTrack(): void {
    this.currentlyPlaying = null;
  }

  deleteTrack(track: CreatedTrackResponse, event: Event): void {
    event.stopPropagation();

    if (confirm(`¿Estás seguro de que quieres eliminar "${track.title}"?`)) {
      this.tracksService
        .deleteTrack(track.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  downloadTrack(track: CreatedTrackResponse, event: Event): void {
    event.stopPropagation();

    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = track.audioUrl;
    link.download = `${track.title}.mp3`;
    link.target = '_blank';
    link.click();
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getGenreDisplayName(genre: string): string {
    const genreMap: Record<string, string> = {
      POP: 'Pop',
      ROCK: 'Rock',
      ELECTRONIC: 'Electrónica',
      HIP_HOP: 'Hip Hop',
      JAZZ: 'Jazz',
      CLASSICAL: 'Clásica',
      FOLK: 'Folk',
      REGGAETON: 'Reggaetón',
      BLUES: 'Blues',
      COUNTRY: 'Country',
    };
    return genreMap[genre] || genre;
  }

  getMoodDisplayName(mood: string): string {
    const moodMap: Record<string, string> = {
      ALEGRE: 'Alegre',
      MELANCOLICO: 'Melancólico',
      ENERGETICO: 'Energético',
      RELAJANTE: 'Relajante',
      ROMANTICO: 'Romántico',
      NOSTALGICO: 'Nostálgico',
      MOTIVACIONAL: 'Motivacional',
      MISTERIOSO: 'Misterioso',
      EPICO: 'Épico',
      INTIMO: 'Íntimo',
      FESTIVO: 'Festivo',
      CONTEMPLATIVO: 'Contemplativo',
    };
    return moodMap[mood] || mood;
  }

  /**
   * Calcula el número de tracks públicos
   */
  getPublicTracksCount(): number {
    return this.tracks.filter((track) => track.isPublic).length;
  }

  /**
   * Calcula el número de tracks generados con IA
   */
  getAiGeneratedTracksCount(): number {
    return this.tracks.filter((track) => track.aiGenerated).length;
  }
}
