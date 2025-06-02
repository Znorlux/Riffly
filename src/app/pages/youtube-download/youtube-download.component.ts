import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import {
  YouTubeDownloadService,
  YouTubeDownloadResponse,
} from '../../services/youtube-download.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-youtube-download',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    IconComponent,
  ],
  templateUrl: './youtube-download.component.html',
  styleUrls: ['./youtube-download.component.css'],
})
export class YouTubeDownloadComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  youtubeUrl = '';
  isDownloading = false;
  downloadProgress = 0;
  downloadedSong: YouTubeDownloadResponse | null = null;
  downloadHistory: YouTubeDownloadResponse[] = [];

  constructor(
    private youtubeService: YouTubeDownloadService,
    private uiService: UiService
  ) {
    // Cargar historial desde localStorage
    this.loadDownloadHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Valida la URL de YouTube mientras el usuario escribe
   */
  get isValidUrl(): boolean {
    if (!this.youtubeUrl.trim()) return false;
    return this.youtubeService.isValidYouTubeUrl(this.youtubeUrl);
  }

  /**
   * Descarga la canción de YouTube
   */
  downloadSong(): void {
    if (!this.isValidUrl) {
      this.uiService.showNotification(
        'Por favor ingresa una URL válida de YouTube',
        'error'
      );
      return;
    }

    this.isDownloading = true;
    this.downloadProgress = 0;
    this.downloadedSong = null;

    // Simular progreso
    const progressInterval = setInterval(() => {
      if (this.downloadProgress < 90) {
        this.downloadProgress += Math.random() * 15;
      }
    }, 500);

    this.youtubeService
      .downloadFromYouTube(this.youtubeUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          clearInterval(progressInterval);
          this.downloadProgress = 100;

          setTimeout(() => {
            this.isDownloading = false;
            this.downloadProgress = 0;
            this.downloadedSong = response;

            // Agregar al historial
            this.downloadHistory.unshift(response);
            this.saveDownloadHistory();

            this.uiService.showNotification(
              `"${response.title}" descargada exitosamente`,
              'success'
            );

            // Limpiar el input
            this.youtubeUrl = '';
          }, 1000);
        },
        error: (error) => {
          clearInterval(progressInterval);
          this.isDownloading = false;
          this.downloadProgress = 0;

          console.error('Error al descargar:', error);
          this.uiService.showNotification(
            `Error al descargar: ${error.message || 'Error desconocido'}`,
            'error'
          );
        },
      });
  }

  /**
   * Descarga el archivo de audio
   */
  downloadFile(audioUrl: string, title: string): void {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${title}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.uiService.showNotification('Descarga iniciada', 'success');
  }

  /**
   * Copia la URL de audio al portapapeles
   */
  async copyToClipboard(audioUrl: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(audioUrl);
      this.uiService.showNotification('URL copiada al portapapeles', 'success');
    } catch (err) {
      console.error('Error al copiar:', err);
      this.uiService.showNotification('Error al copiar URL', 'error');
    }
  }

  /**
   * Limpia el historial de descargas
   */
  clearHistory(): void {
    this.downloadHistory = [];
    this.saveDownloadHistory();
    this.uiService.showNotification('Historial eliminado', 'success');
  }

  /**
   * Guarda el historial en localStorage
   */
  private saveDownloadHistory(): void {
    localStorage.setItem(
      'youtube-download-history',
      JSON.stringify(this.downloadHistory)
    );
  }

  /**
   * Carga el historial desde localStorage
   */
  private loadDownloadHistory(): void {
    const saved = localStorage.getItem('youtube-download-history');
    if (saved) {
      try {
        this.downloadHistory = JSON.parse(saved);
      } catch (error) {
        console.error('Error al cargar historial:', error);
        this.downloadHistory = [];
      }
    }
  }

  /**
   * Obtiene el ID del video de YouTube para la miniatura
   */
  getVideoId(url: string): string {
    return this.youtubeService.extractVideoId(url) || '';
  }

  /**
   * Obtiene la URL de la miniatura de YouTube
   */
  getThumbnailUrl(url: string): string {
    const videoId = this.getVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : '';
  }

  /**
   * Función de tracking para ngFor del historial
   */
  trackBySong(index: number, song: YouTubeDownloadResponse): string {
    return song.audioUrl;
  }

  /**
   * Maneja el error de carga de imagen estableciendo una imagen por defecto
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/80x80/333/yellow?text=YT';
  }
}
