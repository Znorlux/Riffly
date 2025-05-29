import { TestBed } from '@angular/core/testing';
import {
  PromptGeneratorService,
  MusicGenerationData,
} from './prompt-generator.service';

describe('PromptGeneratorService', () => {
  let service: PromptGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a complete prompt for pop ballad', () => {
    const mockData: MusicGenerationData = {
      method: 'prompt',
      title: 'Recuerdos de Otoño',
      description:
        'Una balada melancólica sobre recuerdos de amor perdido con guitarra acústica y piano suave',
      genre: 'pop',
      mood: 'Melancólico',
      tempo: 'slow',
      duration: 240,
      instruments: ['guitar', 'piano'],
      lyrics: '',
      isPublic: true,
      allowCollaborations: false,
    };

    const result = service.generateMusicPrompt(mockData);

    expect(result.fullPrompt).toContain('Recuerdos de Otoño');
    expect(result.fullPrompt).toContain('melancólico');
    expect(result.fullPrompt).toContain('pop');
    expect(result.sections.instruments).toContain('guitarra');
    expect(result.sections.instruments).toContain('piano');
    expect(result.metadata.complexity).toBe('moderate');
  });

  it('should generate a simple prompt', () => {
    const mockData: MusicGenerationData = {
      method: 'prompt',
      title: 'Energía Nocturna',
      description: 'Un tema electrónico enérgico para la pista de baile',
      genre: 'electronic',
      mood: 'Energético',
      tempo: 'fast',
      duration: 180,
      instruments: [],
      lyrics: '',
      isPublic: true,
      allowCollaborations: false,
    };

    const result = service.generateSimplePrompt(mockData);

    expect(result).toContain('electronic');
    expect(result).toContain('energético');
    expect(result).toContain('Energía Nocturna');
    expect(result).toContain('3 minutos');
  });

  it('should validate prompt data correctly', () => {
    const invalidData: MusicGenerationData = {
      method: 'prompt',
      title: '',
      description: '',
      genre: '',
      mood: '',
      tempo: '',
      duration: 10,
      instruments: [],
      lyrics: '',
      isPublic: true,
      allowCollaborations: false,
    };

    const validation = service.validatePromptData(invalidData);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
    expect(validation.errors).toContain('El título es requerido');
    expect(validation.errors).toContain('La descripción es requerida');
  });
});

// Ejemplo de uso en consola:
/*
EJEMPLO DE SALIDA ESPERADA:

=== DATOS DEL FORMULARIO DE CREACIÓN ===
Método seleccionado: prompt
Requiere PRO: NO

=== PROMPT GENERADO PARA IA ===
Prompt completo:
Genera una composición musical original basada en la descripción proporcionada.

Concepto creativo: Título "Sueños de Medianoche". Una balada melancólica con guitarra acústica que hable sobre recuerdos de juventud. Desarrolla este concepto musical manteniendo coherencia narrativa y emocional a lo largo de toda la composición.

Estilo: estructura pop comercial con melodías pegajosas con tono melancólico y reflexivo. Asegúrate de que todos los elementos musicales reflejen esta combinación estilística.

Especificaciones técnicas: tempo lento (70-90 BPM) ideal para baladas y piezas emotivas. Duración objetivo: 4:00 minutos con estructura musical completa (intro, versos, coro, bridge si aplica, outro).

Formato estándar (4:00): estructura completa con intro, verso, coro, puente y outro bien desarrollados.

Instrumentación destacada: guitarra, piano. Estos instrumentos deben tener presencia prominente en el arreglo, creando texturas ricas y complementarias entre sí.

Requiere: Composición musical completa, profesional y de alta calidad que cumpla todos los criterios especificados.

--- Metadatos del prompt ---
Palabras: 156
Complejidad: moderate
Tokens estimados: 203
*/
