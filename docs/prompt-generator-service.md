# PromptGeneratorService

## Descripción

El `PromptGeneratorService` es un servicio especializado en Angular que transforma los datos del formulario de creación musical en prompts optimizados para IA generativa. Este servicio modulariza la lógica de generación de prompts, siguiendo buenas prácticas de arquitectura de software.

## Arquitectura y Beneficios

### ¿Por qué un servicio separado?

1. **Separación de responsabilidades**: El componente se enfoca en la UI, el servicio en la lógica de negocio
2. **Testabilidad**: Fácil de testear de forma unitaria
3. **Reutilización**: Puede ser usado por otros componentes
4. **Mantenibilidad**: Cambios en la lógica de prompts no afectan la UI
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades de prompt

## Interfaces

### MusicGenerationData

```typescript
interface MusicGenerationData {
  method: string; // Método de creación ('prompt', 'melody', 'lyrics', 'style')
  title: string; // Título de la canción
  description: string; // Descripción creativa
  genre: string; // Género musical
  mood: string; // Estado de ánimo
  tempo: string; // Tempo/velocidad
  duration: number; // Duración en segundos
  instruments: string[]; // Instrumentos seleccionados
  lyrics?: string; // Letras (opcional)
  isPublic: boolean; // Privacidad
  allowCollaborations: boolean; // Colaboraciones
}
```

### GeneratedPrompt

```typescript
interface GeneratedPrompt {
  fullPrompt: string; // Prompt completo listo para IA
  sections: {
    // Secciones individuales del prompt
    method: string;
    style: string;
    technical: string;
    creative: string;
    duration: string;
    instruments?: string;
    lyrics?: string;
  };
  metadata: {
    // Información sobre el prompt
    wordCount: number;
    complexity: "simple" | "moderate" | "complex";
    estimatedTokens: number;
  };
}
```

## Métodos Principales

### generateMusicPrompt(data: MusicGenerationData): GeneratedPrompt

Genera un prompt completo y estructurado para IA musical.

**Ejemplo de uso:**

```typescript
const formData = this.createForm.value;
const musicData: MusicGenerationData = {
  method: this.selectedMethod,
  title: formData.title,
  description: formData.description,
  // ... resto de datos
};

const prompt = this.promptGenerator.generateMusicPrompt(musicData);
console.log(prompt.fullPrompt); // Prompt listo para IA
```

### generateSimplePrompt(data: MusicGenerationData): string

Genera un prompt simplificado para casos básicos.

**Ejemplo:**

```typescript
const simplePrompt = this.promptGenerator.generateSimplePrompt(musicData);
// Resultado: "Crea una canción pop melancólico de 4 minutos titulada 'Recuerdos de Otoño'. Una balada sobre amor perdido..."
```

### validatePromptData(data: MusicGenerationData): {isValid: boolean; errors: string[]}

Valida que los datos sean suficientes para generar un prompt válido.

## Estructura del Prompt Generado

El servicio construye prompts con las siguientes secciones:

1. **Método**: Instrucciones específicas según el tipo de creación
2. **Concepto Creativo**: Título y descripción integrados
3. **Estilo**: Combinación de género y estado de ánimo
4. **Especificaciones Técnicas**: Tempo y duración con contexto musical
5. **Formato de Duración**: Estructura musical según la duración
6. **Instrumentación** (opcional): Instrumentos destacados
7. **Letras** (opcional): Para el método de solo letras
8. **Requisitos Finales**: Criterios de calidad

## Ejemplo de Prompt Generado

### Entrada:

```json
{
  "method": "prompt",
  "title": "Sueños de Medianoche",
  "description": "Una balada melancólica con guitarra acústica sobre recuerdos de juventud",
  "genre": "pop",
  "mood": "Melancólico",
  "tempo": "slow",
  "duration": 240,
  "instruments": ["guitar", "piano"]
}
```

### Salida:

```
Genera una composición musical original basada en la descripción proporcionada.

Concepto creativo: Título "Sueños de Medianoche". Una balada melancólica con guitarra acústica sobre recuerdos de juventud. Desarrolla este concepto musical manteniendo coherencia narrativa y emocional a lo largo de toda la composición.

Estilo: estructura pop comercial con melodías pegajosas con tono melancólico y reflexivo. Asegúrate de que todos los elementos musicales reflejen esta combinación estilística.

Especificaciones técnicas: tempo lento (70-90 BPM) ideal para baladas y piezas emotivas. Duración objetivo: 4:00 minutos con estructura musical completa (intro, versos, coro, bridge si aplica, outro).

Formato estándar (4:00): estructura completa con intro, verso, coro, puente y outro bien desarrollados.

Instrumentación destacada: guitarra, piano. Estos instrumentos deben tener presencia prominente en el arreglo, creando texturas ricas y complementarias entre sí.

Requiere: Composición musical completa, profesional y de alta calidad que cumpla todos los criterios especificados.
```

## Metadatos del Prompt

El servicio también calcula metadatos útiles:

- **wordCount**: Número de palabras en el prompt
- **complexity**: Nivel de complejidad basado en instrumentos, letras y método
- **estimatedTokens**: Estimación de tokens para APIs de IA

## Niveles de Complejidad

- **Simple**: Prompts básicos sin instrumentos específicos ni letras
- **Moderate**: Incluye algunos instrumentos o duración extendida
- **Complex**: Incluye múltiples instrumentos, letras, o método de imitación de estilo

## Integración en el Componente

```typescript
// En create.component.ts
constructor(
  private promptGenerator: PromptGeneratorService
) {}

onGenerate(): void {
  if (this.createForm.valid) {
    const musicData: MusicGenerationData = {
      // Mapear datos del formulario
    };

    const validation = this.promptGenerator.validatePromptData(musicData);
    if (!validation.isValid) {
      // Manejar errores
      return;
    }

    const generatedPrompt = this.promptGenerator.generateMusicPrompt(musicData);

    // Usar prompt para llamar a la IA
    console.log(generatedPrompt.fullPrompt);
  }
}
```

## Testing

El servicio incluye pruebas unitarias que verifican:

- Generación correcta de prompts
- Validación de datos
- Metadatos precisos
- Manejo de casos edge

## Extensibilidad

El servicio está diseñado para ser fácilmente extensible:

1. **Nuevos métodos de creación**: Agregar casos en `generateMethodSection()`
2. **Nuevos géneros**: Expandir `genreDescriptions`
3. **Nuevos estados de ánimo**: Expandir `moodDescriptions`
4. **Nuevos formatos de salida**: Crear métodos adicionales como `generateAPIPrompt()`

## Futuras Mejoras

- Soporte para múltiples idiomas en prompts
- Prompts específicos para diferentes APIs de IA musical
- Cache de prompts generados frecuentemente
- Análisis de efectividad de prompts
- Personalización de plantillas de prompt por usuario PRO
