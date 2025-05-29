import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RiffusionGenerateRequest {
  promptA?: string;
  promptB?: string;
  alpha?: number;
  denoising?: number;
  seed_image_id?: string;
  num_inference_steps?: number;
}

export interface RiffusionGenerateResponse {
  id: string;
  status: string;
  output: {
    audio: string;
    spectrogram: string;
  };
  created_at: string;
  completed_at?: string;
  logs?: string;
  error?: string;
  metrics?: Record<string, unknown>;
}

export interface S3UploadFromUrlRequest {
  url: string;
  id: string;
}

export interface S3UploadResponse {
  path: string;
  publicUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Genera música usando Riffusion AI
   */
  generateMusic(
    params: RiffusionGenerateRequest
  ): Observable<RiffusionGenerateResponse> {
    const url = `${this.baseUrl}/riffusion/generate`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<RiffusionGenerateResponse>(url, params, { headers });
  }

  /**
   * Sube un archivo desde una URL al bucket de Supabase
   */
  uploadFromUrl(request: S3UploadFromUrlRequest): Observable<S3UploadResponse> {
    const url = `${this.baseUrl}/s3fake/upload-from-url`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<S3UploadResponse>(url, request, { headers });
  }

  /**
   * Sube un archivo directamente desde el cliente
   */
  uploadFile(file: File): Observable<S3UploadResponse> {
    const url = `${this.baseUrl}/s3fake/upload`;
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<S3UploadResponse>(url, formData);
  }

  /**
   * Obtiene la URL de descarga de un archivo
   */
  getDownloadUrl(filename: string): string {
    return `${this.baseUrl}/s3fake/download/${filename}`;
  }

  /**
   * Obtiene la URL de streaming de un archivo de audio
   */
  getStreamUrl(filename: string): string {
    return `${this.baseUrl}/s3fake/stream/${filename}`;
  }
}
