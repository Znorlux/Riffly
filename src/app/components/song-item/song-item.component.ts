// src/app/components/song-item/song-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-song-item',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex items-center p-3 hover:bg-gray-800 rounded-lg group">
      <div class="mr-4 text-gray-500 w-6 text-center">
        {{ index + 1 }}
      </div>
      <div class="relative mr-4 w-16 h-16 flex-shrink-0">
        <img
          [src]="song.coverImage"
          alt="Cover image"
          class="w-full h-full object-cover rounded-md"
        />
        <button
          (click)="playPause()"
          class="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <app-icon name="play" size="8" customClass="text-yellow-500">
          </app-icon>
        </button>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-white font-medium truncate">{{ song.title }}</h3>
        <div class="flex items-center text-sm text-gray-400">
          <img
            [src]="song.creator.avatar"
            alt="Creator"
            class="w-5 h-5 rounded-full mr-2"
          />
          <span>{{ song.creator.name }}</span>
          <span class="mx-2">•</span>
          <span>{{ song.tags.join(', ') }}</span>
        </div>
      </div>
      <div class="ml-4 flex items-center">
        <div class="flex items-center mr-4 text-gray-400 text-sm">
          <app-icon name="clock" size="4" customClass="mr-1"></app-icon>
          {{ song.duration }}
        </div>
        <div class="flex items-center mr-4 text-gray-400 text-sm">
          <app-icon name="views" size="4" customClass="mr-1"></app-icon>
          {{ song.plays | number }}
        </div>
        <button
          (click)="toggleLike()"
          class="mr-3 transition-colors duration-200"
          [class.text-red-500]="song.isLiked"
          [class.text-gray-400]="!song.isLiked"
          [class.hover:text-red-400]="!song.isLiked"
          [class.hover:text-red-600]="song.isLiked"
        >
          <app-icon [name]="song.isLiked ? 'heart-filled' : 'heart'" size="5">
          </app-icon>
          <span class="ml-1 text-xs">{{ song.likes | number }}</span>
        </button>
        <button class="text-gray-400 hover:text-white">
          <app-icon name="dots" size="5"></app-icon>
        </button>
      </div>
    </div>
  `,
})
export class SongItemComponent {
  @Input() song!: Song;
  @Input() index: number = 0;

  @Output() onPlay = new EventEmitter<Song>();
  @Output() onLike = new EventEmitter<string>();

  playPause(): void {
    this.onPlay.emit(this.song);
  }

  toggleLike(): void {
    this.onLike.emit(this.song.id);
  }
}
