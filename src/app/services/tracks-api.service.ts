import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateTrackRequest {
  title: string;
  description?: string;
  audioUrl: string;
  coverImage?: string;
  spectrogramUrl?: string;
  genre: string;
  mood: string;
  tempo: string;
  duration: number;
  isPublic: boolean;
  allowCollaborations: boolean;
  aiGenerated: boolean;
  generationMethod: string;
  aiPrompt?: string;
  originalPrompt?: string;
  mainInstruments: string[];
  lyrics?: string;
  riffusionId?: string;
  generationId?: string;
  generationTime?: number;
  fileSize?: number;
  userId?: string; // Opcional, se puede obtener del JWT en el backend
}

export interface CreatedTrackResponse {
  id: string;
  title: string;
  description: string | null;
  audioUrl: string;
  coverImage: string | null;
  spectrogramUrl: string | null;
  genre: string;
  mood: string;
  tempo: string;
  duration: number;
  isPublic: boolean;
  allowCollaborations: boolean;
  aiGenerated: boolean;
  generationMethod: string | null;
  aiPrompt: string | null;
  originalPrompt: string | null;
  instruments: string[];
  lyrics: string | null;
  riffusionId: string | null;
  generationId: string | null;
  generationTime: number | null;
  fileSize: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TracksApiService {
  private readonly API_BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo track en la base de datos
   */
  createTrack(request: CreateTrackRequest): Observable<CreatedTrackResponse> {
    const url = `${this.API_BASE_URL}/tracks`;

    // Obtener token de autenticación
    const token = localStorage.getItem('riffly_token');

    // Obtener userId del localStorage
    const userDataString = localStorage.getItem('riffly_user');
    if (!userDataString) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    try {
      const userData = JSON.parse(userDataString);
      if (!userData.id) {
        return throwError(() => new Error('ID de usuario no encontrado'));
      }

      // Agregar userId al request
      const requestWithUserId = {
        ...request,
        userId: userData.id,
      };

      console.log('🎵 Creando track en BD:', url);
      console.log('📝 Track data:', requestWithUserId);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      });

      return this.http
        .post<CreatedTrackResponse>(url, requestWithUserId, { headers })
        .pipe(
          catchError((error) => {
            console.error('❌ Error al crear track:', error);

            let errorMessage = 'Error al guardar la canción';
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }

            return throwError(() => new Error(errorMessage));
          })
        );
    } catch {
      return throwError(() => new Error('Error al procesar datos de usuario'));
    }
  }
}
