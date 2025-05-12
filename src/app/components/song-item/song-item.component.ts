import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Song {
  id: string;
  title: string;
  coverImage: string;
  creator: {
    name: string;
    avatar: string;
  };
  tags: string[];
  duration: string;
  plays: number;
  likes: number;
}

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SongItemComponent {
  @Input() song!: Song;
  @Input() index!: number;
}
