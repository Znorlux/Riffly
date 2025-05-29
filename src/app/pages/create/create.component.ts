import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
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
    private promptGenerator: PromptGeneratorService
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

      // Preparar datos para el generador de prompts
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

      // Validar datos antes de generar el prompt
      const validation = this.promptGenerator.validatePromptData(musicData);
      if (!validation.isValid) {
        this.uiService.showNotification(
          `Error en los datos: ${validation.errors.join(', ')}`,
          'error'
        );
        return;
      }

      // Generar el prompt completo para la IA
      const generatedPrompt: GeneratedPrompt =
        this.promptGenerator.generateMusicPrompt(musicData);

      // Console.log con todos los datos del formulario y el prompt generado
      console.log('=== DATOS DEL FORMULARIO DE CREACIÓN ===');
      console.log('Método seleccionado:', this.selectedMethod);
      console.log(
        'Requiere PRO:',
        this.selectedMethod === 'style' ? 'SÍ - Imitación de estilo' : 'NO'
      );
      console.log('Datos del formulario:', {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        mood: formData.mood,
        tempo: formData.tempo,
        duration: formData.duration,
        durationFormatted: this.formatDuration(formData.duration),
        instruments: formData.instruments,
        lyrics: formData.lyrics,
        isPublic: formData.isPublic,
        allowCollaborations: formData.allowCollaborations,
      });

      console.log('\n=== PROMPT GENERADO PARA IA ===');
      console.log('Prompt completo:');
      console.log(generatedPrompt.fullPrompt);
      console.log('\n--- Secciones del prompt ---');
      console.log('Método:', generatedPrompt.sections.method);
      console.log('Estilo:', generatedPrompt.sections.style);
      console.log('Técnico:', generatedPrompt.sections.technical);
      console.log('Creativo:', generatedPrompt.sections.creative);
      console.log('Duración:', generatedPrompt.sections.duration);
      if (generatedPrompt.sections.instruments) {
        console.log('Instrumentos:', generatedPrompt.sections.instruments);
      }
      if (generatedPrompt.sections.lyrics) {
        console.log('Letras:', generatedPrompt.sections.lyrics);
      }

      console.log('\n--- Metadatos del prompt ---');
      console.log('Palabras:', generatedPrompt.metadata.wordCount);
      console.log('Complejidad:', generatedPrompt.metadata.complexity);
      console.log(
        'Tokens estimados:',
        generatedPrompt.metadata.estimatedTokens
      );

      console.log('\n--- Prompt simplificado ---');
      console.log(this.promptGenerator.generateSimplePrompt(musicData));
      console.log('==========================================');

      this.isGenerating = true;
      this.generationProgress = 0;

      // Simulación del progreso
      const progressInterval = setInterval(() => {
        this.generationProgress += Math.random() * 15;
        if (this.generationProgress >= 100) {
          this.generationProgress = 100;
          clearInterval(progressInterval);

          // Simular finalización después de un momento
          setTimeout(() => {
            this.isGenerating = false;
            this.generationProgress = 0;
            this.generatedPrompt = generatedPrompt;
            this.uiService.showNotification(
              'Canción generada exitosamente',
              'success'
            );
          }, 1000);
        }
      }, 200);

      // TODO: Implementar método generateSong en MusicService
      // this.musicService.generateSong({
      //   method: this.selectedMethod,
      //   ...formData
      // });
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
