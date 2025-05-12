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
}
