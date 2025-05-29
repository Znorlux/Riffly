import { Injectable } from '@angular/core';
import {
  Observable,
  forkJoin,
  switchMap,
  map,
  tap,
  catchError,
  of,
} from 'rxjs';
import {
  ApiService,
  RiffusionGenerateRequest,
  RiffusionGenerateResponse,
  S3UploadResponse,
} from './api.service';
import {
  PromptGeneratorService,
  MusicGenerationData,
  GeneratedPrompt,
} from './prompt-generator.service';
import { UiService } from './ui.service';

export interface MusicGenerationResult {
  id: string;
  prompt: GeneratedPrompt;
  riffusionResponse: RiffusionGenerateResponse;
  savedFiles: {
    audio: S3UploadResponse;
    spectrogram: S3UploadResponse;
  };
  metadata: {
    generationTime: number;
    totalFileSize: number;
    status: 'completed' | 'failed' | 'partial';
  };
}

@Injectable({
  providedIn: 'root',
})
export class MusicGenerationService {
  constructor(
    private apiService: ApiService,
    private promptGenerator: PromptGeneratorService,
    private uiService: UiService
  ) {}

  /**
   * Flujo completo de generación de música: prompt -> IA -> guardado en bucket
   */
  generateAndSaveMusic(
    musicData: MusicGenerationData
  ): Observable<MusicGenerationResult> {
    const startTime = Date.now();
    const musicId = this.generateUniqueId();

    // 1. Validar datos
    const validation = this.promptGenerator.validatePromptData(musicData);
    if (!validation.isValid) {
      this.uiService.showNotification(
        `Error en los datos: ${validation.errors.join(', ')}`,
        'error'
      );
      return of({
        id: musicId,
        prompt: {} as GeneratedPrompt,
        riffusionResponse: {} as RiffusionGenerateResponse,
        savedFiles: {
          audio: {} as S3UploadResponse,
          spectrogram: {} as S3UploadResponse,
        },
        metadata: {
          generationTime: 0,
          totalFileSize: 0,
          status: 'failed' as const,
        },
      });
    }

    // 2. Generar prompt optimizado
    const generatedPrompt = this.promptGenerator.generateMusicPrompt(musicData);

    // 3. Convertir prompt a parámetros de Riffusion
    const riffusionParams = this.convertPromptToRiffusionParams(
      generatedPrompt,
      musicData
    );

    console.log('=== INICIANDO GENERACIÓN DE MÚSICA ===');
    console.log('ID de generación:', musicId);
    console.log('Prompt generado:', generatedPrompt.fullPrompt);
    console.log('Parámetros Riffusion:', riffusionParams);

    // 4. Llamar a la API de generación
    return this.apiService.generateMusic(riffusionParams).pipe(
      tap((response) => {
        console.log('Respuesta de Riffusion:', response);
        this.uiService.showNotification(
          'Música generada exitosamente! Guardando archivos...',
          'success'
        );
      }),
      switchMap((riffusionResponse) => {
        // 5. Guardar archivos en el bucket
        return this.saveGeneratedFiles(musicId, riffusionResponse).pipe(
          map((savedFiles) => {
            const endTime = Date.now();
            const generationTime = endTime - startTime;

            const result: MusicGenerationResult = {
              id: musicId,
              prompt: generatedPrompt,
              riffusionResponse,
              savedFiles,
              metadata: {
                generationTime,
                totalFileSize: this.calculateTotalFileSize(savedFiles),
                status: 'completed',
              },
            };

            console.log('=== GENERACIÓN COMPLETADA ===');
            console.log('Resultado final:', result);
            console.log('Tiempo de generación:', generationTime, 'ms');
            console.log('URL del audio:', savedFiles.audio.publicUrl);
            console.log(
              'URL del espectrograma:',
              savedFiles.spectrogram.publicUrl
            );

            this.uiService.showNotification(
              `¡Música "${musicData.title}" creada exitosamente!`,
              'success'
            );

            return result;
          })
        );
      }),
      catchError((error) => {
        console.error('Error en la generación:', error);
        this.uiService.showNotification(
          'Error al generar la música. Por favor intenta de nuevo.',
          'error'
        );

        return of({
          id: musicId,
          prompt: generatedPrompt,
          riffusionResponse: {} as RiffusionGenerateResponse,
          savedFiles: {
            audio: {} as S3UploadResponse,
            spectrogram: {} as S3UploadResponse,
          },
          metadata: {
            generationTime: Date.now() - startTime,
            totalFileSize: 0,
            status: 'failed' as const,
          },
        });
      })
    );
  }

  /**
   * Convierte el prompt generado a parámetros específicos de Riffusion
   */
  private convertPromptToRiffusionParams(
    prompt: GeneratedPrompt,
    musicData: MusicGenerationData
  ): RiffusionGenerateRequest {
    // Usar el prompt principal como promptA
    const mainPrompt = this.createMainPrompt(prompt, musicData);

    // Crear un prompt secundario para la mezcla
    const secondaryPrompt = this.createSecondaryPrompt(musicData);

    // Configurar parámetros según la complejidad
    const alpha = this.calculateAlpha(prompt.metadata.complexity);
    const denoising = this.calculateDenoising(musicData);
    const steps = this.calculateInferenceSteps(prompt.metadata.complexity);

    return {
      promptA: mainPrompt,
      promptB: secondaryPrompt,
      alpha: alpha,
      denoising: denoising,
      seed_image_id: this.selectSeedImage(musicData.genre),
      num_inference_steps: steps,
    };
  }

  private createMainPrompt(
    prompt: GeneratedPrompt,
    musicData: MusicGenerationData
  ): string {
    // Crear un prompt conciso pero efectivo para Riffusion
    const genre = musicData.genre;
    const mood = musicData.mood.toLowerCase();
    const tempo = this.mapTempoToBPM(musicData.tempo);

    let mainPrompt = `${genre} ${mood}`;

    if (musicData.instruments.length > 0) {
      const primaryInstruments = musicData.instruments.slice(0, 2); // Solo los 2 principales
      mainPrompt += ` with ${primaryInstruments.join(' and ')}`;
    }

    mainPrompt += ` ${tempo}`;

    return mainPrompt;
  }

  private createSecondaryPrompt(musicData: MusicGenerationData): string {
    // Prompt secundario para crear variación y riqueza
    const moodVariations: Record<string, string> = {
      Alegre: 'upbeat energetic',
      Melancólico: 'emotional atmospheric',
      Energético: 'dynamic powerful',
      Relajante: 'calm ambient',
      Romántico: 'soft melodic',
      Nostálgico: 'vintage warm',
      Motivacional: 'inspiring uplifting',
      Misterioso: 'dark mysterious',
      Épico: 'cinematic grand',
      Íntimo: 'intimate close',
      Festivo: 'celebratory festive',
      Contemplativo: 'meditative peaceful',
    };

    return moodVariations[musicData.mood] || 'ambient melodic';
  }

  private calculateAlpha(
    complexity: 'simple' | 'moderate' | 'complex'
  ): number {
    // Alpha controla la mezcla entre los dos prompts
    switch (complexity) {
      case 'simple':
        return 0.7; // Más peso al prompt principal
      case 'moderate':
        return 0.5; // Balance equilibrado
      case 'complex':
        return 0.3; // Más influencia del prompt secundario
      default:
        return 0.5;
    }
  }

  private calculateDenoising(musicData: MusicGenerationData): number {
    // Denoising según el género y duración
    const baseDenoise = 0.75;

    if (musicData.genre === 'classical' || musicData.genre === 'jazz') {
      return 0.8; // Más denoise para géneros complejos
    }

    if (musicData.duration > 240) {
      return 0.7; // Menos denoise para canciones largas
    }

    return baseDenoise;
  }

  private calculateInferenceSteps(
    complexity: 'simple' | 'moderate' | 'complex'
  ): number {
    // Más pasos para mayor calidad en prompts complejos
    switch (complexity) {
      case 'simple':
        return 40;
      case 'moderate':
        return 50;
      case 'complex':
        return 60;
      default:
        return 50;
    }
  }

  private selectSeedImage(genre: string): string {
    // Diferentes seed images según el género
    const seedImages: Record<string, string> = {
      electronic: 'vibes',
      rock: 'agile',
      jazz: 'marim',
      classical: 'motorway',
      'hip-hop': 'vibes',
      pop: 'agile',
      folk: 'marim',
      reggaeton: 'vibes',
      blues: 'marim',
      country: 'motorway',
    };

    return seedImages[genre] || 'vibes';
  }

  private mapTempoToBPM(tempo: string): string {
    const tempoMap: Record<string, string> = {
      'very-slow': 'slow tempo',
      slow: 'slow ballad',
      moderate: 'medium tempo',
      fast: 'fast tempo',
      'very-fast': 'rapid beat',
    };

    return tempoMap[tempo] || 'medium tempo';
  }

  /**
   * Guarda los archivos generados (audio y espectrograma) en el bucket
   */
  private saveGeneratedFiles(
    musicId: string,
    riffusionResponse: RiffusionGenerateResponse
  ): Observable<{
    audio: S3UploadResponse;
    spectrogram: S3UploadResponse;
  }> {
    const audioUpload = this.apiService.uploadFromUrl({
      url: riffusionResponse.output.audio,
      id: `${musicId}-audio`,
    });

    const spectrogramUpload = this.apiService.uploadFromUrl({
      url: riffusionResponse.output.spectrogram,
      id: `${musicId}-spectrogram`,
    });

    return forkJoin({
      audio: audioUpload,
      spectrogram: spectrogramUpload,
    }).pipe(
      tap((result) => {
        console.log('Archivos guardados:', result);
      })
    );
  }

  private calculateTotalFileSize(_savedFiles: {
    audio: S3UploadResponse;
    spectrogram: S3UploadResponse;
  }): number {
    // Por ahora retornamos 0, en el futuro podríamos obtener el tamaño real
    return 0;
  }

  private generateUniqueId(): string {
    return (
      Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)
    );
  }
}
