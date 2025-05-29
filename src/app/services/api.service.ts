import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RiffusionGenerateRequest {
  promptA: string;
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
  id: string;
  filename: string;
  publicUrl: string;
  fullPath: string;
}

// Nueva interfaz para crear tracks
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
  generationMethod?: string;
  aiPrompt?: string;
  originalPrompt?: string;
  mainInstruments: string[];
  lyrics?: string;
  riffusionId?: string;
  generationId?: string;
  generationTime?: number;
  fileSize?: number;
  userId: string; // Por ahora hardcodeado, en producción vendría del JWT
}

// Interfaz para la respuesta de track creado
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

  /**
   * Crea un nuevo track en la base de datos
   */
  createTrack(request: CreateTrackRequest): Observable<CreatedTrackResponse> {
    const url = `${this.baseUrl}/tracks`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<CreatedTrackResponse>(url, request, { headers });
  }

  /**
   * Obtiene las canciones del usuario autenticado
   */
  getMyTracks(): Observable<CreatedTrackResponse[]> {
    const token = localStorage.getItem('riffly_token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `${this.baseUrl}/tracks/my-tracks`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<CreatedTrackResponse[]>(url, { headers });
  }

  /**
   * Actualiza un track existente (solo el propietario)
   */
  updateTrack(
    trackId: string,
    request: Partial<CreateTrackRequest>
  ): Observable<CreatedTrackResponse> {
    const token = localStorage.getItem('riffly_token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `${this.baseUrl}/tracks/${trackId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<CreatedTrackResponse>(url, request, { headers });
  }

  /**
   * Elimina un track (solo el propietario)
   */
  deleteTrack(trackId: string): Observable<void> {
    const token = localStorage.getItem('riffly_token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const url = `${this.baseUrl}/tracks/${trackId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<void>(url, { headers });
  }
}
