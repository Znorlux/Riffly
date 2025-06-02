import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FileUploadResponse {
  success: boolean;
  fileId: string;
  publicUrl: string;
  filename: string;
  mimeType: string;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private readonly API_BASE_URL = 'http://localhost:3000'; // URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo de audio al S3 y retorna la URL pública
   */
  uploadAudioFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.API_BASE_URL}/s3fake/upload`;

    console.log('📁 Subiendo archivo a S3:', file.name);
    console.log(
      '📊 Tamaño del archivo:',
      (file.size / 1024 / 1024).toFixed(2),
      'MB'
    );

    return this.http.post<FileUploadResponse>(url, formData).pipe(
      catchError((error) => {
        console.error('❌ Error al subir archivo:', error);

        let errorMessage = 'Error al subir el archivo';
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
   * Valida que el archivo sea válido para subir
   */
  validateAudioFile(file: File): string[] {
    const errors: string[] = [];

    // Validar tamaño (máx. 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('El archivo es demasiado grande. Máximo 10MB permitido.');
    }

    // Validar tipo de archivo
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !['mp3', 'wav'].includes(fileExtension || '')
    ) {
      errors.push(
        'Formato de archivo no soportado. Solo se permiten archivos MP3 y WAV.'
      );
    }

    return errors;
  }
}
