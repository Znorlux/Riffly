import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface MusicalGenre {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  characteristics: string[];
  instruments: string[];
  structure: string[];
  bpmRange: string;
  keySignatures: string[];
  promptTips: string[];
  examples: PromptExample[];
  subgenres: string[];
  famousArtists: string[];
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
}

interface PromptExample {
  title: string;
  prompt: string;
  explanation: string;
  tags: string[];
}

interface LearningCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  genres: string[];
}

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    IconComponent,
  ],
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css'],
})
export class LearningComponent implements OnInit {
  selectedCategory: string | null = null;
  selectedGenre: string | null = null;
  searchQuery = '';

  // Categorías de aprendizaje
  categories: LearningCategory[] = [
    {
      id: 'popular',
      name: 'Géneros Populares',
      icon: 'star',
      description: 'Los géneros más populares y versátiles para empezar',
      genres: ['pop', 'rock', 'indie', 'folk'],
    },
    {
      id: 'electronic',
      name: 'Música Electrónica',
      icon: 'music',
      description: 'Explora los sonidos sintéticos y ritmos electrónicos',
      genres: ['electronic', 'house', 'techno', 'ambient'],
    },
    {
      id: 'urban',
      name: 'Urbano y Rap',
      icon: 'microphone',
      description: 'Géneros urbanos con ritmos y lírica potente',
      genres: ['hiphop', 'trap', 'reggaeton', 'rnb'],
    },
    {
      id: 'classic',
      name: 'Clásicos y Jazz',
      icon: 'collection',
      description: 'Géneros tradicionales con técnicas avanzadas',
      genres: ['jazz', 'blues', 'classical', 'country'],
    },
  ];

  // Datos completos de géneros musicales
  musicalGenres: MusicalGenre[] = [
    {
      id: 'pop',
      name: 'Pop',
      description:
        'Música popular caracterizada por melodías pegajosas y estructuras accesibles',
      image: '/assets/genres/pop.jpg',
      color: 'bg-pink-500',
      characteristics: [
        'Melodías memorables y pegajosas',
        'Estructuras de canción simples',
        'Producción pulida y comercial',
        'Letras relacionables y emocionales',
        'Ritmos bailables',
      ],
      instruments: [
        'Vocal principal',
        'Piano/Teclados',
        'Guitarra eléctrica',
        'Bajo',
        'Batería',
        'Sintetizadores',
      ],
      structure: [
        'Intro',
        'Verso 1',
        'Pre-Estribillo',
        'Estribillo',
        'Verso 2',
        'Estribillo',
        'Puente',
        'Estribillo Final',
        'Outro',
      ],
      bpmRange: '120-140 BPM',
      keySignatures: ['C Major', 'G Major', 'D Major', 'A Minor', 'F Major'],
      promptTips: [
        'Enfócate en melodías simples y memorables',
        'Usa progresiones de acordes populares (vi-IV-I-V)',
        'Menciona elementos de producción moderna',
        'Incluye hooks vocales pegajosos',
        'Especifica un mood positivo y energético',
      ],
      examples: [
        {
          title: 'Pop Comercial Moderno',
          prompt:
            'Canción pop comercial con sintetizadores brillantes, batería electrónica, melodía vocal pegajosa en Do Mayor, 128 BPM, estilo radio-friendly con auto-tune sutil',
          explanation:
            'Este prompt combina elementos técnicos (tonalidad, BPM) con descriptores de producción modernos',
          tags: ['Comercial', 'Sintetizadores', 'Radio-friendly'],
        },
        {
          title: 'Pop Emotional',
          prompt:
            'Balada pop emotiva con piano principal, cuerdas sutiles, voz expresiva, progresión vi-IV-I-V, tempo lento 80 BPM, atmósfera melancólica pero esperanzadora',
          explanation:
            'Perfecto para canciones emotivas con enfoque en la melodía y sentimientos',
          tags: ['Emocional', 'Piano', 'Balada'],
        },
      ],
      subgenres: [
        'Teen Pop',
        'Synthpop',
        'Electropop',
        'Dance Pop',
        'Indie Pop',
      ],
      famousArtists: [
        'Taylor Swift',
        'Billie Eilish',
        'Dua Lipa',
        'Harry Styles',
        'Ariana Grande',
      ],
      difficulty: 'Principiante',
    },
    {
      id: 'rock',
      name: 'Rock',
      description:
        'Género energético basado en guitarras con ritmos poderosos y actitud rebelde',
      image: '/assets/genres/rock.jpg',
      color: 'bg-red-600',
      characteristics: [
        'Guitarras eléctricas distorsionadas como elemento principal',
        'Ritmos de batería potentes y definidos',
        'Estructuras de canción dinámicas',
        'Énfasis en la energía y la actitud',
        'Solos de guitarra expresivos',
      ],
      instruments: [
        'Guitarra eléctrica',
        'Bajo eléctrico',
        'Batería',
        'Voz',
        'Guitarra rítmica',
        'Ocasionalmente piano/órgano',
      ],
      structure: [
        'Intro de guitarra',
        'Verso 1',
        'Estribillo',
        'Verso 2',
        'Estribillo',
        'Solo de guitarra',
        'Puente',
        'Estribillo final',
      ],
      bpmRange: '110-160 BPM',
      keySignatures: ['E Minor', 'A Minor', 'D Major', 'G Major', 'B Minor'],
      promptTips: [
        'Especifica el nivel de distorsión de guitarra',
        'Menciona elementos de percusión potentes',
        'Incluye detalles sobre solos instrumentales',
        'Define la intensidad energética',
        'Usa términos como "driving", "powerful", "gritty"',
      ],
      examples: [
        {
          title: 'Rock Clásico',
          prompt:
            'Rock clásico con guitarra eléctrica distorsionada, riff principal en Mi menor, batería potente, bajo marcado, solo de guitarra bluesy, 140 BPM, energía alta estilo años 70',
          explanation:
            'Captura la esencia del rock clásico con elementos técnicos específicos',
          tags: ['Clásico', 'Distorsión', 'Solo de guitarra'],
        },
        {
          title: 'Rock Alternativo',
          prompt:
            'Rock alternativo moderno con guitarras limpias y distorsionadas, dinámica suave-fuerte, melodía vocal melancólica, 125 BPM, atmósfera nostálgica con toques de grunge',
          explanation:
            'Combina elementos dinámicos típicos del rock alternativo',
          tags: ['Alternativo', 'Dinámico', 'Grunge'],
        },
      ],
      subgenres: [
        'Hard Rock',
        'Alternative Rock',
        'Punk Rock',
        'Progressive Rock',
        'Classic Rock',
      ],
      famousArtists: [
        'The Beatles',
        'Led Zeppelin',
        'Queen',
        'AC/DC',
        'Nirvana',
      ],
      difficulty: 'Intermedio',
    },
    {
      id: 'electronic',
      name: 'Electronic',
      description:
        'Música creada principalmente con instrumentos electrónicos y tecnología digital',
      image: '/assets/genres/electronic.jpg',
      color: 'bg-cyan-500',
      characteristics: [
        'Sintetizadores y sonidos electrónicos',
        'Programación de batería y secuencias',
        'Efectos de audio y procesamiento digital',
        'Texturas sonoras experimentales',
        'Ritmos precisos y repetitivos',
      ],
      instruments: [
        'Sintetizadores',
        'Drum machines',
        'Samplers',
        'Software DAW',
        'Controladores MIDI',
        'Efectos digitales',
      ],
      structure: [
        'Intro ambient',
        'Build-up',
        'Drop/Main section',
        'Breakdown',
        'Build-up 2',
        'Main drop',
        'Outro',
      ],
      bpmRange: '120-150 BPM',
      keySignatures: ['A Minor', 'C Major', 'F# Minor', 'D Minor', 'G Major'],
      promptTips: [
        'Especifica tipos de sintetizadores (analog, digital, FM)',
        'Menciona efectos específicos (reverb, delay, filter)',
        'Incluye elementos de diseño sonoro',
        'Define la textura y atmósfera',
        'Usa términos técnicos de producción electrónica',
      ],
      examples: [
        {
          title: 'Ambient Electrónico',
          prompt:
            'Ambient electrónico con pads sintéticos cálidos, texturas de reverb espacial, secuencias arpeggiadas sutiles, 90 BPM, atmósfera meditativa y envolvente',
          explanation: 'Enfocado en crear atmósferas y texturas más que ritmos',
          tags: ['Ambient', 'Pads', 'Atmosférico'],
        },
        {
          title: 'Electronic Dance',
          prompt:
            'Electronic dance con sintetizador lead brillante, kick fuerte en cada tiempo, hi-hats sincopados, bajo sintetizado, build-ups dramáticos, 128 BPM, energía de club',
          explanation:
            'Orientado a la pista de baile con elementos rítmicos fuertes',
          tags: ['Dance', 'Club', 'Energético'],
        },
      ],
      subgenres: ['House', 'Techno', 'Trance', 'Dubstep', 'Ambient'],
      famousArtists: [
        'Daft Punk',
        'Aphex Twin',
        'Deadmau5',
        'Calvin Harris',
        'Skrillex',
      ],
      difficulty: 'Intermedio',
    },
    {
      id: 'jazz',
      name: 'Jazz',
      description:
        'Género sofisticado caracterizado por improvisación, armonías complejas y swing',
      image: '/assets/genres/jazz.jpg',
      color: 'bg-amber-600',
      characteristics: [
        'Improvisación como elemento central',
        'Armonías complejas y sofisticadas',
        'Ritmos sincopados y swing',
        'Instrumentos acústicos tradicionales',
        'Interacción musical entre músicos',
      ],
      instruments: [
        'Piano',
        'Trompeta',
        'Saxofón',
        'Contrabajo',
        'Batería jazz',
        'Guitarra jazz',
        'Trombón',
      ],
      structure: [
        'Tema principal',
        'Solos improvisados',
        'Trading (intercambio)',
        'Vuelta al tema',
        'Outro',
      ],
      bpmRange: '60-200 BPM (muy variable)',
      keySignatures: ['Bb Major', 'F Major', 'C Major', 'G Major', 'Eb Major'],
      promptTips: [
        'Enfócate en la improvisación y libertad musical',
        'Menciona armonías complejas (jazz chords)',
        'Incluye elementos de swing y sincopación',
        'Especifica instrumentos acústicos tradicionales',
        'Usa términos como "bebop", "cool", "fusion"',
      ],
      examples: [
        {
          title: 'Jazz Tradicional',
          prompt:
            'Jazz tradicional con piano, contrabajo walking, batería con escobillas, saxofón tenor melódico, progresión ii-V-I, swing suave, 120 BPM, atmósfera de club nocturno',
          explanation:
            'Captura la esencia del jazz clásico con elementos técnicos específicos',
          tags: ['Tradicional', 'Swing', 'Acústico'],
        },
        {
          title: 'Jazz Fusion',
          prompt:
            'Jazz fusion con guitarra eléctrica, teclados eléctricos, bajo eléctrico, batería compleja, elementos de rock, improvisación virtuosa, 140 BPM, energía progresiva',
          explanation: 'Combina jazz con elementos modernos y eléctricos',
          tags: ['Fusion', 'Eléctrico', 'Progresivo'],
        },
      ],
      subgenres: ['Bebop', 'Cool Jazz', 'Fusion', 'Smooth Jazz', 'Free Jazz'],
      famousArtists: [
        'Miles Davis',
        'John Coltrane',
        'Bill Evans',
        'Herbie Hancock',
        'Charlie Parker',
      ],
      difficulty: 'Avanzado',
    },
    {
      id: 'hiphop',
      name: 'Hip-Hop',
      description:
        'Cultura musical centrada en el rap, beats y elementos urbanos',
      image: '/assets/genres/hiphop.jpg',
      color: 'bg-purple-600',
      characteristics: [
        'Rap como vocal principal',
        'Beats repetitivos y groove fuerte',
        'Sampling y loops',
        'Énfasis en el ritmo y flow',
        'Cultura urbana y lírica consciente',
      ],
      instruments: [
        'Drum machine',
        'Sampler',
        'Turntables',
        'Bajo sintético',
        'Piano/Teclados',
        'Vocal rap',
      ],
      structure: [
        'Intro',
        'Verso 1',
        'Hook/Chorus',
        'Verso 2',
        'Hook',
        'Puente/Verso 3',
        'Hook',
        'Outro',
      ],
      bpmRange: '70-140 BPM',
      keySignatures: ['C Minor', 'D Minor', 'A Minor', 'F Minor', 'G Minor'],
      promptTips: [
        'Enfócate en el groove y pocket rítmico',
        'Menciona elementos de sampling',
        'Incluye características del flow vocal',
        'Especifica elementos de producción urbana',
        'Usa términos como "trap", "boom bap", "drill"',
      ],
      examples: [
        {
          title: 'Hip-Hop Clásico',
          prompt:
            'Hip-hop boom bap con samples de jazz, kick y snare marcados, hi-hats sutiles, bajo profundo, scratching de turntables, 95 BPM, vibe old school nostálgico',
          explanation: 'Estilo clásico del hip-hop con elementos tradicionales',
          tags: ['Boom bap', 'Sampling', 'Old school'],
        },
        {
          title: 'Trap Moderno',
          prompt:
            'Trap moderno con 808 potentes, hi-hats rápidos, snares con reverb, melodías de piano oscuras, autotune en vocal, 140 BPM, atmósfera urbana intensa',
          explanation:
            'Estilo contemporáneo del hip-hop con producción moderna',
          tags: ['Trap', '808', 'Urbano'],
        },
      ],
      subgenres: ['Boom Bap', 'Trap', 'Drill', 'Conscious Rap', 'Mumble Rap'],
      famousArtists: [
        'Kendrick Lamar',
        'J. Cole',
        'Drake',
        'Travis Scott',
        'Nas',
      ],
      difficulty: 'Intermedio',
    },
    {
      id: 'indie',
      name: 'Indie',
      description: 'Música independiente con enfoque artístico y experimental',
      image: '/assets/genres/indie.jpg',
      color: 'bg-green-500',
      characteristics: [
        'Producción lo-fi y artesanal',
        'Experimentación sonora',
        'Letras introspectivas y poéticas',
        'Instrumentación no convencional',
        'Estética DIY (Do It Yourself)',
      ],
      instruments: [
        'Guitarra acústica/eléctrica',
        'Sintetizadores vintage',
        'Batería minimalista',
        'Bajo',
        'Instrumentos poco convencionales',
      ],
      structure: [
        'Intro atmosférico',
        'Verso minimalista',
        'Estribillo melódico',
        'Verso',
        'Estribillo',
        'Puente experimental',
        'Final',
      ],
      bpmRange: '100-130 BPM',
      keySignatures: ['C Major', 'A Minor', 'F Major', 'D Minor', 'G Major'],
      promptTips: [
        'Enfócate en texturas y atmósferas únicas',
        'Menciona elementos lo-fi o vintage',
        'Incluye instrumentación experimental',
        'Especifica un mood introspectivo',
        'Usa términos como "dreamy", "ethereal", "nostalgic"',
      ],
      examples: [
        {
          title: 'Indie Folk',
          prompt:
            'Indie folk con guitarra acústica fingerpicking, armónica sutil, percusión minimalista, vocal íntimo, armonías vocales, 110 BPM, atmósfera cálida y nostálgica',
          explanation: 'Combina elementos folk con estética indie',
          tags: ['Folk', 'Acústico', 'Íntimo'],
        },
        {
          title: 'Indie Electronic',
          prompt:
            'Indie electronic con sintetizadores vintage, drum machine retro, guitarra con efectos, vocal etéreo, texturas ambientales, 115 BPM, vibe dreamy y melancólico',
          explanation: 'Fusiona elementos electrónicos con sensibilidad indie',
          tags: ['Electronic', 'Vintage', 'Dreamy'],
        },
      ],
      subgenres: [
        'Indie Rock',
        'Indie Folk',
        'Indie Pop',
        'Indie Electronic',
        'Lo-fi',
      ],
      famousArtists: [
        'Arctic Monkeys',
        'The Strokes',
        'Vampire Weekend',
        'Tame Impala',
        'Mac DeMarco',
      ],
      difficulty: 'Intermedio',
    },
    {
      id: 'folk',
      name: 'Folk',
      description:
        'Música tradicional y acústica con narrativa y simplicidad melódica',
      image: '/assets/genres/folk.jpg',
      color: 'bg-orange-600',
      characteristics: [
        'Instrumentación acústica y tradicional',
        'Narrativa lírica y storytelling',
        'Melodías simples y memorables',
        'Raíces culturales y tradición',
        'Enfoque en la voz y letra',
      ],
      instruments: [
        'Guitarra acústica',
        'Banjo',
        'Armónica',
        'Violín/Fiddle',
        'Mandolina',
        'Percusión simple',
      ],
      structure: [
        'Intro simple',
        'Verso 1',
        'Estribillo',
        'Verso 2',
        'Estribillo',
        'Puente narrativo',
        'Estribillo final',
      ],
      bpmRange: '90-130 BPM',
      keySignatures: ['G Major', 'D Major', 'C Major', 'A Minor', 'E Minor'],
      promptTips: [
        'Enfócate en la narrativa y storytelling',
        'Usa instrumentación acústica tradicional',
        'Menciona elementos de tradición y cultura',
        'Incluye melodías simples y pegajosas',
        'Especifica un ambiente íntimo y cálido',
      ],
      examples: [
        {
          title: 'Folk Tradicional',
          prompt:
            'Folk tradicional con guitarra acústica fingerpicking, armónica melódica, voz narrativa cálida, historia personal, 100 BPM, atmósfera íntima alrededor del fuego',
          explanation:
            'Captura la esencia del folk tradicional con storytelling',
          tags: ['Tradicional', 'Acústico', 'Narrativo'],
        },
        {
          title: 'Folk Moderno',
          prompt:
            'Folk moderno con guitarra acústica, banjo sutil, armonías vocales, letra introspectiva, producción orgánica, 110 BPM, vibe contemporáneo pero auténtico',
          explanation: 'Versión moderna del folk manteniendo la esencia',
          tags: ['Moderno', 'Introspectivo', 'Orgánico'],
        },
      ],
      subgenres: [
        'Traditional Folk',
        'Contemporary Folk',
        'Folk Rock',
        'Indie Folk',
        'Americana',
      ],
      famousArtists: [
        'Bob Dylan',
        'Joni Mitchell',
        'Neil Young',
        'Simon & Garfunkel',
        'Johnny Cash',
      ],
      difficulty: 'Principiante',
    },
  ];

  ngOnInit(): void {
    this.selectedCategory = 'popular';
    this.selectedGenre = 'pop';
  }

  // Métodos para la interfaz
  selectCategory(categoryId: string): void {
    console.log('Seleccionando categoría:', categoryId);
    this.selectedCategory = categoryId;
    const category = this.categories.find((c) => c.id === categoryId);
    if (category && category.genres.length > 0) {
      this.selectedGenre = category.genres[0];
      console.log('Género seleccionado automáticamente:', this.selectedGenre);
    }
  }

  selectGenre(genreId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    console.log('Seleccionando género:', genreId);
    console.log('Género anterior:', this.selectedGenre);
    this.selectedGenre = genreId;
    console.log('Género nuevo:', this.selectedGenre);
  }

  getCurrentCategory(): LearningCategory | undefined {
    return this.categories.find((c) => c.id === this.selectedCategory);
  }

  getCurrentGenre(): MusicalGenre | undefined {
    return this.musicalGenres.find((g) => g.id === this.selectedGenre);
  }

  getGenresForCategory(categoryId: string): MusicalGenre[] {
    const category = this.categories.find((c) => c.id === categoryId);
    if (!category) return [];

    return this.musicalGenres.filter((genre) =>
      category.genres.includes(genre.id)
    );
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Principiante':
        return 'text-green-500';
      case 'Intermedio':
        return 'text-yellow-500';
      case 'Avanzado':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  copyPrompt(prompt: string): void {
    navigator.clipboard.writeText(prompt).then(() => {
      // Aquí podrías mostrar una notificación de éxito
      console.log('Prompt copiado al portapapeles');
    });
  }

  // TrackBy functions para optimización
  trackByCategory(index: number, category: LearningCategory): string {
    return category.id;
  }

  trackByGenre(index: number, genre: MusicalGenre): string {
    return genre.id;
  }

  trackByExample(index: number, example: PromptExample): string {
    return example.title;
  }
}
