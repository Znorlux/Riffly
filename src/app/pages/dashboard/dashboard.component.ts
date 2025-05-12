// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { FeaturedCarouselComponent } from '../../components/featured-carousel/featured-carousel.component';
import { ToggleTabsComponent } from '../../components/toggle-tabs/toggle-tabs.component';
import { SongListComponent } from '../../components/song-list/song-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    SidebarComponent,
    TopbarComponent,
    FeaturedCarouselComponent,
    ToggleTabsComponent,
    SongListComponent,
  ],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  activeTab: 'songs' | 'playlists' = 'songs';

  constructor() {}

  ngOnInit(): void {}

  setActiveTab(tab: string): void {
    if (tab === 'songs' || tab === 'playlists') {
      this.activeTab = tab as 'songs' | 'playlists';
    }
  }
}
