// src/app/models/song.model.ts
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
  isLiked: boolean;
  createdAt: Date;
}

export interface Creator {
  id?: string;
  name: string;
  avatar: string;
  followers?: number;
  verified?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage: string;
  songs: Song[];
  creator: Creator;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType =
  | 'all'
  | 'today'
  | 'week'
  | 'month'
  | 'live'
  | 'staff-picks';

export interface MusicFilter {
  type: FilterType;
  label: string;
  active: boolean;
}
