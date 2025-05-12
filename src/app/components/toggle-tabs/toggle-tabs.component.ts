import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Tab {
  id: 'songs' | 'playlists';
  label: string;
}

@Component({
  selector: 'app-toggle-tabs',
  templateUrl: './toggle-tabs.component.html',
  standalone: true,
})
export class ToggleTabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTab: 'songs' | 'playlists' = 'songs';
  @Output() tabChange = new EventEmitter<'songs' | 'playlists'>();

  onTabClick(tabId: 'songs' | 'playlists'): void {
    this.tabChange.emit(tabId);
  }
}
