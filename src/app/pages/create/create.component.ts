import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
        'Sube una canción de referencia para replicar su estilo (PRO)',
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
    { label: 'Muy lento (60-70 BPM)', value: 'very-slow' },
    { label: 'Lento (70-90 BPM)', value: 'slow' },
    { label: 'Moderado (90-120 BPM)', value: 'moderate' },
    { label: 'Rápido (120-140 BPM)', value: 'fast' },
    { label: 'Muy rápido (140+ BPM)', value: 'very-fast' },
  ];

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private musicService: MusicService,
    private promptGenerator: PromptGeneratorService,
    private musicGenerationService: MusicGenerationService,
    private tracksService: TracksService
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

      // Preparar datos para el generador de música
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

      console.log('=== INICIANDO GENERACIÓN CON BACKEND ===');
      console.log('Datos del formulario:', musicData);

      // Llamar al servicio de generación real
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
            console.log('ID de la canción:', result.id);
            console.log('Prompt utilizado:', result.prompt.fullPrompt);
            console.log('URLs generadas:');
            console.log('  - Audio:', result.savedFiles.audio.publicUrl);
            console.log(
              '  - Espectrograma:',
              result.savedFiles.spectrogram.publicUrl
            );
            console.log('Tiempo total:', result.metadata.generationTime, 'ms');
            console.log('Estado:', result.metadata.status);

            // Información del track creado en DB
            if (result.createdTrack && result.createdTrack.id) {
              console.log('=== TRACK GUARDADO EN BASE DE DATOS ===');
              console.log('ID del track en DB:', result.createdTrack.id);
              console.log(
                'Usuario propietario:',
                result.createdTrack.user.username
              );
              console.log(
                'URL pública del audio:',
                result.createdTrack.audioUrl
              );
              console.log(
                'URL del espectrograma:',
                result.createdTrack.spectrogramUrl
              );
              console.log('Género:', result.createdTrack.genre);
              console.log('Estado de ánimo:', result.createdTrack.mood);
              console.log('Tempo:', result.createdTrack.tempo);
              console.log(
                'Duración:',
                result.createdTrack.duration,
                'segundos'
              );
              console.log('Instrumentos:', result.createdTrack.instruments);
              console.log('Generado por IA:', result.createdTrack.aiGenerated);
              console.log(
                'Método de generación:',
                result.createdTrack.generationMethod
              );
            }

            // Guardar el resultado para mostrar en la UI
            this.generatedPrompt = result.prompt;

            // Finalizar proceso
            setTimeout(() => {
              this.isGenerating = false;
              this.generationProgress = 0;

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

            console.error('Error en la generación:', error);
            this.uiService.showNotification(
              'Error al generar la música. Por favor intenta de nuevo.',
              'error'
            );
          },
        });
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
      this.uiService.showNotification(
        `Archivo ${file.name} cargado correctamente`,
        'success'
      );
    }
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
