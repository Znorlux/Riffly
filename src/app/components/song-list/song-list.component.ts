import { Component, OnInit } from '@angular/core';
import { Song } from '../song-item/song-item.component';
import { SongItemComponent } from '../song-item/song-item.component';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  standalone: true,
  imports: [SongItemComponent],
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];

  ngOnInit(): void {
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
