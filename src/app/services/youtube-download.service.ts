import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface YouTubeDownloadRequest {
  url: string;
}

export interface YouTubeDownloadResponse {
  success: boolean;
  audioUrl: string;
  title: string;
  duration: string;
}

@Injectable({
  providedIn: 'root',
})
export class YouTubeDownloadService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Descarga una canción de YouTube y la guarda en Supabase
   */
  downloadFromYouTube(url: string): Observable<YouTubeDownloadResponse> {
    const request: YouTubeDownloadRequest = { url };

    return this.http.post<YouTubeDownloadResponse>(
      `${this.apiUrl}/youtube/download`,
      request
    );
  }

  /**
   * Valida si una URL de YouTube es válida
   */
  isValidYouTubeUrl(url: string): boolean {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)[\w-]+(&[\w=]*)?$/;
    return youtubeRegex.test(url);
  }

  /**
   * Extrae el ID del video de una URL de YouTube
   */
  extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
