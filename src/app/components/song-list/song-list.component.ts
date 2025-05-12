// src/app/components/song-list/song-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';
import { SongItemComponent } from '../song-item/song-item.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, SongItemComponent],
  template: `
    <div class="space-y-2">
      <app-song-item
        *ngFor="let song of songs; let i = index"
        [song]="song"
        [index]="i"
      ></app-song-item>
    </div>
  `,
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];

  ngOnInit(): void {
    // Add this to provide fallback images if your assets don't exist yet
    this.songs.forEach((song) => {
      song.coverImage =
        song.coverImage || 'https://placehold.co/400x400/333/yellow?text=Cover';
      song.creator.avatar =
        song.creator.avatar ||
        'https://placehold.co/100x100/333/yellow?text=User';
    });
    // This would typically come from a service
    this.songs = [
      {
        id: '1',
        title: 'Summer Vibes',
        coverImage: 'assets/img/cover1.jpg',
        creator: {
          name: 'MelodyMaster',
          avatar: 'assets/img/avatar1.jpg',
        },
        tags: ['Lo-fi', 'Chill', 'Summer'],
        duration: '3:25',
        plays: 12500,
        likes: 840,
      },
      {
        id: '2',
        title: 'Neon Dreams',
        coverImage: 'assets/img/cover2.jpg',
        creator: {
          name: 'BeatCrafter',
          avatar: 'assets/img/avatar2.jpg',
        },
        tags: ['Synthwave', 'Electronic'],
        duration: '4:10',
        plays: 8300,
        likes: 620,
      },
      {
        id: '3',
        title: 'Urban Rhythm',
        coverImage: 'assets/img/cover3.jpg',
        creator: {
          name: 'UrbanSound',
          avatar: 'assets/img/avatar3.jpg',
        },
        tags: ['Hip-hop', 'Jazz'],
        duration: '2:55',
        plays: 6200,
        likes: 410,
      },
    ];
  }
}
