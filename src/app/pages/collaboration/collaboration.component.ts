import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface CollaborativeUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  currentAction: string;
  color: string;
  isTyping?: boolean;
  cursor?: {
    section: string;
    position: number;
  };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'action' | 'system';
}

interface SongSection {
  id: string;
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';
  content: string;
  editedBy?: string;
  lastEdit: Date;
  suggestions: SongSuggestion[];
}

interface SongSuggestion {
  id: string;
  userId: string;
  userName: string;
  suggestion: string;
  approved: boolean;
  timestamp: Date;
}

interface LiveActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  section?: string;
}

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    IconComponent,
  ],
  templateUrl: './collaboration.component.html',
  styleUrls: ['./collaboration.component.css'],
})
export class CollaborationComponent implements OnInit, OnDestroy {
  // Datos hardcodeados para la demo
  collaborativeUsers: CollaborativeUser[] = [
    {
      id: '1',
      name: 'Tú',
      avatar: '/assets/avatars/you.jpg',
      status: 'online',
      currentAction: 'Editando intro',
      color: 'bg-yellow-500',
    },
    {
      id: '2',
      name: 'María González',
      avatar: '/assets/avatars/maria.jpg',
      status: 'online',
      currentAction: 'Escribiendo verse 2',
      color: 'bg-blue-500',
      isTyping: true,
    },
    {
      id: '3',
      name: 'Carlos Rivera',
      avatar: '/assets/avatars/carlos.jpg',
      status: 'online',
      currentAction: 'Revisando armonías',
      color: 'bg-green-500',
    },
    {
      id: '4',
      name: 'Ana López',
      avatar: '/assets/avatars/ana.jpg',
      status: 'away',
      currentAction: 'Última actividad: hace 2 min',
      color: 'bg-purple-500',
    },
    {
      id: '5',
      name: 'DJ Alex',
      avatar: '/assets/avatars/alex.jpg',
      status: 'busy',
      currentAction: 'Ajustando tempo',
      color: 'bg-red-500',
    },
  ];

  chatMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '2',
      userName: 'María González',
      message: '¡Me encanta cómo va quedando el intro!',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'message',
    },
    {
      id: '2',
      userId: 'system',
      userName: 'Sistema',
      message: 'Carlos Rivera se unió a la sesión',
      timestamp: new Date(Date.now() - 4 * 60000),
      type: 'system',
    },
    {
      id: '3',
      userId: '3',
      userName: 'Carlos Rivera',
      message: '¿Qué tal si cambiamos el tempo a 120 BPM?',
      timestamp: new Date(Date.now() - 3 * 60000),
      type: 'message',
    },
    {
      id: '4',
      userId: '5',
      userName: 'DJ Alex',
      message: '💡 Sugiero añadir un break antes del chorus',
      timestamp: new Date(Date.now() - 2 * 60000),
      type: 'message',
    },
    {
      id: '5',
      userId: '2',
      userName: 'María González',
      message: 'Trabajando en la melodía del verse 2...',
      timestamp: new Date(Date.now() - 1 * 60000),
      type: 'action',
    },
  ];

  songSections: SongSection[] = [
    {
      id: 'intro',
      type: 'intro',
      content: 'Suave melodía que despierta\nLa magia de una nueva historia...',
      editedBy: '1',
      lastEdit: new Date(Date.now() - 30000),
      suggestions: [],
    },
    {
      id: 'verse1',
      type: 'verse',
      content:
        'En esta noche estrellada\nDonde los sueños cobran vida\nCada nota es una promesa\nDe melodías infinitas',
      editedBy: '3',
      lastEdit: new Date(Date.now() - 2 * 60000),
      suggestions: [
        {
          id: 's1',
          userId: '2',
          userName: 'María',
          suggestion: '¿Y si cambiamos "noche estrellada" por "noche mágica"?',
          approved: false,
          timestamp: new Date(Date.now() - 1 * 60000),
        },
      ],
    },
    {
      id: 'chorus',
      type: 'chorus',
      content:
        'Vamos a crear, vamos a soñar\nJuntos en esta sinfonía\nNuestra música brillará\nComo luz en la oscuridad',
      editedBy: '2',
      lastEdit: new Date(Date.now() - 5 * 60000),
      suggestions: [],
    },
    {
      id: 'verse2',
      type: 'verse',
      content: '[María está escribiendo...]',
      editedBy: '2',
      lastEdit: new Date(),
      suggestions: [],
    },
  ];

  liveActivities: LiveActivity[] = [
    {
      id: '1',
      userId: '2',
      userName: 'María',
      action: 'editó el verse 2',
      timestamp: new Date(Date.now() - 15000),
      section: 'verse2',
    },
    {
      id: '2',
      userId: '3',
      userName: 'Carlos',
      action: 'sugirió cambio en armonía',
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: '3',
      userId: '5',
      userName: 'DJ Alex',
      action: 'ajustó el tempo a 118 BPM',
      timestamp: new Date(Date.now() - 90000),
    },
    {
      id: '4',
      userId: '1',
      userName: 'Tú',
      action: 'editaste el intro',
      timestamp: new Date(Date.now() - 120000),
      section: 'intro',
    },
  ];

  // Estado de la colaboración
  isRecording = false;
  currentBPM = 118;
  currentKey = 'C Major';
  playbackPosition = 0;
  totalDuration = 240; // 4 minutos
  isPlaying = false;

  // Chat
  newMessage = '';
  showEmojiPicker = false;

  // UI State
  selectedSection: string | null = null;
  showSuggestions = true;

  private intervals: number[] = [];

  ngOnInit(): void {
    this.startLiveSimulation();
  }

  ngOnDestroy(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
  }

  private startLiveSimulation(): void {
    // Simular actividad en tiempo real
    const activityInterval = setInterval(() => {
      this.simulateUserActivity();
    }, 8000) as unknown as number;

    const typingInterval = setInterval(() => {
      this.simulateTyping();
    }, 3000) as unknown as number;

    const progressInterval = setInterval(() => {
      if (this.isPlaying) {
        this.playbackPosition += 1;
        if (this.playbackPosition >= this.totalDuration) {
          this.playbackPosition = 0;
          this.isPlaying = false;
        }
      }
    }, 1000) as unknown as number;

    this.intervals.push(activityInterval, typingInterval, progressInterval);
  }

  private simulateUserActivity(): void {
    const actions = [
      'editó una sección',
      'sugirió un cambio',
      'ajustó la instrumentación',
      'modificó la armonía',
      'cambió el arreglo',
    ];

    const randomUser =
      this.collaborativeUsers[
        Math.floor(Math.random() * this.collaborativeUsers.length)
      ];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    if (randomUser.id !== '1') {
      // No simular actividad propia
      this.liveActivities.unshift({
        id: Date.now().toString(),
        userId: randomUser.id,
        userName: randomUser.name,
        action: randomAction,
        timestamp: new Date(),
      });

      // Mantener solo las últimas 10 actividades
      this.liveActivities = this.liveActivities.slice(0, 10);
    }
  }

  private simulateTyping(): void {
    this.collaborativeUsers.forEach((user) => {
      if (user.id !== '1' && Math.random() > 0.7) {
        user.isTyping = !user.isTyping;
      }
    });
  }

  // Métodos de interacción
  selectSection(sectionId: string): void {
    this.selectedSection =
      this.selectedSection === sectionId ? null : sectionId;
  }

  // Métodos helper para el template
  getOnlineUsersCount(): number {
    return this.collaborativeUsers.filter((u) => u.status === 'online').length;
  }

  getUserByEditedBy(editedBy: string): CollaborativeUser | undefined {
    return this.collaborativeUsers.find((u) => u.id === editedBy);
  }

  getUserNameByEditedBy(editedBy: string): string {
    const user = this.getUserByEditedBy(editedBy);
    return user?.name || 'Desconocido';
  }

  isUserTypingByEditedBy(editedBy: string): boolean {
    const user = this.getUserByEditedBy(editedBy);
    return user?.isTyping || false;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: '1',
        userName: 'Tú',
        message: this.newMessage,
        timestamp: new Date(),
        type: 'message',
      };

      this.chatMessages.push(message);
      this.newMessage = '';

      // Simular respuesta
      setTimeout(() => {
        const responses = [
          '¡Genial idea!',
          'Me gusta esa dirección',
          '¿Qué opinan los demás?',
          'Probemos eso',
          '🎵 Suena bien',
        ];

        const randomUser = this.collaborativeUsers.filter((u) => u.id !== '1')[
          Math.floor(Math.random() * 4)
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        this.chatMessages.push({
          id: (Date.now() + 1).toString(),
          userId: randomUser.id,
          userName: randomUser.name,
          message: randomResponse,
          timestamp: new Date(),
          type: 'message',
        });
      }, 2000);
    }
  }

  togglePlayback(): void {
    this.isPlaying = !this.isPlaying;
  }

  toggleRecording(): void {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      // Simular grabación
      setTimeout(() => {
        this.isRecording = false;
        this.addSystemMessage('Grabación añadida al proyecto');
      }, 5000);
    }
  }

  private addSystemMessage(message: string): void {
    this.chatMessages.push({
      id: Date.now().toString(),
      userId: 'system',
      userName: 'Sistema',
      message: message,
      timestamp: new Date(),
      type: 'system',
    });
  }

  approveSuggestion(suggestionId: string, sectionId: string): void {
    const section = this.songSections.find((s) => s.id === sectionId);
    if (section) {
      const suggestion = section.suggestions.find((s) => s.id === suggestionId);
      if (suggestion) {
        suggestion.approved = true;
        this.addSystemMessage(`Sugerencia de ${suggestion.userName} aprobada`);
      }
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'hace un momento';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`;
    return `hace ${Math.floor(seconds / 86400)} días`;
  }

  getUserColor(userId: string): string {
    const user = this.collaborativeUsers.find((u) => u.id === userId);
    return user?.color || 'bg-gray-500';
  }

  getSectionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      intro: 'Intro',
      verse: 'Verso',
      chorus: 'Estribillo',
      bridge: 'Puente',
      outro: 'Final',
    };
    return labels[type] || type;
  }

  // TrackBy functions para optimizar *ngFor
  trackBySection(index: number, section: SongSection): string {
    return section.id;
  }

  trackByActivity(index: number, activity: LiveActivity): string {
    return activity.id;
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return message.id;
  }
}
