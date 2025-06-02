import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import {
  IconComponent,
  IconName,
} from '../../shared/components/icon/icon.component';
import { UiService } from '../../services/ui.service';
import { MusicService } from '../../services/music.service';
import {
  PromptGeneratorService,
  MusicGenerationData,
  GeneratedPrompt,
} from '../../services/prompt-generator.service';
import {
  MusicGenerationService,
  MusicGenerationResult,
} from '../../services/music-generation.service';
import { TracksService } from '../../services/tracks.service';
import { FileUploadService } from '../../services/file-upload.service';
import { MinimaxService } from '../../services/minimax.service';
import {
  TracksApiService,
  CreateTrackRequest,
} from '../../services/tracks-api.service';

interface CreationMethod {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
  recommended?: boolean;
}

interface Genre {
  id: string;
  name: string;
  color: string;
}

interface Instrument {
  id: string;
  name: string;
  icon: IconName;
}

interface FormData {
  title: string;
  description: string;
  genre: string;
  mood: string;
  tempo: string;
  duration: number;
  instruments: string[];
  lyrics: string;
  isPublic: boolean;
  allowCollaborations: boolean;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    IconComponent,
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  createForm: FormGroup;
  selectedMethod = 'prompt';
  isGenerating = false;
  generationProgress = 0;
  generatedPrompt: GeneratedPrompt | null = null;
  generationSuccess = false;
  generatedTrackTitle = '';

  // Para archivos de referencia
  selectedReferenceFile: File | null = null;
  referenceFileUrl: string | null = null;
  isUploadingFile = false;

  // Para el modal de ayuda de estructura de letras
  showLyricsHelpModal = false;

  // Opciones para método de referencia (archivo vs link)
  referenceInputType: 'file' | 'url' = 'file';
  referenceUrlInput = '';
  isValidatingUrl = false;

  // Botones de estructura de letras
  lyricsStructureTags = [
    {
      tag: '[intro]',
      label: 'Intro',
      description: 'Introducción de la canción',
    },
    { tag: '[verse]', label: 'Verse', description: 'Estrofa principal' },
    {
      tag: '[pre-chorus]',
      label: 'Pre-Chorus',
      description: 'Antecoro o pre-estribillo',
    },
    { tag: '[chorus]', label: 'Chorus', description: 'Estribillo o coro' },
    { tag: '[bridge]', label: 'Bridge', description: 'Puente musical' },
    { tag: '[outro]', label: 'Outro', description: 'Final de la canción' },
    { tag: '[solo]', label: 'Solo', description: 'Solo instrumental' },
    { tag: '[refrain]', label: 'Refrain', description: 'Estribillo corto' },
  ];

  creationMethods: CreationMethod[] = [
    {
      id: 'prompt',
      title: 'Descripción de texto',
      description: 'Describe tu canción en palabras y nuestra IA la creará',
      icon: 'edit',
      color: 'bg-blue-500',
      recommended: true,
    },
    {
      id: 'melody',
      title: 'Tararear melodía',
      description: 'Graba tu voz tarareando y la convertiremos en música',
      icon: 'microphone',
      color: 'bg-green-500',
    },
    {
      id: 'lyrics',
      title: 'Solo letras',
      description: 'Proporciona las letras y crearemos la música perfecta',
      icon: 'music',
      color: 'bg-purple-500',
    },
    {
      id: 'style',
      title: 'Imitación de estilo',
      description:
        'Sube una canción de referencia para replicar su estilo musical',
      icon: 'upload',
      color: 'bg-orange-500',
    },
  ];

  genres: Genre[] = [
    { id: 'pop', name: 'Pop', color: 'bg-pink-500' },
    { id: 'rock', name: 'Rock', color: 'bg-red-500' },
    { id: 'electronic', name: 'Electrónica', color: 'bg-cyan-500' },
    { id: 'hip-hop', name: 'Hip-Hop', color: 'bg-yellow-500' },
    { id: 'jazz', name: 'Jazz', color: 'bg-indigo-500' },
    { id: 'classical', name: 'Clásica', color: 'bg-gray-500' },
    { id: 'folk', name: 'Folk', color: 'bg-green-600' },
    { id: 'reggaeton', name: 'Reggaeton', color: 'bg-orange-600' },
    { id: 'blues', name: 'Blues', color: 'bg-blue-600' },
    { id: 'country', name: 'Country', color: 'bg-amber-600' },
  ];

  instruments: Instrument[] = [
    { id: 'guitar', name: 'Guitarra', icon: 'music' },
    { id: 'piano', name: 'Piano', icon: 'music' },
    { id: 'drums', name: 'Batería', icon: 'music' },
    { id: 'bass', name: 'Bajo', icon: 'music' },
    { id: 'violin', name: 'Violín', icon: 'music' },
    { id: 'saxophone', name: 'Saxofón', icon: 'music' },
    { id: 'trumpet', name: 'Trompeta', icon: 'music' },
    { id: 'synthesizer', name: 'Sintetizador', icon: 'music' },
  ];

  moods = [
    'Alegre',
    'Melancólico',
    'Energético',
    'Relajante',
    'Romántico',
    'Nostálgico',
    'Motivacional',
    'Misterioso',
    'Épico',
    'Íntimo',
    'Festivo',
    'Contemplativo',
  ];

  tempos = [
    { label: 'Muy lento (60-70 BPM)', value: 'VERY_SLOW' },
    { label: 'Lento (70-90 BPM)', value: 'SLOW' },
    { label: 'Moderado (90-120 BPM)', value: 'MODERATE' },
    { label: 'Rápido (120-140 BPM)', value: 'FAST' },
    { label: 'Muy rápido (140+ BPM)', value: 'VERY_FAST' },
  ];

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private musicService: MusicService,
    private promptGenerator: PromptGeneratorService,
    private musicGenerationService: MusicGenerationService,
    private tracksService: TracksService,
    private fileUploadService: FileUploadService,
    private minimaxService: MinimaxService,
    private tracksApiService: TracksApiService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      genre: ['', Validators.required],
      mood: ['', Validators.required],
      tempo: ['', Validators.required],
      duration: [
        180,
        [Validators.required, Validators.min(30), Validators.max(300)],
      ],
      instruments: [[]],
      lyrics: [''],
      isPublic: [true], // Por defecto público, cambiar a privado es función PRO
      allowCollaborations: [false], // Colaboraciones son función PRO
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectMethod(methodId: string): void {
    this.selectedMethod = methodId;
  }

  toggleInstrument(instrumentId: string): void {
    const currentInstruments = this.createForm.get('instruments')?.value || [];
    const index = currentInstruments.indexOf(instrumentId);

    if (index > -1) {
      currentInstruments.splice(index, 1);
    } else {
      currentInstruments.push(instrumentId);
    }

    this.createForm.patchValue({ instruments: currentInstruments });
  }

  isInstrumentSelected(instrumentId: string): boolean {
    const instruments = this.createForm.get('instruments')?.value || [];
    return instruments.includes(instrumentId);
  }

  onGenerate(): void {
    if (this.createForm.valid) {
      const formData = this.createForm.value;

      // Si es método "style" y tenemos archivo de referencia, usar MiniMax
      if (this.selectedMethod === 'style' && this.referenceFileUrl) {
        this.generateWithMiniMax(formData);
      } else {
        // Usar el método original para otros casos
        this.generateWithOriginalMethod(formData);
      }
    } else {
      this.uiService.showNotification(
        'Por favor completa todos los campos requeridos',
        'error'
      );
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.createForm.controls).forEach((key) => {
      const control = this.createForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.createForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['maxlength']) return 'Texto demasiado largo';
      if (field.errors['min']) return 'Valor mínimo no alcanzado';
      if (field.errors['max']) return 'Valor máximo excedido';
    }
    return '';
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Validar tamaño del archivo (máx. 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes
      if (file.size > maxSize) {
        this.uiService.showNotification(
          'El archivo es demasiado grande. Máximo 10MB permitido.',
          'error'
        );
        input.value = ''; // Limpiar el input
        return;
      }

      // Validar tipo de archivo - Solo MP3 y WAV
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (
        !allowedTypes.includes(fileType) &&
        !['mp3', 'wav'].includes(fileExtension || '')
      ) {
        this.uiService.showNotification(
          'Formato de archivo no soportado. Solo se permiten archivos MP3 y WAV.',
          'error'
        );
        input.value = ''; // Limpiar el input
        return;
      }

      // Archivo válido - proceder a subirlo
      this.selectedReferenceFile = file;
      this.uploadFileToS3(file);
    }
  }

  private uploadFileToS3(file: File): void {
    this.isUploadingFile = true;

    this.uiService.showNotification(
      `Subiendo archivo "${file.name}"...`,
      'info'
    );

    // Usar el servicio real de subida
    this.fileUploadService
      .uploadAudioFile(file)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isUploadingFile = false;
          this.referenceFileUrl = response.publicUrl;

          this.uiService.showNotification(
            `Archivo "${file.name}" subido correctamente (${(
              file.size /
              1024 /
              1024
            ).toFixed(2)} MB)`,
            'success'
          );

          console.log('Archivo de referencia subido:', {
            name: file.name,
            size: file.size,
            type: file.type,
            s3Url: this.referenceFileUrl,
            fileId: response.fileId,
          });
        },
        error: (error) => {
          this.isUploadingFile = false;
          this.selectedReferenceFile = null;
          this.referenceFileUrl = null;

          this.uiService.showNotification(
            `Error al subir archivo: ${error.message}`,
            'error'
          );
        },
      });
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Inserta una etiqueta de estructura en el textarea de descripción
   */
  insertLyricsTag(tag: string): void {
    const textarea = document.getElementById(
      'song-description'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = this.createForm.get('description')?.value || '';

    // Insertar la etiqueta en la posición del cursor
    let newValue = '';
    if (start === end) {
      // No hay selección, insertar en la posición del cursor
      newValue =
        currentValue.slice(0, start) + tag + '\n' + currentValue.slice(start);
    } else {
      // Hay texto seleccionado, reemplazarlo
      newValue =
        currentValue.slice(0, start) + tag + '\n' + currentValue.slice(end);
    }

    // Actualizar el formulario
    this.createForm.patchValue({ description: newValue });

    // Enfocar el textarea y posicionar el cursor después de la etiqueta
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + tag.length + 1; // +1 por el salto de línea
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  /**
   * Abre el modal de ayuda para estructura de letras
   */
  openLyricsHelpModal(): void {
    this.showLyricsHelpModal = true;
  }

  /**
   * Cierra el modal de ayuda para estructura de letras
   */
  closeLyricsHelpModal(): void {
    this.showLyricsHelpModal = false;
  }

  /**
   * Maneja el clic fuera del modal para cerrarlo
   */
  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeLyricsHelpModal();
    }
  }

  /**
   * Cambia el tipo de entrada de referencia entre archivo y URL
   */
  setReferenceInputType(type: 'file' | 'url'): void {
    this.referenceInputType = type;

    // Limpiar datos del tipo anterior
    if (type === 'url') {
      this.selectedReferenceFile = null;
      this.isUploadingFile = false;
    } else {
      this.referenceUrlInput = '';
      this.isValidatingUrl = false;
    }

    // Si cambiamos a archivo, también limpiar la URL de referencia
    if (type === 'file') {
      this.referenceFileUrl = null;
    }
  }

  /**
   * Valida y procesa la URL ingresada directamente
   */
  onUrlInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.referenceUrlInput = input.value.trim();

    if (this.referenceUrlInput) {
      this.validateAndSetReferenceUrl(this.referenceUrlInput);
    } else {
      this.referenceFileUrl = null;
    }
  }

  /**
   * Valida la URL y la establece como referencia
   */
  private validateAndSetReferenceUrl(url: string): void {
    // Validación básica de URL
    try {
      const urlObj = new URL(url);

      // Verificar que sea HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('La URL debe usar protocolo HTTP o HTTPS');
      }

      // Verificar que parezca un archivo de audio
      const pathname = urlObj.pathname.toLowerCase();
      const hasAudioExtension = ['.mp3', '.wav', '.m4a', '.aac'].some((ext) =>
        pathname.includes(ext)
      );

      if (
        !hasAudioExtension &&
        !url.includes('youtube') &&
        !url.includes('youtu.be')
      ) {
        console.warn(
          'La URL no parece ser un archivo de audio, pero se permitirá'
        );
      }

      // URL válida - establecerla como referencia
      this.referenceFileUrl = url;

      this.uiService.showNotification(
        'URL de referencia establecida correctamente',
        'success'
      );
    } catch {
      this.referenceFileUrl = null;
      this.uiService.showNotification(
        'URL inválida. Por favor ingresa una URL válida',
        'error'
      );
    }
  }

  private generateWithMiniMax(formData: FormData): void {
    // Validar que tenemos archivo de referencia
    if (!this.referenceFileUrl) {
      this.uiService.showNotification(
        'Debe subir un archivo de referencia para usar la imitación de estilo',
        'error'
      );
      return;
    }

    this.isGenerating = true;
    this.generationProgress = 0;

    // Simular progreso
    const progressInterval = setInterval(() => {
      if (this.generationProgress < 90) {
        this.generationProgress += Math.random() * 10;
      }
    }, 500);

    console.log('=== INICIANDO GENERACIÓN CON MINIMAX ===');

    // MiniMax solo recibe las lyrics (descripción del usuario) y el archivo de referencia
    const minimaxRequest = {
      promptA: formData.description, // Solo las lyrics que escribió el usuario
      promptB: this.referenceFileUrl, // URL del archivo de referencia
    };

    console.log('MiniMax request:', minimaxRequest);

    this.minimaxService
      .generateMusic(minimaxRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          clearInterval(progressInterval);
          this.generationProgress = 100;

          console.log('=== GENERACIÓN MINIMAX COMPLETADA ===');
          console.log('Resultado MiniMax:', result);

          // Ahora guardar la canción usando el endpoint real
          if (result.output) {
            this.saveGeneratedTrack(
              formData,
              result.output,
              formData.description
            );
          } else {
            throw new Error('No se generó archivo de audio');
          }
        },
        error: (error) => {
          clearInterval(progressInterval);
          this.isGenerating = false;
          this.generationProgress = 0;
          this.generationSuccess = false;

          console.error('Error en generación MiniMax:', error);
          this.uiService.showNotification(
            `Error al generar música: ${error.message}`,
            'error'
          );
        },
      });
  }

  private saveGeneratedTrack(
    formData: FormData,
    audioUrl: string,
    lyrics: string
  ): void {
    // Crear la request para el endpoint real de tracks
    const trackRequest: CreateTrackRequest = {
      title: formData.title,
      description: formData.description,
      audioUrl: audioUrl,
      genre: this.convertGenreToBackendFormat(formData.genre),
      mood: this.convertMoodToBackendFormat(formData.mood),
      tempo: formData.tempo,
      duration: formData.duration,
      isPublic: formData.isPublic,
      allowCollaborations: formData.allowCollaborations,
      aiGenerated: true,
      generationMethod: 'STYLE',
      aiPrompt: lyrics,
      originalPrompt: formData.description,
      mainInstruments: formData.instruments || [],
      lyrics: lyrics,
    };

    console.log('Guardando track con endpoint real:', trackRequest);

    // Llamar al endpoint real para crear el track
    this.tracksApiService
      .createTrack(trackRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdTrack) => {
          this.isGenerating = false;
          this.generationProgress = 0;
          this.generationSuccess = true;
          this.generatedTrackTitle = formData.title;

          console.log('=== TRACK CREADO EN BD ===');
          console.log('Track guardado:', createdTrack);

          this.uiService.showNotification(
            `¡"${formData.title}" creada y guardada exitosamente!`,
            'success'
          );

          // Agregar el track a la lista local
          this.tracksService.addTrack(createdTrack);
        },
        error: (error) => {
          this.isGenerating = false;
          this.generationProgress = 0;
          this.generationSuccess = false;

          console.error('Error al guardar track:', error);
          this.uiService.showNotification(
            `Error al guardar la canción: ${error.message}`,
            'error'
          );
        },
      });
  }

  private convertGenreToBackendFormat(genre: string): string {
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
    return genreMap[genre] || genre.toUpperCase();
  }

  private convertMoodToBackendFormat(mood: string): string {
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
    return moodMap[mood] || mood.toUpperCase();
  }

  private generateWithOriginalMethod(formData: FormData): void {
    // Método original que ya existía
    const musicData: MusicGenerationData = {
      method: this.selectedMethod,
      title: formData.title,
      description: formData.description,
      genre: formData.genre,
      mood: formData.mood,
      tempo: formData.tempo,
      duration: formData.duration,
      instruments: formData.instruments || [],
      lyrics: formData.lyrics || '',
      isPublic: formData.isPublic,
      allowCollaborations: formData.allowCollaborations,
    };

    // Iniciar el proceso de generación
    this.isGenerating = true;
    this.generationProgress = 0;

    // Simular progreso mientras se procesa
    const progressInterval = setInterval(() => {
      if (this.generationProgress < 90) {
        this.generationProgress += Math.random() * 10;
      }
    }, 500);

    console.log('=== INICIANDO GENERACIÓN CON BACKEND ORIGINAL ===');
    console.log('Datos del formulario:', musicData);

    // Llamar al servicio de generación original
    this.musicGenerationService
      .generateAndSaveMusic(musicData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: MusicGenerationResult) => {
          clearInterval(progressInterval);
          this.generationProgress = 100;

          // Log detallado del resultado
          console.log('=== GENERACIÓN COMPLETADA ===');
          console.log('Resultado completo:', result);

          // Guardar el resultado para mostrar en la UI
          this.generatedPrompt = result.prompt;

          // Finalizar proceso
          setTimeout(() => {
            this.isGenerating = false;
            this.generationProgress = 0;
            this.generationSuccess = true;
            this.generatedTrackTitle = musicData.title;

            // Mostrar notificación de éxito con información del track
            const trackMessage = result.createdTrack?.id
              ? `La canción se ha guardado en tu biblioteca (ID: ${result.createdTrack.id.substring(
                  0,
                  8
                )}...)`
              : 'La música se generó exitosamente';

            this.uiService.showNotification(
              `¡"${musicData.title}" creada exitosamente! ${trackMessage}`,
              'success'
            );

            // Agregar el track al servicio de tracks
            if (result.createdTrack && result.createdTrack.id) {
              this.tracksService.addTrack(result.createdTrack);
            }
          }, 1000);
        },
        error: (error: unknown) => {
          clearInterval(progressInterval);
          this.isGenerating = false;
          this.generationProgress = 0;
          this.generationSuccess = false;

          console.error('Error en la generación:', error);
          this.uiService.showNotification(
            'Error al generar la música. Por favor intenta de nuevo.',
            'error'
          );
        },
      });
  }
}
