import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface MiniMaxGenerationRequest {
  promptA?: string; // Lyrics de la canción
  promptB?: string; // URL del archivo de audio de referencia
}

export interface MiniMaxGenerationResponse {
  id: string;
  status: string;
  output?: string;
  created_at: string;
  completed_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MinimaxService {
  private readonly API_BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Genera música usando el modelo MiniMax con archivo de referencia
   */
  generateMusic(
    request: MiniMaxGenerationRequest
  ): Observable<MiniMaxGenerationResponse> {
    const url = `${this.API_BASE_URL}/minimax/generate`;

    console.log('🎵 Llamando a MiniMax API:', url);
    console.log('📝 Request payload:', request);

    return this.http.post<MiniMaxGenerationResponse>(url, request).pipe(
      catchError((error) => {
        console.error('❌ Error en MiniMax generation:', error);

        let errorMessage = 'Error al generar música con MiniMax';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Valida que los parámetros sean correctos para MiniMax
   */
  validateGenerationRequest(request: MiniMaxGenerationRequest): string[] {
    const errors: string[] = [];

    if (request.promptB && !this.isValidUrl(request.promptB)) {
      errors.push('La URL del archivo de referencia no es válida');
    }

    if (request.promptA && request.promptA.length > 2000) {
      errors.push(
        'Las letras de la canción son demasiado largas (máx. 2000 caracteres)'
      );
    }

    return errors;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }
}
