import { Injectable } from '@angular/core';

export interface MusicGenerationData {
  method: string;
  title: string;
  description: string;
  genre: string;
  mood: string;
  tempo: string;
  duration: number;
  instruments: string[];
  lyrics?: string;
  isPublic: boolean;
  allowCollaborations: boolean;
}

export interface GeneratedPrompt {
  fullPrompt: string;
  sections: {
    method: string;
    style: string;
    technical: string;
    creative: string;
    duration: string;
    instruments?: string;
    lyrics?: string;
  };
  metadata: {
    wordCount: number;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedTokens: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PromptGeneratorService {
  /**
   * Genera un prompt completo y optimizado para IA musical
   */
  generateMusicPrompt(data: MusicGenerationData): GeneratedPrompt {
    const sections = this.buildPromptSections(data);
    const fullPrompt = this.assembleFullPrompt(sections);
    const metadata = this.calculateMetadata(fullPrompt, data);

    return {
      fullPrompt,
      sections,
      metadata,
    };
  }

  private buildPromptSections(data: MusicGenerationData) {
    return {
      method: this.generateMethodSection(data.method),
      style: this.generateStyleSection(data.genre, data.mood),
      technical: this.generateTechnicalSection(data.tempo, data.duration),
      creative: this.generateCreativeSection(data.title, data.description),
      duration: this.generateDurationSection(data.duration),
      instruments:
        data.instruments.length > 0
          ? this.generateInstrumentsSection(data.instruments)
          : undefined,
      lyrics: data.lyrics ? this.generateLyricsSection(data.lyrics) : undefined,
    };
  }

  private generateMethodSection(method: string): string {
    const methodInstructions = {
      prompt:
        'Genera una composición musical original basada en la descripción proporcionada.',
      melody:
        'Crea una canción que capture la esencia melódica descrita, con armonías ricas y estructura musical coherente.',
      lyrics:
        'Compón música que complemente perfectamente las letras proporcionadas, creando una unión armoniosa entre texto y melodía.',
      style:
        'Replica el estilo musical de la referencia, manteniendo las características distintivas del género y la época.',
    };

    return (
      methodInstructions[method as keyof typeof methodInstructions] ||
      methodInstructions['prompt']
    );
  }

  private generateStyleSection(genre: string, mood: string): string {
    const genreDescriptions = {
      pop: 'estructura pop comercial con melodías pegajosas',
      rock: 'energía rock con guitarra prominente y ritmo potente',
      electronic:
        'sonidos electrónicos modernos con sintetizadores y beats programados',
      'hip-hop': 'base rítmica hip-hop con samples creativos',
      jazz: 'improvisación jazz con armonías complejas',
      classical: 'orquestación clásica con instrumentos tradicionales',
      folk: 'simplicidad folk con instrumentos acústicos',
      reggaeton: 'ritmo reggaeton característico con dembow',
      blues: 'estructura blues con progresiones tradicionales',
      country: 'estilo country con narrativa emotiva',
    };

    const moodDescriptions = {
      Alegre: 'atmósfera alegre y optimista',
      Melancólico: 'tono melancólico y reflexivo',
      Energético: 'energía alta y ritmo dinámico',
      Relajante: 'ambiente relajante y tranquilo',
      Romántico: 'sentimiento romántico y emotivo',
      Nostálgico: 'nostalgia y recuerdos del pasado',
      Motivacional: 'inspiración y motivación',
      Misterioso: 'atmósfera misteriosa e intrigante',
      Épico: 'grandiosidad épica y cinematográfica',
      Íntimo: 'intimidad y cercanía emocional',
      Festivo: 'celebración y ambiente festivo',
      Contemplativo: 'reflexión profunda y contemplación',
    };

    const genreDesc =
      genreDescriptions[genre as keyof typeof genreDescriptions] ||
      'estilo musical versátil';
    const moodDesc =
      moodDescriptions[mood as keyof typeof moodDescriptions] ||
      'ambiente equilibrado';

    return `Estilo: ${genreDesc} con ${moodDesc}. Asegúrate de que todos los elementos musicales reflejen esta combinación estilística.`;
  }

  private generateTechnicalSection(tempo: string, duration: number): string {
    const tempoDescriptions = {
      'very-slow':
        'tempo muy lento (60-70 BPM) para crear una sensación contemplativa',
      slow: 'tempo lento (70-90 BPM) ideal para baladas y piezas emotivas',
      moderate: 'tempo moderado (90-120 BPM) perfecto para groove y melodías',
      fast: 'tempo rápido (120-140 BPM) para energía y movimiento',
      'very-fast': 'tempo muy rápido (140+ BPM) para máxima intensidad',
    };

    const tempoDesc =
      tempoDescriptions[tempo as keyof typeof tempoDescriptions] ||
      'tempo apropiado';
    const durationMin = Math.floor(duration / 60);
    const durationSec = duration % 60;

    return `Especificaciones técnicas: ${tempoDesc}. Duración objetivo: ${durationMin}:${durationSec
      .toString()
      .padStart(
        2,
        '0'
      )} minutos con estructura musical completa (intro, versos, coro, bridge si aplica, outro).`;
  }

  private generateCreativeSection(title: string, description: string): string {
    return `Concepto creativo: Título "${title}". ${description} Desarrolla este concepto musical manteniendo coherencia narrativa y emocional a lo largo de toda la composición.`;
  }

  private generateDurationSection(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    if (duration <= 120) {
      return `Formato corto (${minutes}:${seconds
        .toString()
        .padStart(
          2,
          '0'
        )}): estructura concisa con intro rápida, desarrollo principal y outro efectivo.`;
    } else if (duration <= 240) {
      return `Formato estándar (${minutes}:${seconds
        .toString()
        .padStart(
          2,
          '0'
        )}): estructura completa con intro, verso, coro, puente y outro bien desarrollados.`;
    } else {
      return `Formato extendido (${minutes}:${seconds
        .toString()
        .padStart(
          2,
          '0'
        )}): composición elaborada con múltiples secciones, desarrollos instrumentales y variaciones temáticas.`;
    }
  }

  private generateInstrumentsSection(instruments: string[]): string {
    const instrumentNames = {
      guitar: 'guitarra',
      piano: 'piano',
      drums: 'batería',
      bass: 'bajo',
      violin: 'violín',
      saxophone: 'saxofón',
      trumpet: 'trompeta',
      synthesizer: 'sintetizador',
    };

    const translatedInstruments = instruments.map(
      (inst) => instrumentNames[inst as keyof typeof instrumentNames] || inst
    );

    return `Instrumentación destacada: ${translatedInstruments.join(
      ', '
    )}. Estos instrumentos deben tener presencia prominente en el arreglo, creando texturas ricas y complementarias entre sí.`;
  }

  private generateLyricsSection(lyrics: string): string {
    return `Letras proporcionadas: "${lyrics}". La música debe complementar el flujo natural, la métrica y el contenido emocional de estas letras, creando una unión perfecta entre texto y melodía.`;
  }

  private assembleFullPrompt(sections: {
    method: string;
    style: string;
    technical: string;
    creative: string;
    duration: string;
    instruments?: string;
    lyrics?: string;
  }): string {
    const {
      method,
      style,
      technical,
      creative,
      duration,
      instruments,
      lyrics,
    } = sections;

    let prompt = `${method}\n\n${creative}\n\n${style}\n\n${technical}\n\n${duration}`;

    if (instruments) {
      prompt += `\n\n${instruments}`;
    }

    if (lyrics) {
      prompt += `\n\n${lyrics}`;
    }

    prompt +=
      '\n\nRequiere: Composición musical completa, profesional y de alta calidad que cumpla todos los criterios especificados.';

    return prompt;
  }

  private calculateMetadata(prompt: string, data: MusicGenerationData) {
    const wordCount = prompt.split(/\s+/).length;
    const estimatedTokens = Math.ceil(wordCount * 1.3); // Aproximación de tokens

    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';

    if (data.instruments.length > 3 || data.lyrics || data.method === 'style') {
      complexity = 'complex';
    } else if (data.instruments.length > 0 || data.duration > 180) {
      complexity = 'moderate';
    }

    return {
      wordCount,
      complexity,
      estimatedTokens,
    };
  }

  /**
   * Genera un prompt simplificado para casos donde se necesita menos detalle
   */
  generateSimplePrompt(data: MusicGenerationData): string {
    const genre = data.genre;
    const mood = data.mood;
    const duration = Math.floor(data.duration / 60);

    return `Crea una canción ${genre} ${mood.toLowerCase()} de ${duration} minutos titulada "${
      data.title
    }". ${data.description}`;
  }

  /**
   * Valida que los datos sean suficientes para generar un prompt
   */
  validatePromptData(data: MusicGenerationData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('El título es requerido');
    }

    if (!data.description?.trim()) {
      errors.push('La descripción es requerida');
    }

    if (!data.genre) {
      errors.push('El género es requerido');
    }

    if (!data.mood) {
      errors.push('El estado de ánimo es requerido');
    }

    if (!data.tempo) {
      errors.push('El tempo es requerido');
    }

    if (data.duration < 30 || data.duration > 300) {
      errors.push('La duración debe estar entre 30 segundos y 5 minutos');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
