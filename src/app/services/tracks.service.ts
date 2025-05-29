import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import {
  ApiService,
  CreatedTrackResponse,
  CreateTrackRequest,
} from './api.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private tracksSubject = new BehaviorSubject<CreatedTrackResponse[]>([]);
  public tracks$ = this.tracksSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService, private uiService: UiService) {}

  /**
   * Carga las canciones del usuario autenticado
   */
  loadMyTracks(): Observable<CreatedTrackResponse[]> {
    this.loadingSubject.next(true);

    return this.apiService.getMyTracks().pipe(
      tap((tracks) => {
        console.log('Canciones cargadas:', tracks);
        this.tracksSubject.next(tracks);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('Error al cargar canciones:', error);
        this.loadingSubject.next(false);

        if (error.status === 401) {
          this.uiService.showNotification(
            'Sesión expirada. Por favor inicia sesión nuevamente.',
            'error'
          );
        } else {
          this.uiService.showNotification(
            'Error al cargar tus canciones. Intenta nuevamente.',
            'error'
          );
        }

        return of([]);
      })
    );
  }

  /**
   * Actualiza una canción
   */
  updateTrack(
    trackId: string,
    updates: Partial<CreateTrackRequest>
  ): Observable<CreatedTrackResponse | null> {
    return this.apiService.updateTrack(trackId, updates).pipe(
      tap((updatedTrack) => {
        // Actualizar el track en la lista local
        const currentTracks = this.tracksSubject.value;
        const trackIndex = currentTracks.findIndex((t) => t.id === trackId);

        if (trackIndex !== -1) {
          currentTracks[trackIndex] = updatedTrack;
          this.tracksSubject.next([...currentTracks]);
        }

        this.uiService.showNotification(
          'Canción actualizada exitosamente',
          'success'
        );
      }),
      catchError((error) => {
        console.error('Error al actualizar canción:', error);
        this.uiService.showNotification(
          'Error al actualizar la canción',
          'error'
        );
        return of(null);
      })
    );
  }

  /**
   * Elimina una canción
   */
  deleteTrack(trackId: string): Observable<boolean> {
    return this.apiService.deleteTrack(trackId).pipe(
      tap(() => {
        // Remover el track de la lista local
        const currentTracks = this.tracksSubject.value;
        const filteredTracks = currentTracks.filter((t) => t.id !== trackId);
        this.tracksSubject.next(filteredTracks);

        this.uiService.showNotification(
          'Canción eliminada exitosamente',
          'success'
        );
      }),
      map(() => true), // Convertir void a boolean
      catchError((error) => {
        console.error('Error al eliminar canción:', error);
        this.uiService.showNotification(
          'Error al eliminar la canción',
          'error'
        );
        return of(false);
      })
    );
  }

  /**
   * Obtiene una canción específica por ID
   */
  getTrackById(trackId: string): CreatedTrackResponse | undefined {
    return this.tracksSubject.value.find((track) => track.id === trackId);
  }

  /**
   * Agrega una nueva canción a la lista (útil después de crear una nueva)
   */
  addTrack(newTrack: CreatedTrackResponse): void {
    const currentTracks = this.tracksSubject.value;
    this.tracksSubject.next([newTrack, ...currentTracks]); // Agregar al inicio
  }

  /**
   * Filtra canciones por género
   */
  filterByGenre(genre: string): CreatedTrackResponse[] {
    return this.tracksSubject.value.filter(
      (track) => track.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  /**
   * Filtra canciones por estado de ánimo
   */
  filterByMood(mood: string): CreatedTrackResponse[] {
    return this.tracksSubject.value.filter(
      (track) => track.mood.toLowerCase() === mood.toLowerCase()
    );
  }

  /**
   * Busca canciones por título o descripción
   */
  searchTracks(query: string): CreatedTrackResponse[] {
    const searchTerm = query.toLowerCase();
    return this.tracksSubject.value.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm) ||
        track.description?.toLowerCase().includes(searchTerm) ||
        track.originalPrompt?.toLowerCase().includes(searchTerm)
    );
  }
}
