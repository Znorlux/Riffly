import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private songsSubject = new BehaviorSubject<Song[]>([]);
  public songs$ = this.songsSubject.asObservable();

  private featuredSongsSubject = new BehaviorSubject<Song[]>([]);
  public featuredSongs$ = this.featuredSongsSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  public currentSong$ = this.currentSongSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    const mockSongs: Song[] = [
      {
        id: '1',
        title: 'Summer Vibes',
        coverImage: 'songs/spirit.jpg',
        creator: {
          name: 'MelodyMaster',
          avatar: 'https://placehold.co/100x100/333/yellow?text=MM',
        },
        tags: ['Lo-fi', 'Chill', 'Summer'],
        duration: '3:25',
        plays: 12500,
        likes: 840,
        isLiked: false,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Neon Dreams',
        coverImage: 'songs/jaws.jpg',
        creator: {
          name: 'BeatCrafter',
          avatar: 'https://placehold.co/100x100/333/yellow?text=BC',
        },
        tags: ['Synthwave', 'Electronic'],
        duration: '4:10',
        plays: 8300,
        likes: 620,
        isLiked: true,
        createdAt: new Date('2024-01-14'),
      },
      {
        id: '3',
        title: 'Urban Rhythm',
        coverImage: 'songs/amanecer.jpg',
        creator: {
          name: 'UrbanSound',
          avatar: 'https://placehold.co/100x100/333/yellow?text=US',
        },
        tags: ['Hip-hop', 'Jazz'],
        duration: '2:55',
        plays: 6200,
        likes: 410,
        isLiked: false,
        createdAt: new Date('2024-01-13'),
      },
      {
        id: '4',
        title: 'Cosmic Journey',
        coverImage: 'songs/running.jpg',
        creator: {
          name: 'SpaceBeats',
          avatar: 'https://placehold.co/100x100/333/yellow?text=SB',
        },
        tags: ['Ambient', 'Space', 'Chill'],
        duration: '5:30',
        plays: 15200,
        likes: 1240,
        isLiked: true,
        createdAt: new Date('2024-01-12'),
      },
    ];

    this.songsSubject.next(mockSongs);
    this.featuredSongsSubject.next(mockSongs.slice(0, 2));
  }

  getSongs(): Observable<Song[]> {
    return this.songs$;
  }

  getFeaturedSongs(): Observable<Song[]> {
    return this.featuredSongs$;
  }

  getSongById(id: string): Song | undefined {
    return this.songsSubject.value.find((song) => song.id === id);
  }

  toggleLike(songId: string): void {
    const songs = this.songsSubject.value;
    const songIndex = songs.findIndex((song) => song.id === songId);

    if (songIndex !== -1) {
      const updatedSongs = [...songs];
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        isLiked: !updatedSongs[songIndex].isLiked,
        likes: updatedSongs[songIndex].isLiked
          ? updatedSongs[songIndex].likes - 1
          : updatedSongs[songIndex].likes + 1,
      };
      this.songsSubject.next(updatedSongs);
    }
  }

  playSong(song: Song): void {
    this.currentSongSubject.next(song);
    // Aquí irá la lógica de reproducción cuando conectes con el backend
  }

  pauseSong(): void {
    // Lógica de pausa
  }

  generateMusic(prompt: string): Observable<Song> {
    // Aquí irá la lógica de generación con IA
    // Por ahora retornamos un mock
    return new Observable((observer) => {
      setTimeout(() => {
        const newSong: Song = {
          id: Date.now().toString(),
          title: `Generated: ${prompt}`,
          coverImage: 'https://placehold.co/400x400/333/yellow?text=AI',
          creator: {
            name: 'AI Generator',
            avatar: 'https://placehold.co/100x100/333/yellow?text=AI',
          },
          tags: ['AI Generated'],
          duration: '3:00',
          plays: 0,
          likes: 0,
          isLiked: false,
          createdAt: new Date(),
        };
        observer.next(newSong);
        observer.complete();
      }, 2000);
    });
  }
}
