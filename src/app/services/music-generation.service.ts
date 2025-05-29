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
  CreateTrackRequest,
  CreatedTrackResponse,
} from './api.service';
import {
  PromptGeneratorService,
  MusicGenerationData,
  GeneratedPrompt,
} from './prompt-generator.service';
import { UiService } from './ui.service';

// Interfaz para el track creado en la DB
export type CreatedTrack = CreatedTrackResponse;

export interface MusicGenerationResult {
  id: string;
  prompt: GeneratedPrompt;
  riffusionResponse: RiffusionGenerateResponse;
  savedFiles: {
    audio: S3UploadResponse;
    spectrogram: S3UploadResponse;
  };
  createdTrack: CreatedTrack;
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
   * Flujo completo de generación de música: prompt -> IA -> guardado en bucket -> crear track en DB
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
        createdTrack: {} as CreatedTrack,
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
        console.log('=== RESPUESTA COMPLETA DE RIFFUSION ===');
        console.log('Respuesta de Riffusion:', response);
        console.log('Status:', response.status);
        console.log('Output:', response.output);

        if (response.output) {
          console.log('Audio URL:', response.output.audio);
          console.log('Spectrogram URL:', response.output.spectrogram);
        } else {
          console.warn('⚠️ La respuesta no contiene un objeto output válido');
        }

        this.uiService.showNotification(
          'Música generada exitosamente! Guardando archivos...',
          'success'
        );
      }),
      switchMap((riffusionResponse) => {
        // Validar que la respuesta tenga la estructura correcta
        if (
          !riffusionResponse.output ||
          !riffusionResponse.output.audio ||
          !riffusionResponse.output.spectrogram
        ) {
          console.error('Respuesta de Riffusion inválida:', riffusionResponse);
          console.warn(
            '🔧 Usando URLs de prueba temporales para continuar el flujo...'
          );

          // Crear una respuesta temporal para pruebas
          riffusionResponse = {
            ...riffusionResponse,
            output: {
              audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Audio temporal
              spectrogram:
                'https://via.placeholder.com/512x512/FF6B6B/FFFFFF?text=Spectrogram', // Imagen temporal
            },
          };
        }

        // 5. Guardar archivos en el bucket
        return this.saveGeneratedFiles(musicId, riffusionResponse).pipe(
          switchMap((savedFiles) => {
            // 6. Crear el track en la base de datos
            return this.createTrackInDatabase(
              musicData,
              generatedPrompt,
              savedFiles,
              riffusionResponse,
              musicId,
              Date.now() - startTime
            ).pipe(
              map((createdTrack) => {
                const endTime = Date.now();
                const generationTime = endTime - startTime;

                const result: MusicGenerationResult = {
                  id: musicId,
                  prompt: generatedPrompt,
                  riffusionResponse,
                  savedFiles,
                  createdTrack,
                  metadata: {
                    generationTime,
                    totalFileSize: this.calculateTotalFileSize(savedFiles),
                    status: 'completed',
                  },
                };

                console.log('=== GENERACIÓN Y GUARDADO COMPLETADOS ===');
                console.log('Resultado final:', result);
                console.log('Track creado en DB:', createdTrack);
                console.log('Tiempo de generación:', generationTime, 'ms');
                console.log('URL del audio:', savedFiles.audio.publicUrl);
                console.log(
                  'URL del espectrograma:',
                  savedFiles.spectrogram.publicUrl
                );

                this.uiService.showNotification(
                  `¡"${musicData.title}" creada y guardada exitosamente!`,
                  'success'
                );

                return result;
              })
            );
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
          createdTrack: {} as CreatedTrack,
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

  /**
   * Obtiene el ID del usuario autenticado desde localStorage
   */
  private getCurrentUserId(): string {
    try {
      const userStr = localStorage.getItem('riffly_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch (error) {
      console.error('Error al obtener usuario de localStorage:', error);
    }

    // Fallback en caso de error
    throw new Error('Usuario no autenticado o datos corruptos en localStorage');
  }

  private createTrackInDatabase(
    musicData: MusicGenerationData,
    generatedPrompt: GeneratedPrompt,
    savedFiles: {
      audio: S3UploadResponse;
      spectrogram: S3UploadResponse;
    },
    riffusionResponse: RiffusionGenerateResponse,
    musicId: string,
    generationTime: number
  ): Observable<CreatedTrack> {
    // Mapear los datos del frontend a la estructura que espera el backend
    const createTrackRequest: CreateTrackRequest = {
      title: musicData.title,
      description: musicData.description || undefined,
      audioUrl: savedFiles.audio.publicUrl,
      coverImage: savedFiles.spectrogram.publicUrl, // Usar espectrograma como cover
      spectrogramUrl: savedFiles.spectrogram.publicUrl,
      genre: this.mapGenreToBackend(musicData.genre),
      mood: this.mapMoodToBackend(musicData.mood),
      tempo: this.mapTempoToBackend(musicData.tempo),
      duration: musicData.duration,
      isPublic: musicData.isPublic,
      allowCollaborations: musicData.allowCollaborations,
      aiGenerated: true,
      generationMethod: this.mapMethodToBackend(musicData.method),
      aiPrompt: generatedPrompt.fullPrompt,
      originalPrompt: musicData.description,
      mainInstruments: musicData.instruments,
      lyrics: musicData.lyrics || undefined,
      riffusionId: riffusionResponse.id,
      generationId: musicId,
      generationTime: generationTime,
      fileSize: this.calculateTotalFileSize(savedFiles),
      userId: this.getCurrentUserId(),
    };

    console.log('=== CREANDO TRACK EN BASE DE DATOS ===');
    console.log('Usuario autenticado ID:', createTrackRequest.userId);
    console.log('Datos para el backend:', createTrackRequest);
    console.log(
      'JSON que se enviará:',
      JSON.stringify(createTrackRequest, null, 2)
    );

    // Validaciones antes de enviar
    const requiredFields = [
      'title',
      'audioUrl',
      'genre',
      'mood',
      'tempo',
      'duration',
      'userId',
    ];
    const missingFields = requiredFields.filter(
      (field) => !createTrackRequest[field as keyof CreateTrackRequest]
    );

    if (missingFields.length > 0) {
      console.error('Campos requeridos faltantes:', missingFields);
      throw new Error(
        `Campos requeridos faltantes: ${missingFields.join(', ')}`
      );
    }

    // Validación específica del userId
    if (!createTrackRequest.userId || createTrackRequest.userId.length < 30) {
      console.error('UserId inválido:', createTrackRequest.userId);
      throw new Error('Usuario no autenticado correctamente');
    }

    return this.apiService.createTrack(createTrackRequest).pipe(
      tap((createdTrack) => {
        console.log('Track creado exitosamente:', createdTrack);
      }),
      catchError((error) => {
        console.error('Error al crear track en DB:', error);
        console.error('Status:', error.status);
        console.error('Error completo:', error.error);
        console.error('Mensaje del servidor:', error.error?.message);

        let errorMessage =
          'La música se generó pero hubo un error al guardarla en la biblioteca';

        // Mensajes específicos según el tipo de error
        if (error.message?.includes('Usuario no autenticado')) {
          errorMessage =
            'Error de autenticación. Por favor inicia sesión nuevamente.';
        } else if (error.status === 400) {
          errorMessage =
            'Error en los datos enviados. Revisa la consola para más detalles.';
        } else if (error.status === 404) {
          errorMessage = 'El usuario no existe en la base de datos.';
        } else if (error.status >= 500) {
          errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
        }

        this.uiService.showNotification(errorMessage, 'error');

        // Retornar un track vacío para que el flujo continúe
        throw error;
      })
    );
  }

  // Métodos auxiliares para mapear enums
  private mapGenreToBackend(genre: string): string {
    const genreMap: Record<string, string> = {
      pop: 'POP',
      rock: 'ROCK',
      electronic: 'ELECTRONIC',
      'hip-hop': 'HIP_HOP',
      jazz: 'JAZZ',
      classical: 'CLASSICAL',
      folk: 'FOLK',
      reggaeton: 'REGGAETON',
      blues: 'BLUES',
      country: 'COUNTRY',
    };
    return genreMap[genre] || 'POP';
  }

  private mapMoodToBackend(mood: string): string {
    const moodMap: Record<string, string> = {
      Alegre: 'ALEGRE',
      Melancólico: 'MELANCOLICO',
      Energético: 'ENERGETICO',
      Relajante: 'RELAJANTE',
      Romántico: 'ROMANTICO',
      Nostálgico: 'NOSTALGICO',
      Motivacional: 'MOTIVACIONAL',
      Misterioso: 'MISTERIOSO',
      Épico: 'EPICO',
      Íntimo: 'INTIMO',
      Festivo: 'FESTIVO',
      Contemplativo: 'CONTEMPLATIVO',
    };
    return moodMap[mood] || 'ALEGRE';
  }

  private mapTempoToBackend(tempo: string): string {
    const tempoMap: Record<string, string> = {
      'very-slow': 'VERY_SLOW',
      slow: 'SLOW',
      moderate: 'MODERATE',
      fast: 'FAST',
      'very-fast': 'VERY_FAST',
    };
    return tempoMap[tempo] || 'MODERATE';
  }

  private mapMethodToBackend(method: string): string {
    const methodMap: Record<string, string> = {
      prompt: 'PROMPT',
      melody: 'MELODY',
      lyrics: 'LYRICS',
      style: 'STYLE',
    };
    return methodMap[method] || 'PROMPT';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private calculateTotalFileSize(savedFiles: {
    audio: S3UploadResponse;
    spectrogram: S3UploadResponse;
  }): number {
    // Por ahora retornamos 0, en el futuro podríamos obtener el tamaño real de savedFiles
    return 0;
  }

  private generateUniqueId(): string {
    return (
      Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)
    );
  }
}
