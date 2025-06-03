import { MusicFilter } from '../../models/song.model';

export const APP_CONFIG = {
  name: 'Riffly',
  version: '1.0.0',
  description: 'Tu Comunidad Musical con IA',
} as const;

export const ROUTES = {
  HOME: '',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SETTINGS: 'settings',
} as const;

export const MUSIC_FILTERS: MusicFilter[] = [
  { type: 'staff-picks', label: 'Staff Picks', active: true },
  { type: 'today', label: 'Today', active: false },
  { type: 'week', label: 'Week', active: false },
  { type: 'month', label: 'Month', active: false },
  { type: 'all', label: 'All', active: false },
  { type: 'live', label: 'Live', active: false },
];

export const SIDEBAR_MENU = {
  EXPLORE: [
    {
      id: 'featured',
      label: 'Destacados',
      icon: 'star',
      route: '/dashboard',
      active: true,
    },
    {
      id: 'following',
      label: 'Siguiendo',
      icon: 'users',
      route: '/following',
      active: false,
    },
    {
      id: 'collaboration',
      label: 'Colaboración',
      icon: 'collaboration',
      route: '/collaboration',
      active: false,
    },
    {
      id: 'personalize',
      label: 'Personalizar',
      icon: 'eye',
      route: '/personalize',
      active: false,
    },
    {
      id: 'youtube-download',
      label: 'Descarga de YouTube',
      icon: 'youtube',
      route: '/youtube-download',
      active: false,
    },
    {
      id: 'learning',
      label: 'Aprendizaje',
      route: '/learning',
      icon: 'help-circle',
    },
  ],
  LIBRARY: [
    {
      id: 'my-tracks',
      label: 'Mis Canciones',
      icon: 'music',
      route: '/my-tracks',
      active: false,
    },
    {
      id: 'songs',
      label: 'Songs',
      icon: 'music',
      route: '/library/songs',
      active: false,
    },
    {
      id: 'vibes',
      label: 'Vibes',
      icon: 'chat',
      route: '/library/vibes',
      active: false,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'list',
      route: '/library/projects',
      active: false,
    },
    {
      id: 'playlists',
      label: 'Playlists',
      icon: 'collection',
      route: '/library/playlists',
      active: false,
    },
  ],
} as const;

export const PLACEHOLDER_IMAGES = {
  SONG_COVER: 'https://placehold.co/400x400/333/yellow?text=Cover',
  USER_AVATAR: 'https://placehold.co/100x100/333/yellow?text=User',
  AI_AVATAR: 'https://placehold.co/100x100/333/yellow?text=AI',
} as const;

export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.7,
  FADE_DURATION: 1000,
  SUPPORTED_FORMATS: ['mp3', 'wav', 'ogg', 'flac'],
} as const;

export const USER_ROLES = [
  {
    value: 'AFICIONADO',
    label: 'Aficionado',
    description: 'Disfruta y descubre nueva música',
  },
  {
    value: 'PROFESIONAL',
    label: 'Profesional',
    description: 'Músico o artista profesional',
  },
  {
    value: 'PRODUCTOR',
    label: 'Productor',
    description: 'Produce y mezcla música',
  },
  {
    value: 'COMPOSITOR',
    label: 'Compositor',
    description: 'Crea y compone música original',
  },
] as const;

export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Ingresa un email válido',
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    MESSAGE:
      'El username debe tener entre 3-30 caracteres y solo contener letras, números y guiones bajos',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: 'La contraseña debe tener al menos 8 caracteres',
  },
  BIO: {
    MAX_LENGTH: 500,
    MESSAGE: 'La biografía no puede exceder 500 caracteres',
  },
} as const;
