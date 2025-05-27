// src/app/components/song-list/song-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Song } from '../../models/song.model';
import { SongItemComponent } from '../song-item/song-item.component';
import { MusicService } from '../../services/music.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, SongItemComponent],
  template: `
    <div class="space-y-2">
      <div *ngIf="loading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"
        ></div>
      </div>

      <div
        *ngIf="!loading && songs.length === 0"
        class="text-center py-8 text-gray-400"
      >
        <p>No se encontraron canciones</p>
      </div>

      <app-song-item
        *ngFor="let song of songs; let i = index"
        [song]="song"
        [index]="i"
        (playEvent)="onPlaySong($event)"
        (likeEvent)="onLikeSong($event)"
      >
      </app-song-item>
    </div>
  `,
})
export class SongListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  songs: Song[] = [];
  loading = false;

  constructor(
    private musicService: MusicService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de loading
    this.uiService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    // Suscribirse a las canciones
    this.musicService
      .getSongs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((songs) => {
        this.songs = songs;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPlaySong(song: Song): void {
    this.musicService.playSong(song);
  }

  onLikeSong(songId: string): void {
    this.musicService.toggleLike(songId);
  }
}
