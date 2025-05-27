import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { UiService } from '../../services/ui.service';

interface FollowedArtist {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  isVerified: boolean;
  followersCount: number;
  songsCount: number;
  genres: string[];
  bio: string;
  isFollowing: boolean;
  isOnline: boolean;
  lastActive: string;
  latestSong?: {
    title: string;
    duration: string;
    plays: number;
    coverImage: string;
    createdAt: string;
  };
}

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent, IconComponent],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FollowingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  followedArtists: FollowedArtist[] = [
    {
      id: '1',
      name: 'Elena Rodriguez',
      username: '@elenabeats',
      avatar: 'https://avatar.vercel.sh/Pepita',
      coverImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
      isVerified: true,
      followersCount: 12500,
      songsCount: 89,
      genres: ['Electronic', 'Ambient', 'Chillwave'],
      bio: 'Creando paisajes sonoros que conectan el alma con la naturaleza digital.',
      isFollowing: true,
      isOnline: true,
      lastActive: 'Ahora',
      latestSong: {
        title: 'Midnight Reflections',
        duration: '3:42',
        plays: 2340,
        coverImage:
          'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&h=150&fit=crop',
        createdAt: '2024-01-15',
      },
    },
    {
      id: '2',
      name: 'Marcus Chen',
      username: '@marcusvibes',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      coverImage:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=200&fit=crop',
      isVerified: true,
      followersCount: 8750,
      songsCount: 134,
      genres: ['Hip-Hop', 'R&B', 'Neo-Soul'],
      bio: 'Fusionando ritmos clásicos con sonidos contemporáneos.',
      isFollowing: true,
      isOnline: false,
      lastActive: 'Hace 2 horas',
      latestSong: {
        title: 'Urban Dreams',
        duration: '4:15',
        plays: 5680,
        coverImage:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
        createdAt: '2024-01-14',
      },
    },
    {
      id: '3',
      name: 'Sophia Williams',
      username: '@sophiasynth',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      coverImage:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      isVerified: false,
      followersCount: 3420,
      songsCount: 47,
      genres: ['Synthwave', 'Retrowave', 'Electronic'],
      bio: 'Reviviendo los 80s con un toque moderno y futurista.',
      isFollowing: true,
      isOnline: true,
      lastActive: 'Ahora',
      latestSong: {
        title: 'Neon Nights',
        duration: '5:23',
        plays: 1890,
        coverImage:
          'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=150&h=150&fit=crop',
        createdAt: '2024-01-13',
      },
    },
    {
      id: '4',
      name: 'David Kim',
      username: '@davidmelody',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      coverImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
      isVerified: true,
      followersCount: 15200,
      songsCount: 203,
      genres: ['Indie Folk', 'Acoustic', 'Alternative'],
      bio: 'Contando historias a través de melodías íntimas y letras profundas.',
      isFollowing: true,
      isOnline: false,
      lastActive: 'Hace 1 día',
      latestSong: {
        title: 'Whispered Secrets',
        duration: '3:56',
        plays: 4320,
        coverImage:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
        createdAt: '2024-01-12',
      },
    },
    {
      id: '5',
      name: 'Luna Martinez',
      username: '@lunabeats',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
      coverImage:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      isVerified: false,
      followersCount: 6890,
      songsCount: 78,
      genres: ['Latin', 'Reggaeton', 'Pop'],
      bio: 'Mezclando ritmos latinos con beats modernos para crear magia musical.',
      isFollowing: true,
      isOnline: true,
      lastActive: 'Ahora',
    },
    {
      id: '6',
      name: 'Alex Thompson',
      username: '@alexrock',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      coverImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
      isVerified: true,
      followersCount: 22100,
      songsCount: 156,
      genres: ['Rock', 'Alternative', 'Grunge'],
      bio: 'Guitarrista y compositor explorando los límites del rock moderno.',
      isFollowing: true,
      isOnline: false,
      lastActive: 'Hace 3 horas',
    },
  ];

  filteredArtists: FollowedArtist[] = [];
  searchQuery = '';
  selectedFilter = 'all'; // all, online, recent-activity

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.filteredArtists = [...this.followedArtists];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFollow(artist: FollowedArtist): void {
    artist.isFollowing = !artist.isFollowing;
    if (artist.isFollowing) {
      this.uiService.showNotification(
        `Ahora sigues a ${artist.name}`,
        'success'
      );
    } else {
      this.uiService.showNotification(
        `Dejaste de seguir a ${artist.name}`,
        'info'
      );
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.followedArtists];

    // Filtro por búsqueda
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (artist) =>
          artist.name.toLowerCase().includes(query) ||
          artist.username.toLowerCase().includes(query) ||
          artist.genres.some((genre) => genre.toLowerCase().includes(query))
      );
    }

    // Filtro por estado
    switch (this.selectedFilter) {
      case 'online':
        filtered = filtered.filter((artist) => artist.isOnline);
        break;
      case 'recent-activity':
        filtered = filtered.filter(
          (artist) =>
            artist.lastActive === 'Ahora' ||
            artist.lastActive.includes('horas') ||
            artist.latestSong
        );
        break;
    }

    this.filteredArtists = filtered;
  }

  playLatestSong(artist: FollowedArtist): void {
    if (artist.latestSong) {
      this.uiService.showNotification(
        `Reproduciendo: ${artist.latestSong.title}`,
        'info'
      );
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }

  trackArtist(index: number, artist: FollowedArtist): string {
    return artist.id;
  }
}
