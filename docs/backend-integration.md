# Integración Frontend-Backend - Generación de Música

## Resumen de la Implementación

Se ha implementado una integración completa entre el frontend Angular y el backend NestJS para generar música con IA. El flujo completo incluye:

1. **Generación de Prompt** → 2. **Llamada a Riffusion** → 3. **Guardado en Bucket** → 4. **Respuesta al Usuario**

## Arquitectura de Servicios

### 1. ApiService

**Archivo**: `src/app/services/api.service.ts`

**Responsabilidad**: Comunicación HTTP directa con el backend

- Endpoints de Riffusion
- Endpoints de S3Fake (Supabase Storage)
- Manejo de requests/responses

**Métodos principales**:

```typescript
generateMusic(params: RiffusionGenerateRequest): Observable<RiffusionGenerateResponse>
uploadFromUrl(request: S3UploadFromUrlRequest): Observable<S3UploadResponse>
```

### 2. PromptGeneratorService

**Archivo**: `src/app/services/prompt-generator.service.ts`

**Responsabilidad**: Conversión de datos de formulario a prompts optimizados

- Generación de prompts estructurados
- Validación de datos
- Cálculo de metadatos

### 3. MusicGenerationService

**Archivo**: `src/app/services/music-generation.service.ts`

**Responsabilidad**: Orquestación del flujo completo de generación

- Integración de todos los servicios
- Manejo de errores
- Logging detallado
- Optimización de parámetros para Riffusion

## Flujo de Generación Completo

### 1. Preparación de Datos

```typescript
const musicData: MusicGenerationData = {
  method: this.selectedMethod,
  title: formData.title,
  description: formData.description,
  genre: formData.genre,
  mood: formData.mood,
  tempo: formData.tempo,
  duration: formData.duration,
  instruments: formData.instruments || [],
  lyrics: formData.lyrics || "",
  isPublic: formData.isPublic,
  allowCollaborations: formData.allowCollaborations,
};
```

### 2. Generación y Optimización de Prompt

El `PromptGeneratorService` crea un prompt detallado que luego el `MusicGenerationService` optimiza para Riffusion:

**Prompt Original** (para documentación):

```
Genera una composición musical original basada en la descripción proporcionada.

Concepto creativo: Título "Sueños de Medianoche". Una balada melancólica...
Estilo: estructura pop comercial con melodías pegajosas con tono melancólico...
```

**Prompt Optimizado** (para Riffusion):

```
promptA: "pop melancólico with guitar and piano slow tempo"
promptB: "emotional atmospheric"
```

### 3. Parámetros Dinámicos de Riffusion

El sistema ajusta automáticamente los parámetros según el contenido:

```typescript
// Ejemplos de optimización automática
alpha: 0.3 - 0.7; // Según complejidad
denoising: 0.7 - 0.8; // Según género
steps: 40 - 60; // Según complejidad
seed_image_id: "vibes", "agile", "marim", "motorway"; // Según género
```

### 4. Guardado Automático

Los archivos se guardan automáticamente con nombres únicos:

- **Audio**: `{timestamp}-{randomId}-audio.wav`
- **Espectrograma**: `{timestamp}-{randomId}-spectrogram.png`

## Interfaces de Datos

### MusicGenerationData

```typescript
interface MusicGenerationData {
  method: string; // 'prompt' | 'melody' | 'lyrics' | 'style'
  title: string; // Título de la canción
  description: string; // Descripción creativa
  genre: string; // Género musical
  mood: string; // Estado de ánimo
  tempo: string; // Velocidad
  duration: number; // Duración en segundos
  instruments: string[]; // Instrumentos seleccionados
  lyrics?: string; // Letras (opcional)
  isPublic: boolean; // Configuración de privacidad
  allowCollaborations: boolean; // Configuración de colaboración
}
```

### MusicGenerationResult

```typescript
interface MusicGenerationResult {
  id: string; // ID único de la generación
  prompt: GeneratedPrompt; // Prompt completo generado
  riffusionResponse: RiffusionGenerateResponse; // Respuesta de la IA
  savedFiles: {
    audio: S3UploadResponse; // Archivo de audio guardado
    spectrogram: S3UploadResponse; // Imagen del espectrograma
  };
  metadata: {
    generationTime: number; // Tiempo total en ms
    totalFileSize: number; // Tamaño total de archivos
    status: "completed" | "failed" | "partial"; // Estado final
  };
}
```

## Uso en el Componente

### Inyección de Dependencias

```typescript
constructor(
  private musicGenerationService: MusicGenerationService
) {}
```

### Llamada Principal

```typescript
this.musicGenerationService
  .generateAndSaveMusic(musicData)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (result: MusicGenerationResult) => {
      console.log("URLs generadas:");
      console.log("Audio:", result.savedFiles.audio.publicUrl);
      console.log("Espectrograma:", result.savedFiles.spectrogram.publicUrl);
    },
    error: (error) => {
      console.error("Error:", error);
    },
  });
```

## Configuración Requerida

### Variables de Entorno del Backend

```env
REPLICATE_API_TOKEN=tu_token_de_replicate
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
PORT=3000
```

### CORS en el Backend

El backend debe estar configurado para permitir requests desde:

```
http://localhost:4200
```

### HttpClient en Angular

Ya configurado en `app.config.ts`:

```typescript
provideHttpClient();
```

## Logging y Debugging

### Console Output Esperado

```
=== INICIANDO GENERACIÓN CON BACKEND ===
Datos del formulario: { method: "prompt", title: "Mi Canción"... }

=== INICIANDO GENERACIÓN DE MÚSICA ===
ID de generación: 1703123456789-abc123def
Prompt generado: Genera una composición musical original...
Parámetros Riffusion: { promptA: "pop alegre with guitar", promptB: "upbeat energetic"... }

Respuesta de Riffusion: { id: "prediction-xyz", status: "succeeded"... }
Archivos guardados: { audio: { path: "...", publicUrl: "..." }... }

=== GENERACIÓN COMPLETADA ===
Resultado completo: { id: "...", prompt: {...}, savedFiles: {...}... }
URLs generadas:
  - Audio: https://supabase.../audio.wav
  - Espectrograma: https://supabase.../spectrogram.png
Tiempo total: 45230 ms
Estado: completed
```

## Manejo de Errores

### Errores Comunes y Soluciones

1. **Backend no disponible (CORS/Connection)**

   ```
   Error: HttpErrorResponse { status: 0, statusText: "Unknown Error" }
   ```

   **Solución**: Verificar que el backend esté corriendo en puerto 3000

2. **Token de Replicate inválido**

   ```
   Error: 401 Unauthorized from Riffusion
   ```

   **Solución**: Verificar REPLICATE_API_TOKEN en .env

3. **Error de Supabase Storage**

   ```
   Error: Failed to upload file to bucket
   ```

   **Solución**: Verificar SUPABASE_URL y SUPABASE_KEY

4. **Datos de formulario inválidos**
   ```
   Error en los datos: El título es requerido, El género es requerido
   ```
   **Solución**: Se valida automáticamente y muestra al usuario

## Optimizaciones Implementadas

### 1. Prompts Adaptativos

- Simplificación automática para Riffusion
- Selección de seed_image según género
- Ajuste de parámetros según complejidad

### 2. UX Mejorado

- Progreso visual durante generación
- Notificaciones informativas
- Logging detallado para debugging

### 3. Gestión de Estado

- Cleanup automático con `takeUntil(destroy$)`
- Manejo de estados de loading
- Recuperación de errores

## Próximos Pasos

Una vez que esta integración esté funcionando correctamente:

1. **Guardar en Base de Datos**: Crear registros de Song en la DB
2. **Reproductor de Audio**: Implementar player para las canciones generadas
3. **Galería de Resultados**: Mostrar canciones generadas en el dashboard
4. **Optimizaciones**: Cache, retry logic, compresión de archivos

## Testing

### Probar la Integración

1. Iniciar el backend: `npm run start:dev` (puerto 3000)
2. Iniciar el frontend: `ng serve` (puerto 4200)
3. Ir a `/create` en el frontend
4. Llenar el formulario y hacer clic en "Generar Música"
5. Verificar logs en consola del navegador
6. Verificar archivos generados en Supabase Storage

### Datos de Prueba Recomendados

```
Título: "Prueba de Conexión"
Descripción: "Una simple melodía para probar la integración"
Género: Pop
Estado de ánimo: Alegre
Tempo: Moderado
Duración: 60 segundos (mínimo para pruebas rápidas)
```
