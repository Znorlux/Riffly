// src/app/components/song-item/song-item.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-item',
  standalone: true,
  imports: [CommonModule],
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
          class="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            class="h-8 w-8 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clip-rule="evenodd"
            />
          </svg>
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
          <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
          {{ song.duration }}
        </div>
        <div class="flex items-center mr-4 text-gray-400 text-sm">
          <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
          {{ song.plays }}
        </div>
        <button class="text-gray-400 hover:text-yellow-500 mr-3">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button class="text-gray-400 hover:text-white">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class SongItemComponent {
  @Input() song!: Song;
  @Input() index: number = 0;
}
